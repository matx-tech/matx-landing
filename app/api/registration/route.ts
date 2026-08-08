import { createHash } from 'node:crypto';

import { isValidEmail } from '@/lib/validation';

const REQUIRED_FIELDS = [
  'schoolName',
  'contactName',
  'role',
  'email',
  'phone',
  'classGroups',
] as const;

interface Registration {
  schoolName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  classGroups: string;
  otherRole?: string;
  consent: boolean;
}

// In-memory fixed-window rate limit for the public Slack endpoint: suppresses
// naive bot floods without infra. Client identity mirrors proxy.ts — forwarded
// IP headers (cf-connecting-ip / x-forwarded-for) are trusted only behind a
// trusted reverse proxy (PLAUSIBLE_TRUST_PROXY=true); otherwise every request
// shares one conservative fallback bucket, so a direct client forging headers
// cannot rotate its way around the limit. Memory stays bounded both by the
// window sweep below (entries age out within ~2 windows) and by the
// MAX_LOG_ENTRIES cap (the map cannot exceed it).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
// Hard cap on tracked entries: no matter how fast a flood of spoofed keys
// arrives, the map can never exceed this many entries, so memory stays
// bounded even though a key can linger for up to ~2 windows before the sweep
// below evicts it.
const MAX_LOG_ENTRIES = 10_000;
const submissionLog = new Map<string, { count: number; windowStart: number }>();
let lastPrune = 0;

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  // Prune expired windows at most once per window, not per request: a full
  // sweep on every call would make this hot path O(n) under a flood of
  // spoofed keys (each new key survives a full window, so the flood would
  // cost quadratic total work). One sweep per window bounds entry *age* to
  // roughly two windows and keeps the common case O(1); the MAX_LOG_ENTRIES
  // cap below bounds the map *size* regardless of flood rate.
  if (now - lastPrune >= RATE_LIMIT_WINDOW_MS) {
    for (const [key, entry] of submissionLog) {
      if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) submissionLog.delete(key);
    }
    lastPrune = now;
  }
  const entry = submissionLog.get(clientKey);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    // Delete before set so a refreshed key moves to the back of the map's
    // insertion order instead of staying first — and thus first in line for
    // the cap eviction below — despite its fresh window.
    submissionLog.delete(clientKey);
    submissionLog.set(clientKey, { count: 1, windowStart: now });
    // Enforce the hard cap: Map preserves insertion order, so the first key
    // is always the oldest. Dropping it keeps this O(1) per insertion and the
    // size at exactly MAX_LOG_ENTRIES under sustained flood.
    while (submissionLog.size > MAX_LOG_ENTRIES) {
      const oldestKey = submissionLog.keys().next().value;
      if (oldestKey === undefined) break;
      submissionLog.delete(oldestKey);
    }
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Slack mrkdwn parses &, < and > as markup — escape user-provided values so
// their displayed content is preserved and a raw <...> can't become link
// syntax (or worse) in the notification.
function escapeMrkdwn(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Durable delivery idempotency: an identical registration (same normalized
// payload) must reach Slack at most once. State is in-memory — like the rate
// limiter, bounded by a hard cap and periodic pruning — so a timeout/network
// failure keeps the pending marker until it ages out and a retry answers from
// state instead of double-delivering.
const DELIVERY_RETENTION_MS = 24 * 60 * 60 * 1000; // completed results
const PENDING_RETENTION_MS = 5 * 60 * 1000; // in-flight / ambiguous outcomes
const MAX_DELIVERY_ENTRIES = 10_000;
const deliveryState = new Map<string, { status: 'pending' | 'completed'; at: number }>();
let lastDeliveryPrune = 0;

// SHA-256 digest of the canonical JSON payload — a collision-resistant dedupe
// key. JSON.stringify of the normalized string array is injective (every
// string is quoted and escaped), so distinct payloads — including ones with
// NUL bytes or separator characters — can never share a key.
function submissionKey(fields: readonly string[]): string {
  return createHash('sha256').update(JSON.stringify(fields)).digest('hex');
}

function pruneDeliveries(now: number): void {
  if (now - lastDeliveryPrune < PENDING_RETENTION_MS) return;
  lastDeliveryPrune = now;
  for (const [key, entry] of deliveryState) {
    const retention = entry.status === 'pending' ? PENDING_RETENTION_MS : DELIVERY_RETENTION_MS;
    if (now - entry.at >= retention) deliveryState.delete(key);
  }
}

// Slack section fields cap at 2,000 characters and the label prefixes /
// mrkdwn escaping count against it. Fields are composed below and validated
// by their final rendered length, so a hostile value can't truncate or reject
// the notification after it's queued.
const SLACK_SECTION_FIELD_LIMIT = 2_000;
const FIELD_LABELS = {
  schoolName: '🏫 *Kool*\n',
  contactName: '👤 *Kontaktisik*\n',
  role: '💼 *Roll*\n',
  email: '📧 *E-post*\n',
  phone: '📞 *Telefon*\n',
  classGroups: '👥 *Klassirühmad*\n',
} as const;

/**
 * Submits a pilot registration to Slack after validating the request data and consent.
 *
 * @param request - The request containing the registration details as JSON.
 * @returns A success response when Slack accepts the registration, or an error response for invalid input, missing configuration, or Slack delivery failures.
 */
export async function POST(request: Request) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: 'SLACK_WEBHOOK_URL not configured' }, { status: 503 });
  }

  // Parse as unknown and reject null / arrays / primitives — a bare cast of
  // e.g. `null` would crash on the first field access below.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const data = body as Partial<Registration>;

  // Reject non-string fields before any .trim() — Partial<Registration> is
  // only a TS assertion, a JSON body like { "email": {} } must not 500.
  const missing = REQUIRED_FIELDS.filter(
    (field) => typeof data[field] !== 'string' || data[field].trim().length === 0,
  );
  if (missing.length > 0 || !isValidEmail(data.email)) {
    return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  if (data.consent !== true) {
    return Response.json({ error: 'Consent required' }, { status: 400 });
  }
  if (data.otherRole !== undefined && typeof data.otherRole !== 'string') {
    return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  // Normalize once after validation: the payload (and the dedupe key below)
  // must never carry padding whitespace. The checks above guarantee every
  // REQUIRED_FIELDS entry is a non-empty string and email is valid, so the
  // casts are safe.
  const email = (data.email as string).trim();
  const schoolName = (data.schoolName as string).trim();
  const contactName = (data.contactName as string).trim();
  const roleValue = (data.role as string).trim();
  const otherRole = data.otherRole?.trim() ?? '';
  const phone = (data.phone as string).trim();
  const classGroups = (data.classGroups as string).trim();
  const role =
    roleValue === 'Muu haridustöötaja' && otherRole ? `${roleValue} — ${otherRole}` : roleValue;

  // Escape user input for mrkdwn and compose the section fields. The email
  // link reuses the normalized value for both the mailto target and the link
  // text — no re-parsing of the original input. The target additionally
  // percent-encodes `|` (%7C): even though isValidEmail rejects it, a pipe in
  // the target would otherwise terminate the `<mailto:...|...>` syntax early.
  const emailEsc = escapeMrkdwn(email);
  const emailMailto = emailEsc.replace(/\|/g, '%7C');
  const sectionFields = [
    { type: 'mrkdwn' as const, text: `${FIELD_LABELS.schoolName}${escapeMrkdwn(schoolName)}` },
    { type: 'mrkdwn' as const, text: `${FIELD_LABELS.contactName}${escapeMrkdwn(contactName)}` },
    { type: 'mrkdwn' as const, text: `${FIELD_LABELS.role}${escapeMrkdwn(role)}` },
    {
      type: 'mrkdwn' as const,
      text: `${FIELD_LABELS.email}<mailto:${emailMailto}|${emailEsc}>`,
    },
    { type: 'mrkdwn' as const, text: `${FIELD_LABELS.phone}${escapeMrkdwn(phone)}` },
    { type: 'mrkdwn' as const, text: `${FIELD_LABELS.classGroups}${escapeMrkdwn(classGroups)}` },
  ];
  // Measured on the final composed markup (label + escaping included) so a
  // long value — including the conditional otherRole inside `role` — cannot
  // exceed Slack's 2,000-character section-field limit.
  if (sectionFields.some((field) => field.text.length > SLACK_SECTION_FIELD_LIMIT)) {
    return Response.json({ error: 'Field too long' }, { status: 400 });
  }

  // Idempotent delivery: identical submissions deliver to Slack at most once.
  // Checked before the rate limit so a retry after a timeout is answered from
  // state instead of being throttled or double-posted.
  const key = submissionKey([schoolName, contactName, role, email, phone, classGroups]);
  const now = Date.now();
  pruneDeliveries(now);
  const existing = deliveryState.get(key);
  if (existing?.status === 'completed') {
    return Response.json({ ok: true, deduplicated: true });
  }
  if (existing?.status === 'pending') {
    return Response.json({ ok: true, status: 'pending' }, { status: 202 });
  }

  // Client identity for rate limiting mirrors proxy.ts: forwarded-IP headers
  // are trusted only behind a trusted reverse proxy (PLAUSIBLE_TRUST_PROXY
  // =true, Cloudflare/nginx). On a direct deployment a client can forge them
  // to rotate buckets, so all requests share one conservative fallback bucket
  // and the limit can only be bypassed by the infra operator, not the caller.
  const trustProxyHeaders = process.env.PLAUSIBLE_TRUST_PROXY === 'true';
  const clientKey = trustProxyHeaders
    ? (request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'anonymous')
    : 'anonymous';
  if (isRateLimited(clientKey)) {
    return Response.json({ error: 'Too many requests, try again later' }, { status: 429 });
  }

  // Escape user input for mrkdwn in the plain-text fallback too: Slack parses
  // the `text` property as mrkdwn, so a raw value like `https://evil.example`
  // would render as a clickable link here if left unescaped.
  const lines = [
    'Uus piloodi registreerimine',
    `Kool: ${escapeMrkdwn(schoolName)}`,
    `Kontaktisik: ${escapeMrkdwn(contactName)}`,
    `Roll: ${escapeMrkdwn(role)}`,
    `E-post: ${escapeMrkdwn(email)}`,
    `Telefon: ${escapeMrkdwn(phone)}`,
    `Klassirühmad: ${escapeMrkdwn(classGroups)}`,
  ].join('\n');

  const payload = {
    text: lines, // fallback for push notifications and plain-text clients
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Uus piloodi registreerimine' },
      },
      { type: 'section', fields: sectionFields },
    ],
  };

  // Record pending before the network call: a timeout or network failure
  // leaves an ambiguous outcome, and retaining the marker keeps a retry from
  // queuing a second delivery until it ages out (PENDING_RETENTION_MS).
  deliveryState.set(key, { status: 'pending', at: now });
  if (deliveryState.size > MAX_DELIVERY_ENTRIES) {
    const oldest = deliveryState.keys().next().value;
    if (oldest !== undefined) deliveryState.delete(oldest);
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      // Release the Undici response stream before returning the error.
      await res.body?.cancel();
      return Response.json({ error: 'Slack webhook failed' }, { status: 502 });
    }
    // Drain/cancel the response body so the connection is released.
    await res.body?.cancel();
    deliveryState.set(key, { status: 'completed', at: Date.now() });
    return Response.json({ ok: true });
  } catch {
    // Ambiguous outcome — keep the pending marker (see PENDING_RETENTION_MS).
    return Response.json({ error: 'Slack webhook failed' }, { status: 502 });
  }
}
