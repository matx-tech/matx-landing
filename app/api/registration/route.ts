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

// Linear email check (no backtracking regex): indexOf-based, so adversarial
// input cannot trigger backtracking (CodeQL js/polynomial-redos). RFC 5321
// caps addresses at 254 chars — reject anything longer outright.
function isValidEmail(value: string | undefined): boolean {
  const email = (value ?? '').trim();
  if (email.length === 0 || email.length > 254 || /\s/.test(email)) return false;
  const at = email.indexOf('@');
  if (at <= 0) return false;
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf('.');
  return (
    dot > 0 &&
    dot < domain.length - 1 &&
    // Reject multi-@ addresses (a@b@c.com): the domain must not contain @.
    email.indexOf('@', at + 1) === -1
  );
}

// In-memory fixed-window rate limit for the public Slack endpoint: suppresses
// naive bot floods without infra. Client identity mirrors proxy.ts — forwarded
// IP headers (cf-connecting-ip / x-forwarded-for) are trusted only behind a
// trusted reverse proxy (PLAUSIBLE_TRUST_PROXY=true); otherwise every request
// shares one conservative fallback bucket, so a direct client forging headers
// cannot rotate its way around the limit.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
// Hard cap on tracked client keys: even a sustained flood of spoofed keys
// (each surviving up to ~2 windows before the next sweep) cannot grow the map
// past this many entries.
const RATE_LIMIT_MAX_KEYS = 10_000;
const submissionLog = new Map<string, { count: number; windowStart: number }>();
let lastPrune = 0;

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  // Prune expired windows at most once per window, not per request: a full
  // sweep on every call would make this hot path O(n) under a flood of
  // spoofed keys (each new key survives a full window, so the flood would
  // cost quadratic total work). One sweep per window keeps the common case
  // O(1).
  if (now - lastPrune >= RATE_LIMIT_WINDOW_MS) {
    for (const [key, entry] of submissionLog) {
      if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) submissionLog.delete(key);
    }
    lastPrune = now;
  }
  const entry = submissionLog.get(clientKey);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    // Hard cap: evict the oldest entry (Map insertion order) when the map is
    // full, so memory stays bounded regardless of flood rate. Amortized O(1)
    // — each request inserts at most one entry, so at most one eviction.
    if (submissionLog.size >= RATE_LIMIT_MAX_KEYS) {
      const oldest = submissionLog.keys().next().value;
      if (oldest !== undefined) submissionLog.delete(oldest);
    }
    submissionLog.set(clientKey, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// Pilot registration → Slack. One-way fire-and-forget; if Slack is down the
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

  let data: Partial<Registration>;
  try {
    data = (await request.json()) as Partial<Registration>;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

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

  const role =
    data.role === 'Muu haridustöötaja' && data.otherRole
      ? `${data.role} — ${data.otherRole}`
      : data.role;

  const lines = [
    'Uus piloodi registreerimine',
    `Kool: ${data.schoolName}`,
    `Kontaktisik: ${data.contactName}`,
    `Roll: ${role}`,
    `E-post: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Klassirühmad: ${data.classGroups}`,
  ].join('\n');

  const payload = {
    text: lines, // fallback for push notifications and plain-text clients
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 Uus piloodi registreerimine' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `🏫 *Kool*\n${data.schoolName}` },
          { type: 'mrkdwn', text: `👤 *Kontaktisik*\n${data.contactName}` },
          { type: 'mrkdwn', text: `💼 *Roll*\n${role}` },
          { type: 'mrkdwn', text: `📧 *E-post*\n<mailto:${data.email}|${data.email}>` },
          { type: 'mrkdwn', text: `📞 *Telefon*\n${data.phone}` },
          { type: 'mrkdwn', text: `👥 *Klassirühmad*\n${data.classGroups}` },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return Response.json({ error: 'Slack webhook failed' }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Slack webhook failed' }, { status: 502 });
  }
}
