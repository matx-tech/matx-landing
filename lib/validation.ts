// Linear email check (no backtracking regex): indexOf-based, so adversarial
// input cannot trigger backtracking (CodeQL js/polynomial-redos). RFC 5321
// caps addresses at 254 chars — reject anything longer outright.
export function isValidEmail(value: string | undefined): boolean {
  const email = (value ?? '').trim();
  // Reject `|` outright: a pipe inside the composed `<mailto:...|...>` Slack
  // mrkdwn link would terminate the URL portion at the first `|`.
  if (email.length === 0 || email.length > 254 || /\s/.test(email) || email.includes('|'))
    return false;
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
