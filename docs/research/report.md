<svg viewBox="0 0 100 100" data-test-id="CircularProgressbar"><path style="stroke: rgb(55, 65, 81); stroke-linecap: round; stroke-dasharray: 282.743px, 282.743px; stroke-dashoffset: 0px;" d="
      M 50,50
      m 0,-45
      a 45,45 0 1 1 0,90
      a 45,45 0 1 1 0,-90
    " stroke-width="10" fill-opacity="0" fill="none"></path><path style="stroke: url(&quot;#warningGradient&quot;); stroke-linecap: round; transition-duration: 1.5s; stroke-dasharray: 282.743px, 282.743px; stroke-dashoffset: 90.4779px;" d="
      M 50,50
      m 0,-45
      a 45,45 0 1 1 0,90
      a 45,45 0 1 1 0,-90
    " stroke-width="10" fill-opacity="0" fill="none"></path><text style="fill: rgb(243, 244, 246); font-size: 24px;" x="50" y="50">68</text></svg>

## matx.ee

C

Your IP: 85.253.100.138/9/2026

Moderate security implementation requiring attention.

Security Coverage

Redirect Chain

No redirects

HTTP Headers

9 present, 8 missing

Content Security Policy

Good

Page Analysis

Excellent

Client Code Security

Good

Web Server Security

Weak

TLS / HTTPS Security

Good

DNS Security

Weak

Email Security

Good

security.txt

Found

Compliance

Weak

### Redirect Chain

No redirects detected

[Guide](https://www.sitesecurityscore.com/learning-center/redirect-chain-security)

URL resolved directly with no redirects.

#### Recommendations

•

Add a Strict-Transport-Security header so browsers skip HTTP entirely on future visits.

### HTTP Headers

9 of 17 security headers present

[Guide](https://www.sitesecurityscore.com/learning-center)

default-src 'none'; script-src 'nonce-PYjmJlEKAjQStp4ofMdQbr' 'unsafe-eval' https://challenges.cloudflare.com; script-src-attr 'none'; style-src 'unsafe-inline'; img-src 'self' https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com blob:; child-src 'self' https://challenges.cloudflare.com blob:; worker-src blob:; form-action http: https:; base-uri 'self'

Helps prevent XSS attacks by controlling allowed content sources.

Mitigates OWASP Top 10A03 · InjectionA05 · Security Misconfiguration

[Try free CSP generator](https://www.sitesecurityscore.com/tools/csp-generator)

This header is not set on the server response.

Forces secure HTTPS connections to protect user data.

Mitigates OWASP Top 10A02 · Cryptographic FailuresA05 · Security Misconfiguration

[Try free HSTS generator](https://www.sitesecurityscore.com/tools/hsts-generator)

same-origin

StrongFull cross-origin isolation

Prevents other origins from opening your site in new windows.

Mitigates OWASP Top 10A05 · Security Misconfiguration

require-corp

StrongAll cross-origin resources must opt in via CORP

Prevents loading of cross-origin resources without explicit permission.

Mitigates OWASP Top 10A05 · Security Misconfiguration

SAMEORIGIN

ModerateAllows same-origin framing

Prevents your site from being embedded in iframes to avoid clickjacking.

Mitigates OWASP Top 10A05 · Security Misconfiguration

nosniff

Strong

Prevents MIME type sniffing, reducing script injection risks.

Mitigates OWASP Top 10A03 · InjectionA05 · Security Misconfiguration

same-origin

StrongOnly same-origin requests can load this resource

Controls which origins can load your resources.

Mitigates OWASP Top 10A05 · Security Misconfiguration

same-origin

Strong

Controls how much referrer information is sent with requests.

Mitigates OWASP Top 10A05 · Security Misconfiguration

accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),geolocation=(),gyroscope=(),hid=(),magnetometer=(),microphone=(),payment=(),publickey-credentials-get=(),screen-wake-lock=(),serial=(),sync-xhr=(),usb=(),xr-spatial-tracking=\*

Restricts what browser features can be used by your website.

Mitigates OWASP Top 10A05 · Security Misconfiguration

[Try free Permissions Policy generator](https://www.sitesecurityscore.com/tools/permissions-policy-generator)

This header is not set on the server response.

Upgrades HTTP requests to HTTPS.

Mitigates OWASP Top 10A02 · Cryptographic Failures

This header is not set on the server response.

Controls Adobe Flash and PDF cross-domain policies.

Mitigates OWASP Top 10A05 · Security Misconfiguration

This header is not set on the server response.

Controls DNS prefetching behavior.

Mitigates OWASP Top 10A05 · Security Misconfiguration

?1

StrongOrigin-keyed agent cluster isolation enabled

Controls origin agent cluster behavior.

Mitigates OWASP Top 10A05 · Security Misconfiguration

This header is not set on the server response.

Clears browser data for the site.

Mitigates OWASP Top 10A07 · Identification and Authentication Failures

This header is not set on the server response.

Configures document behaviours such as disallowing document.write or synchronous XHR. Reported when set but does not affect the score.

Chromium browsers only (Chrome, Edge) [Read the full guide](https://www.sitesecurityscore.com/learning-center/document-policy)

Mitigates OWASP Top 10A05 · Security Misconfiguration

This header is not set on the server response.

Requires scripts to load with Subresource Integrity (SRI) hashes, blocking un-hashed scripts. Reported when set but does not affect the score.

[Read the full guide](https://www.sitesecurityscore.com/learning-center/integrity-policy)

Mitigates OWASP Top 10A05 · Security Misconfiguration

This header is not set on the server response.

Deprecated browser XSS filter. Removed from Chrome (2019) and never supported by Firefox. A strong CSP supersedes it. No action required.

Mitigates OWASP Top 10A03 · Injection

Informational, legacy header. No action required.

Information Disclosure

1 found

cloudflare

This header reveals server configuration details that could help attackers fingerprint your infrastructure.

Consider removing or genericizing this header to improve security

### Content Security Policy

11 directives configured

[Guide](https://www.sitesecurityscore.com/csp-analysis-guide)

[Now you can collect and monitor CSP violation reports for your site](https://www.sitesecurityscore.com/monitoring/csp-violations)

Score

Good

Directives

11

Issues

2

#### Directives (11)

default-src

'none'

script-src

'nonce-PYjmJlEKAjQStp4ofMdQbr' 'unsafe-eval' https://challenges.cloudflare.com

script-src-attr

'none'

style-src

'unsafe-inline'

img-src

'self' https://challenges.cloudflare.com

connect-src

'self' https://challenges.cloudflare.com

frame-src

'self' https://challenges.cloudflare.com blob:

child-src

'self' https://challenges.cloudflare.com blob:

worker-src

blob:

form-action

http: https:

base-uri

'self'

#### Issues (2)

Uses unsafe-eval directive (code injection risk)

Missing object-src directive

#### Recommendations

•

Avoid unsafe-eval, use safer alternatives

•

Add object-src 'none' to prevent plugin attacks

### Page Analysis

Mixed content, SRI, base tag, and external resources

Mixed Content

No mixed content detected

Base Tag

No base tag detected

Subresource Integrity (SRI) Coverage

1/1 script have integrity hashes

Technologies in Use

18 technologies detected

### Client Code Security

23 of 24 client code checks pass

Exposed files

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

Exposed endpoints

No issue detected.

No issue detected.

No issue detected.

No issue detected.

Leaked secrets

No issue detected.

Configuration

No issue detected.

Vulnerable dependencies

No issue detected.

Code quality

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

No issue detected.

1 prototype pollution vector detected: \_\_proto\_\_/constructor parameters reflected in response. Attackers can inject properties into JavaScript object prototypes, potentially bypassing security checks or causing denial of service.

Sanitize user input before merging into objects. Use Object.create(null) for lookup maps. Avoid deep merge of untrusted data. Consider using Map instead of plain objects for user-controlled keys.

\_\_proto\_\_/constructor parameters reflected in response

No issue detected.

No issue detected.

### Web Server Security

11 of 16 web server checks pass· Server IP: 104.21.47.232

Server fingerprint

Server software (cloudflare) is identified but the version is hidden.

Serving over HTTP/1.1. Modern HTTP versions reduce latency through multiplexing.

Defenses

No sensitive database, cache, or remote management ports were reachable on this host.

Detected: Cloudflare. Provides a layer of protection against common web attacks before requests reach your origin.

Configuration

No CORS headers exposed.

No information-disclosure or deprecated security headers detected.

Deep scan: exposed surface

7 admin endpoints reachable. Common target for brute force and credential stuffing. Restrict to internal networks, behind VPN, or use IP allowlists.

3 risky methods enabled. Attackers can use these to modify content, delete resources, or perform cross-site tracing.

`PUT` `DELETE` `PATCH`

No directory listings detected. The server properly restricts directory index responses.

No sensitive config files publicly accessible.

Error responses do not expose server version, stack traces, or internal file paths.

No active bot protection detected. Consider Cloudflare Bot Management, Akamai Bot Manager, or a similar service if you receive significant automated traffic.

Network security

No rate limiting headers detected. Without rate limiting, your API is vulnerable to brute force attacks, credential stuffing, and abuse.

Add rate limiting middleware (e.g., express-rate-limit for Express, or configure rate limiting on your hosting platform like Vercel/Cloudflare).

### TLS / HTTPS Security

9 of 13 TLS checks pass

Certificate trust

Certificate chains to a trusted root and covers this domain.

Issued by: Let's Encrypt

46 days until expiry.

Subject

CN=matx.ee

Issuer Org

Let's Encrypt

Valid From

6/26/2026

Valid Until

9/24/2026

Key

ECDSA P-256

Signature

ECDSA-SHA384

Cert. Transparency

SCTs embedded

Subject Alt Names (2)

\*.matx.eematx.ee

Complete chain

Transport encryption

Negotiated TLS version: TLSv1.3.

Old TLS versions are not negotiable on this server.

HTTPS enforcement

HSTS is not enabled. Visitors on HTTP can be intercepted via downgrade attacks. Add Strict-Transport-Security with at least max-age=31536000.

HSTS is not enabled.

Deep TLS configuration

Session keys are ephemeral. Past traffic stays private even if the server key is compromised later.

Cipher Suite

TLS\_AES\_256\_GCM\_SHA384

Key Exchange

ECDHE

Key Exchange Group

X25519 (253-bit)

HSTS is not enabled.

Requests to http:// redirect to https://.

OCSP stapling is not enabled. Browsers may need to contact the CA separately to check revocation, which is slower and leaks browsing data.

Server negotiates HTTP/2 over the TLS handshake.

Not applicable to TLS 1.3 (renegotiation removed from the protocol).

Server reuses a session ticket on reconnect. Faster handshakes for repeat visitors.

### DNS Security

4 of 7 DNS infrastructure checks pass

DNS integrity and authority

DNSSEC is not enabled. DNS responses for this domain can be spoofed via cache poisoning or on-path attacks, redirecting users to fake servers.

Enable DNSSEC at your registrar or DNS provider, then publish DS records at your TLD registry. DNSSEC is also a prerequisite for DANE (TLS certificate pinning).

No CAA records. Any certificate authority can issue certificates for this domain. This is the same root cause that enabled the DigiNotar and Comodo incidents.

Add a CAA TXT record at the apex listing the CAs you actually use. Example: `0 issue "letsencrypt.org"`

DNS infrastructure resilience

We checked 1 hostname from this domain's certificate and DNS, and found no dangling records that could be taken over.

2 nameservers configured. DNS resolution survives the failure of any single nameserver.

`jaxson.ns.cloudflare.com`

`diva.ns.cloudflare.com`

All nameservers operated by a single provider (Cloudflare). If that provider has an outage, your domain becomes unreachable.

Providers

Cloudflare · 2 NS

Add nameservers from a second DNS provider for true outage resilience. The 2016 Dyn DDoS attack and 2021 Route 53 outage both took down single-provider domains for hours.

Confirmed reachable over IPv6. A live HTTPS connection succeeded from 4 of 4 global test locations.

`2606:4700:3035::6815:2fe8`

`2606:4700:3033::ac43:ae78`

Operations

Your DNS is hosted by Cloudflare.

#### DNS Records

A Records (IPv4)

104.21.47.232, 172.67.174.120

AAAA Records (IPv6)

2606:4700:3035::6815:2fe8, 2606:4700:3033::ac43:ae78

MX Records (Mail)

69 route2.mx.cloudflare.net

6 route1.mx.cloudflare.net

62 route3.mx.cloudflare.net

TXT Records (3)

`slack-domain-verification=VwZUu7Jq3f0WtmG3jPUSy8tCYdPAtIAX7obMlkXG`

`v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com include:amazonses.com ~all`

`google-site-verification=sJCLp-8ZFf-BNwFWONeJBnHdvYhhNan-Snggj3ovgdg`

Issues (2)

No CAA records found. Any CA can issue certificates for this domain.

Recommendations

•

Add CAA DNS records to restrict which certificate authorities can issue certificates for your domain.

•

Enable DNSSEC to protect against DNS spoofing and cache poisoning attacks.

### Email Security

7 of 10 email security checks pass

Brand identity in inbox

No BIMI record. Your brand logo will not appear in supported inboxes alongside your messages.

BIMI requires DMARC enforcement (p=quarantine or p=reject) before logos appear. Add a BIMI TXT record at default.\_bimi pointing to an SVG of your logo.

Mail provider detected: Cloudflare Email Routing. 3 MX records configured.

Will inbound mail be delivered securely?

No MTA-STS policy. Inbound mail uses opportunistic TLS that can be downgraded.

Add a TXT record at `_mta-sts.<your-domain>` and publish a policy at `https://mta-sts.<your-domain>/.well-known/mta-sts.txt` with `mode: enforce`.

No TLS-RPT record. You will not be notified when senders fail to deliver mail to you over TLS.

Add a TXT record at `_smtp._tls.<your-domain>` with `v=TLSRPTv1; rua=mailto:tls@<your-domain>`.

TLSA records found on 3 of 3 mail servers.

Can attackers impersonate your domain?

DMARC enforces rejection of spoofed mail.

Policy: `p=reject` · sp=reject · aspf=s · adkim=s

DMARC:v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s; rua=mailto:ae045ee7a7384e64aca185c39c431ece@dmarc-reports.cloudflare.net;

SPF soft-fails unauthorized servers (~all). Mail may still be delivered to spam.

DNS lookups in SPF: 3/10

SPF:v=spf1 include:\_spf.mx.cloudflare.net include:\_spf.google.com include:amazonses.com ~all

Outbound mail is signed. Found DKIM keys at default, dkim, mail, k1, k2, k3, s1, s2, google, selector1, selector2, cf2024-1, cf2024-2, cf2025-1, cf2025-2, mxa, mxb, mg, mailo, amazonses, aws, pm, m1, em, mandrill, mte1, mte2, zoho, zmail, hse1, hse2, 20161025, 20210112, 20230601, protonmail, protonmail2, protonmail3, brevo1, brevo2, kl, kl2, zendesk1, fm1, fm2, fm3, smtpapi, pps1, 200608.

`default._domainkey`: key strength unknown

`dkim._domainkey`: key strength unknown

`mail._domainkey`: key strength unknown

`k1._domainkey`: key strength unknown

`k2._domainkey`: key strength unknown

`k3._domainkey`: key strength unknown

`s1._domainkey`: key strength unknown

`s2._domainkey`: key strength unknown

`google._domainkey`: key strength unknown

`selector1._domainkey`: key strength unknown

`selector2._domainkey`: key strength unknown

`cf2024-1._domainkey`: 2048 bits

`cf2024-2._domainkey`: key strength unknown

`cf2025-1._domainkey`: key strength unknown

`cf2025-2._domainkey`: key strength unknown

`mxa._domainkey`: key strength unknown

`mxb._domainkey`: key strength unknown

`mg._domainkey`: key strength unknown

`mailo._domainkey`: key strength unknown

`amazonses._domainkey`: key strength unknown

`aws._domainkey`: key strength unknown

`pm._domainkey`: key strength unknown

`m1._domainkey`: key strength unknown

`em._domainkey`: key strength unknown

`mandrill._domainkey`: key strength unknown

`mte1._domainkey`: key strength unknown

`mte2._domainkey`: key strength unknown

`zoho._domainkey`: key strength unknown

`zmail._domainkey`: key strength unknown

`hse1._domainkey`: key strength unknown

`hse2._domainkey`: key strength unknown

`20161025._domainkey`: key strength unknown

`20210112._domainkey`: key strength unknown

`20230601._domainkey`: key strength unknown

`protonmail._domainkey`: key strength unknown

`protonmail2._domainkey`: key strength unknown

`protonmail3._domainkey`: key strength unknown

`brevo1._domainkey`: key strength unknown

`brevo2._domainkey`: key strength unknown

`kl._domainkey`: key strength unknown

`kl2._domainkey`: key strength unknown

`zendesk1._domainkey`: key strength unknown

`fm1._domainkey`: key strength unknown

`fm2._domainkey`: key strength unknown

`fm3._domainkey`: key strength unknown

`smtpapi._domainkey`: key strength unknown

`pps1._domainkey`: key strength unknown

`200608._domainkey`: key strength unknown

Aggregate reports are sent to mailto:ae045ee7a7384e64aca185c39c431ece@dmarc-reports.cloudflare.net. You will be notified when attackers attempt to spoof your domain.

Meets the Google and Yahoo bulk sender requirements that took effect in February 2024.

Required for any domain sending more than 5,000 messages per day to Gmail or Yahoo addresses. Non-compliant mail may be rejected or routed to spam.

### security.txt

Vulnerability disclosure contact information

Contact

mailto:security@proksiabel.ee

Expires

2027-01-01T00:00:00Z

Recommendations

Add an Encryption field with a PGP key URL so researchers can send reports securely.

Add a Policy field linking to your vulnerability disclosure policy.

CC6.7Transmission of Confidential Information

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

CC7.2System Monitoring

CSP has no report-uri or report-to directive

Fix: Add a report-uri or report-to directive to your CSP to enable real-time violation monitoring. Mandatory for PCI DSS 11.6.1 compliance since April 2025.

CC8.1Change Management

Server or X-Powered-By header discloses software version

Fix: Remove or redact the Server and X-Powered-By response headers in your web server or reverse proxy configuration.

CC6.1Logical Access Controls

Content-Security-Policy is present and effective

CC6.6Logical Access from Outside the Boundary

CORS is configured with an explicit origin allowlist

CC6.8Prevention of Unauthorized Software

Content-Security-Policy is present and effective

CC7.3Security Incident Evaluation

.env file is not publicly accessible

CC9.2Risk Mitigation

SPF record is present and valid

CSP has no report-uri or report-to directive

Fix: Add a report-uri or report-to directive to your CSP to enable real-time violation monitoring. Mandatory for PCI DSS 11.6.1 compliance since April 2025.

2.2System Configuration Hardening

Server or X-Powered-By header discloses software version

Fix: Remove or redact the Server and X-Powered-By response headers in your web server or reverse proxy configuration.

2.2.7All non-console admin access encrypted

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

4.2.1Strong cryptography in transit

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

6.5Secure development practices

Server or X-Powered-By header discloses software version

Fix: Remove or redact the Server and X-Powered-By response headers in your web server or reverse proxy configuration.

12.3.2Targeted risk analysis

SPF record is present and valid

6.4.1Public-facing web app protection

Content-Security-Policy is present and effective

6.4.3Payment page script management

Content-Security-Policy is present and effective

7.2Access control systems

Permissions-Policy is configured to restrict browser feature access

Art. 32(1)(a)Encryption of personal data

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

Art. 32(1)(d)Regular testing and evaluation

CSP has no report-uri or report-to directive

Fix: Add a report-uri or report-to directive to your CSP to enable real-time violation monitoring. Mandatory for PCI DSS 11.6.1 compliance since April 2025.

Art. 25Data Protection by Design and Default

Referrer-Policy is configured to limit referrer data leakage

Art. 32(1)(b)Confidentiality and integrity

Content-Security-Policy is present and effective

A.8.16Monitoring activities

CSP has no report-uri or report-to directive

Fix: Add a report-uri or report-to directive to your CSP to enable real-time violation monitoring. Mandatory for PCI DSS 11.6.1 compliance since April 2025.

A.8.20Network security

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

A.8.24Use of cryptography

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

A.8.25Secure development lifecycle

Server or X-Powered-By header discloses software version

Fix: Remove or redact the Server and X-Powered-By response headers in your web server or reverse proxy configuration.

A.8.9Configuration management

Server or X-Powered-By header discloses software version

Fix: Remove or redact the Server and X-Powered-By response headers in your web server or reverse proxy configuration.

A.5.14Information transfer

Referrer-Policy is configured to limit referrer data leakage

A.8.23Web filtering

Content-Security-Policy is present and effective

A.8.26Application security requirements

Content-Security-Policy is present and effective

A.8.28Secure coding

Content-Security-Policy is present and effective

§164.308(a)(1)Security management process

CSP has no report-uri or report-to directive

Fix: Add a report-uri or report-to directive to your CSP to enable real-time violation monitoring. Mandatory for PCI DSS 11.6.1 compliance since April 2025.

§164.312(e)(1)Transmission security

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

§164.312(e)(2)(ii)Encryption of ePHI in transit

Strict-Transport-Security missing or max-age below PCI minimum

Fix: Add Strict-Transport-Security: max-age=31536000; includeSubDomains. PCI DSS requires a minimum max-age of 10,368,000 seconds (120 days).

§164.312(a)(1)Access control

No unauthenticated admin panel detected

§164.312(a)(2)(iv)Encryption and decryption

No unauthenticated admin panel detected

§164.312(b)Audit controls

Content-Security-Policy is present and effective

Compliance readiness is based on automated checks. Have a qualified assessor review results before using for audit purposes.

19/20 downloads remaining this month

20/20 shares remaining this month

20/20 shares remaining this month
