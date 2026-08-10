## SiteSecurityScore


##### Security Report


```
August 9, 2026 at 08:25 AM
```

## https://matx.ee


```
Generated: August 9, 2026 at 08:25 AM
```

# 68


###### /10


# Grade C


##### Fair : Moderate security


##### implementation requiring


##### attention.


###### AT A GLANCE


##### Redirect Chain No redirects


##### HTTP Headers 9 present, 6 missing


##### Content Security Policy Good


##### Page Analysis Excellent


##### Cookie Security None detected


##### Client Code Security Good


##### Web Server Security Weak


##### TLS / HTTPS Security Good


##### DNS Security Weak


##### Email Security Good


##### security.txt Found


##### Compliance Weak


##### This scan identified 5 missing security headers, including the critical strict-transport-security


##### header. TLS is adequately configured with minor improvements available. Moderate security


##### implementation requiring attention.


SiteSecurityScore https://matx.ee


### Redirect Chain No redirects


```
Inspects how the initial request is redirected before reaching its final destination. Long chains, HTTP hops, and
temporary redirects add latency and weaken security.
```

```
Hops
```

#### 0


```
Final URL
```

#### https://matx.ee


##### No redirects. The initial request reaches its destination directly.


### HTTP Headers 9 present, 6 missing


```
Checks for HTTP response headers that control browser security behavior.
```

###### HEADER IMPORTANCE DESCRIPTION


```
content-security-policy
```

```
default-src 'none'; script-src 'nonce-PYj
mJlEKAjQStp4ofMdQbr' 'unsafe-eval' h
ttps://challenges.cloudflare.com; scrip
t...
```

```
Critical
```

##### Controls which resources the browser is


##### allowed to load, preventing XSS attacks.


```
strict-transport-security Critical
```

##### Forces browsers to use HTTPS for future


##### visits, preventing protocol downgrade


##### attacks.


```
x-frame-options
```

```
SAMEORIGIN
```

```
High
```

##### Prevents the page from being embedded


##### in iframes, protecting against clickjacking.


```
x-content-type-options
```

```
nosniff
```

```
High
```

##### Prevents browsers from MIME-sniffing a


##### response away from the declared content


##### type.


```
referrer-policy
```

```
same-origin
```

```
Medium
```

##### Controls how much referrer information is


##### included with requests made from the


##### page.


###### HEADER IMPORTANCE DESCRIPTION


```
permissions-policy
```

```
accelerometer=(),camera=(),clipboard-
read=(),clipboard-write=(),geolocation
=(),gyroscope=(),hid=(),magnetometer
=(),mi...
```

```
Medium
```

##### Controls which browser features and APIs


##### can be used on the page.


```
cross-origin-opener-policy
```

```
same-origin
```

```
Medium
```

##### Protects your origin from being accessed


##### by cross-origin popups.


```
cross-origin-embedder-policy
```

```
require-corp
```

```
Medium
```

##### Prevents loading cross-origin resources


##### that do not explicitly grant permission.


```
cross-origin-resource-policy
```

```
same-origin
```

```
Medium
```

##### Prevents other origins from reading the


##### resource's response.


```
x-permitted-cross-domain-policies Low
```

##### Controls Adobe Flash and PDF cross-


##### domain data access policies.


```
x-xss-protection Informational
```

##### Legacy XSS filter for older browsers.


##### Modern browsers ignore this header.


### Information Disclosure


Headers that expose server details and may assist attackers in fingerprinting.


###### HEADER RISK VALUE


```
server
```

```
Security
Risk
```

```
cloudflare
```

```
Reveals server details that could help attackers
fingerprint your infrastructure.
```

### Content Security Policy Good


Evaluates the CSP header strength and identifies directives that may allow unsafe content.


```
Quality
```

#### Good


```
Directives
```

#### 11


```
Issues
```

#### 2


#### Directives (11)


##### default-src


```
'none'
```

##### script-src


```
'nonce-PYjmJlEKAjQStp4ofMdQbr' 'unsafe-eval' https://challenges.cloudflare.com
```

##### script-src-attr


```
'none'
```

##### style-src


```
'unsafe-inline'
```

##### img-src


```
'self' https://challenges.cloudflare.com
```

##### connect-src


```
'self' https://challenges.cloudflare.com
```

##### frame-src


```
'self' https://challenges.cloudflare.com blob:
```

##### child-src


```
'self' https://challenges.cloudflare.com blob:
```

##### worker-src


```
blob:
```

##### form-action


```
http: https:
```

##### base-uri


```
'self'
```

#### Issues (2)


##### Uses unsafe-eval directive (code injection risk)


##### Missing object-src directive


#### Recommendations


##### Avoid unsafe-eval, use safer alternatives


##### Add object-src 'none' to prevent plugin attacks


### Page Analysis Excellent


```
Inspects the page's HTML source for mixed content, subresource integrity, base tag usage, external dependencies,
and directory listing exposure.
```

###### CHECK RESULT


##### Mixed Content


```
HTTP resources on an HTTPS
page can be intercepted.
```

##### None detected


##### Base Tag


```
Sets base URL for all relative
links. CSP base-uri is the
countermeasure.
```

##### No base tag detected


##### Subresource Integrity


```
Integrity hashes verify external
scripts and stylesheets have
not been tampered with.
```

##### All 1 resource have integrity hashes


##### External Tags


```
Third-party domains detected
in static HTML, resource hints,
and inline loaders.
```

##### 1 external domain detected


```
static.cloudflareinsights.com
```

##### Directory Listing


```
Web server exposes directory
contents when no index file is
present.
```

##### No directory listings detected


#### Technologies Detected


###### ANALYTICS


```
Google Search Console
```

###### CHAT


```
Slack Zendesk
```

###### HOSTING


```
Cloudflare
```

**EMAIL**


```
Amazon SES Brevo Google Workspace Mailchimp Mailo Mandrill Microsoft 365
```

**DNS**


```
Cloudflare DNS
```

###### FRAMEWORK


```
Next.js
```

###### CSS FRAMEWORK


```
Tailwind CSS Styled Components
```

##### Showing 15 of 18 detected technologies. See the full list in the web report at sitesecurityscore.com.


### Cookie Security


```
Evaluates security flags set on cookies returned by the server.
```

##### No cookies detected for this domain.


### Client Code Security Good


```
Security checks for client-side code and application configuration.
```

#### Exposed Files


##### .env File


##### .git Directory


##### Source Maps


##### API Documentation


##### Dependency Lock Files


#### Exposed Endpoints


##### Unauthenticated API Routes


##### Health / Metrics Endpoints


##### Webhook Endpoints


##### Cron / Task Endpoints


#### Leaked Secrets


##### Secrets in Client Code


#### Configuration


##### Debug Mode


#### Vulnerable Dependencies


##### JavaScript Libraries


#### Code Quality


##### Inline Event Handlers & eval()


##### Sensitive Data in localStorage


##### Client-side Environment Leaks


##### Insecure Forms


##### Sensitive HTML Comments


##### Hardcoded Localhost / Dev URLs


##### Unminified Production JavaScript


##### Unprotected File Uploads


##### Prototype Pollution Vectors


```
1 prototype pollution vector detected: __proto__/constructor parameters reflected in response. Attackers can
inject properties into JavaScript object prototypes, potentially bypassing security checks or causing denial of
service.
Sanitize user input before merging into objects. Use Object.create(null) for lookup maps. Avoid deep merge of
untrusted data. Consider using Map instead of plain objects for user-controlled keys.
```

##### Exposed Error Tracking DSN


##### Multiple Frontend Frameworks


### Web Server Security Weak


```
Server fingerprint, WAF detection, CORS policy, exposed endpoints, and configuration.
```

```
Server IP
```

#### 104.21.47.23


```
Server Software
```

#### cloudflare


```
HTTP Version
```

#### HTTP/1.


```
Compression
```

#### zstd


```
WAF / CDN
```

#### Cloudflare


```
CORS
```

#### No CORS headers


#### Deep scan: exposed surface


##### Admin panels publicly reachable


```
7 admin endpoint(s) reachable: /wp-login.php, /cpanel, /manager, /dashboard, /server-status, /server-info,
/_profiler
```

##### Risky HTTP methods


```
Enabled: PUT, DELETE, PATCH
```

##### Directory listing


```
No directory listings detected.
```

##### Sensitive config files


```
No sensitive config files publicly accessible.
```

##### Error pages


```
Error responses do not leak platform details.
```

##### Bot protection


```
No active bot protection detected.
```

#### Network Security


##### Rate Limiting


```
No rate limiting headers detected. Without rate limiting, your API is vulnerable to brute force attacks,
credential stuffing, and abuse.
```

##### Open Redirect


##### Robots.txt Path Leakage


### TLS / HTTPS Security Good


```
Analyzes the SSL/TLS certificate and connection security configuration.
```

```
Quality
```

#### Good


```
TLS Version
```

#### TLSv1.


```
Certificate
```

#### Valid


```
Cert Type
```

#### DV


```
Issuer
```

#### CN=YE1, O=Let's Encrypt, C=US


```
Days to Expiry
```

#### 46


```
HSTS
```

#### Disabled


```
Forward Secrecy
```

#### Supported


```
Cipher Suite
```

#### TLS_AES_256_GCM_SHA38


```
Key Exchange
```

#### ECDHE


```
Key Exchange Group
```

#### X25519 (253-bit)


```
OCSP Stapling
```

#### Disabled


```
HTTP/2 (ALPN)
```

#### Supported


#### Issues (2)


##### Weak certificate key: 256-bit (minimum recommended is 2048-bit RSA)


##### HSTS not implemented


#### Recommendations


##### Reissue the certificate with at least a 2048-bit RSA or 256-bit EC key


##### Plan certificate renewal. Expiry is within 90 days.


##### Implement HSTS to force HTTPS connections


### DNS Security Weak


```
Checks DNS integrity, resilience, and authority records to protect against DNS attacks.
```

```
Score
```

#### Good (70/100)


```
DNSSEC
```

#### Disabled


```
CAA
```

#### Missing


```
Nameservers
```

#### 2 configured


#### DNS Integrity and Authority


##### DNSSEC


```
DNSSEC is not enabled. DNS responses can be spoofed via cache poisoning.
```

##### CAA Certificate Authorisation


```
No CAA records. Any certificate authority can issue certificates for this domain.
```

#### DNS Infrastructure Resilience


##### Nameserver redundancy


```
2 nameservers configured. Resolution survives any single nameserver failure.
```

```
jaxson.ns.cloudflare.com
diva.ns.cloudflare.com
```

##### IPv6 reachability


```
Confirmed reachable over IPv6 from 4 of 4 global locations.
```

#### Operations


##### DNS provider


```
DNS hosted by Cloudflare.
```

#### DNS Records


###### A: 104.21.47.232, 172.67.174.12


```
AAAA: 2606:4700:3035::6815:2fe8, 2606:4700:3033::ac43:ae7
MX: 69 route2.mx.cloudflare.net, 6 route1.mx.cloudflare.net, 62 route3.mx.cloudflare.net
TXT (3):
slack-domain-verification=VwZUu7Jq3f0WtmG3jPUSy8tCYdPAtIAX7obMlkXG
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com include:amazonses.com ~all
google-site-verification=sJCLp-8ZFf-BNwFWONeJBnHdvYhhNan-Snggj3ovgdg
```

#### Issues


##### No CAA records found. Any CA can issue certificates for this domain.


##### DNSSEC is not enabled. DNS responses can be spoofed.


#### Recommendations


##### Add CAA DNS records to restrict which certificate authorities can issue certificates for your


##### domain.


##### Enable DNSSEC to protect against DNS spoofing and cache poisoning attacks.


### Email Security Good


```
Sender authentication, inbound encryption, and brand identity.
```

BRAND IDENTITY IN INBOX


```
  Verified logo (BIMI)
No BIMI record. Brand logo will not appear in supported inboxes.
```

```
  Receiving mail
Mail provider: Cloudflare Email Routing. 3 MX record(s).
```

WILL INBOUND MAIL BE DELIVERED SECURELY?


```
  Inbound encryption (MTA-STS)
No MTA-STS policy. Inbound mail uses opportunistic TLS that can be downgraded.
```

```
  TLS failure reports (TLS-RPT)
No TLS-RPT record configured.
```

```
  Certificate pinning (DANE)
TLSA records found on 3 of 3 mail servers.
```

CAN ATTACKERS IMPERSONATE YOUR DOMAIN?


```
  DMARC enforcement
DMARC enforces rejection of spoofed mail.
```

```
  SPF policy
SPF soft-fails unauthorized servers.
```

```
  DKIM signing
Outbound mail signed with 2048-bit key(s).
```

```
  Spoofing alerts (DMARC reports)
Aggregate reports sent to mailto:ae045ee7a7384e64aca185c39c431ece@dmarc-reports.cloudflare.net.
```

```
  Bulk-sender compliance (Google / Yahoo)
Meets Google and Yahoo bulk sender requirements (effective Feb 2024).
```

### security.txt Found


```
RFC 9116 security disclosure policy. Helps researchers report vulnerabilities responsibly.
```

#### Found


###### FIELD VALUE


##### Location https://matx.ee/.well-known/security.txt


##### Contact mailto:security@proksiabel.ee


##### Expires 2027-01-01T00:00:00Z


#### Raw File Contents


```
Contact: mailto:security@proksiabel.ee
Expires: 2027-01-01T00:00:00Z
```

### Compliance Readiness Weak


```
Snapshot of how this site maps against common security and privacy compliance standards.
```

```
Overall
```

#### Weak (0/100)


```
Standards
```

#### 5


#### SOC 2 Type II Partial


#### PCI DSS v4.0 Failing


#### GDPR Partial


#### ISO 27001:2022 Failing


#### HIPAA Security Rule Partial


### Raw HTTP Response Headers


```
All HTTP response headers returned by the server during the scan.
```

###### HEADER VALUE


```
date Sun, 09 Aug 2026 08:24:55 GMT
```

###### HEADER VALUE


**content-type** text/html; charset=UTF-


**transfer-encoding** chunked


**connection** close


**accept-ch** Sec-CH-UA-Bitness, Sec-CH-UA-Arch, Sec-CH-UA-Full-Version, Sec-C
H-UA-Mobile, Sec-CH-UA-Model, Sec...


**cf-mitigated** challenge


**content-security-policy** default-src 'none'; script-src 'nonce-PYjmJlEKAjQStp4ofMdQbr' 'uns
afe-eval' https://challenges.cl...


**server** cloudflare


**critical-ch** Sec-CH-UA-Bitness, Sec-CH-UA-Arch, Sec-CH-UA-Full-Version, Sec-C
H-UA-Mobile, Sec-CH-UA-Model, Sec...


**cross-origin-embedder-policy** require-corp


**cross-origin-opener-policy** same-origin


**cross-origin-resource-policy** same-origin


**origin-agent-cluster**?


**permissions-policy** accelerometer=(),camera=(),clipboard-read=(),clipboard-write=(),ge
olocation=(),gyroscope=(),hid=(...


**referrer-policy** same-origin


**server-timing** chlray;desc="a2855e021b8ce5fe"


**x-content-type-options** nosniff


**x-frame-options** SAMEORIGIN


**speculation-rules** "/cdn-cgi/speculation"


**report-to** {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.ne
l.cloudflare.com/report/v4?s=...


**nel** {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}


**content-encoding** zstd


**cf-ray** a2855e021b8ce5fe-IAD


**alt-svc** h3=":443"; ma=8640


### Recommendations


```
Prioritized actions to improve your security posture. Address Critical and High items first.
```

#### Critical Priority


##### CRITICAL Add a Strict-Transport-Security header with max-age=31536000; includeSubDomains to


##### enforce HTTPS and prevent protocol downgrade attacks.


```
https://sitesecurityscore.com/learn/hsts-guide
```

##### CRITICAL 7 admin panel(s) reachable from the public internet. Restrict to internal networks or


##### behind VPN: /wp-login.php, /cpanel, /manager, /dashboard, /server-status, /server-info,


##### /_profiler.


#### High Priority


##### HIGH Enable DNSSEC at your registrar and publish DS records. Without it, DNS responses can be


##### spoofed via cache poisoning.


##### HIGH Publish a CAA record listing the certificate authorities authorised to issue certificates for


##### this domain.


##### HIGH Disable risky HTTP methods: PUT, DELETE, PATCH. Attackers can use these to modify


##### content, delete resources, or perform cross-site tracing.


##### HIGH Sanitize user input before merging into objects. Use Object.create(null) for lookup maps.


##### Avoid deep merge of untrusted data. Consider using Map instead of plain objects for user-


##### controlled keys.


##### HIGH Compliance gaps: 2 standard(s) failing — PCI DSS v4.0, ISO 27001:2022.


#### Medium Priority


##### MEDIUM Avoid unsafe-eval, use safer alternatives


##### MEDIUM Add object-src 'none' to prevent plugin attacks


##### MEDIUM Reissue the certificate with at least a 2048-bit RSA or 256-bit EC key


##### MEDIUM Plan certificate renewal. Expiry is within 90 days.


##### MEDIUM Implement HSTS to force HTTPS connections


##### MEDIUM Add CAA DNS records to restrict which certificate authorities can issue certificates for


##### your domain.


##### MEDIUM Enable DNSSEC to protect against DNS spoofing and cache poisoning attacks.


##### MEDIUM Publish an MTA-STS policy with mode: enforce so senders must use TLS when delivering


##### mail to your domain.


##### MEDIUM Publish a TLS-RPT record so senders can report TLS delivery failures back to you.


##### MEDIUM Add rate limiting middleware (e.g., express-rate-limit for Express, or configure rate limiting


##### on your hosting platform like Vercel/Cloudflare).

