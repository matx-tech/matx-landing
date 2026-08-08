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
}

// Pilot registration → Slack. One-way fire-and-forget; if Slack is down the
// signup is lost, so the client keeps its draft and asks for a retry.
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

  const missing = REQUIRED_FIELDS.filter((field) => !data[field]?.trim());
  if (missing.length > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')) {
    return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
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

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return Response.json({ error: 'Slack webhook failed' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
