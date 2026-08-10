## SiteSecurityScore


##### Security Report


```
August 9, 2026 at 08:19 AM
```

## https://matx.ee


```
Generated: August 9, 2026 at 08:19 AM
```

# 74


###### /10


# Grade B


##### Good : Good security


##### foundation with room for


##### improvement.


###### AT A GLANCE


##### Redirect Chain No redirects


##### HTTP Headers 7 present, 8 missing


##### Content Security Policy Excellent


##### Page Analysis Excellent


##### Cookie Security None detected


##### Client Code Security Good


##### Web Server Security Weak


##### TLS / HTTPS Security Good


##### DNS Security Weak


##### Email Security Good


##### security.txt Found


##### Compliance Weak


##### This scan identified 7 missing security headers. TLS is adequately configured with minor


##### improvements available. Good security foundation with room for improvement.


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


### HTTP Headers 7 present, 8 missing


```
Checks for HTTP response headers that control browser security behavior.
```

###### HEADER IMPORTANCE DESCRIPTION


```
content-security-policy
```

```
default-src 'self'; script-src 'self' 'nonce
-MWNmOThjMjgtYzBlOS00MWM5LWI
4NDAtYTY5YWY4MTBiOWQ3' 'strict-dy
namic'; styl...
```

```
Critical
```

##### Controls which resources the browser is


##### allowed to load, preventing XSS attacks.


```
strict-transport-security
```

```
max-age=63072000; includeSubDomai
ns; preload
```

```
Critical
```

##### Forces browsers to use HTTPS for future


##### visits, preventing protocol downgrade


##### attacks.


```
x-frame-options
```

```
DENY
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
strict-origin-when-cross-origin
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
camera=(), microphone=(), geolocation
=()
```

```
Medium
```

##### Controls which browser features and APIs


##### can be used on the page.


```
cross-origin-opener-policy Medium
```

##### Protects your origin from being accessed


##### by cross-origin popups.


```
cross-origin-embedder-policy Medium
```

##### Prevents loading cross-origin resources


##### that do not explicitly grant permission.


```
cross-origin-resource-policy Medium
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
x-powered-by
```

```
Security
Risk
```

```
Next.js
```

```
Reveals server details that could help attackers
fingerprint your infrastructure.
```

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

### Content Security Policy Excellent


Evaluates the CSP header strength and identifies directives that may allow unsafe content.


```
Quality
```

#### Excellent


```
Directives
```

#### 14


```
Issues
```

#### 0


#### Directives (14)


##### default-src


```
'self'
```

##### script-src


```
'self' 'nonce-MWNmOThjMjgtYzBlOS00MWM5LWI4NDAtYTY5YWY4MTBiOWQ3' 'strict-dynamic'
```

##### style-src


```
'self' 'unsafe-inline'
```

##### img-src


```
'self' data: blob:
```

##### font-src


```
'self' data:
```

##### connect-src


```
'self'
```

##### frame-src


```
'self'
```

##### object-src


```
'none'
```

##### frame-ancestors


```
'none'
```

##### base-uri


```
'self'
```

##### form-action


```
'self'
```

##### upgrade-insecure-requests


##### report-uri


```
/api/csp-report
```

##### report-to


```
csp-endpoint
```

#### Recommendations


##### 'report-uri' is deprecated in CSP3. Use the 'report-to' directive with a Reporting-Endpoints


##### response header instead


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


###### FRAMEWORK


```
Next.js React
```

###### ANALYTICS


```
Google Search Console
```

###### CHAT


```
Slack Zendesk
```

**EMAIL**


```
Amazon SES Brevo Google Workspace Mailchimp Mailo Mandrill Microsoft 365
```

**DNS**


```
Cloudflare DNS
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


##### Upgrade to Pro for deep scan results: leaked secrets, configuration, vulnerable dependencies, and


##### code quality. sitesecurityscore.com/pricing


### Web Server Security Weak


```
Server fingerprint, WAF detection, CORS policy, exposed endpoints, and configuration.
```

```
Server IP
```

#### 172.67.174.12


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


#### Issues


#### Dangerous Headers (1)


##### x-powered-by : Next.js — Reveals server technology stack


#### Network Security


##### Rate Limiting


```
No rate limiting headers detected. Without rate limiting, your API is vulnerable to brute force attacks,
credential stuffing, and abuse.
```

##### Open Redirect


##### Robots.txt Path Leakage


##### Upgrade to Pro for deep scan results: admin panels, risky HTTP methods, directory listing, sensitive


##### files, error page leaks, and bot protection. sitesecurityscore.com/pricing


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


##### Upgrade to Pro for deep scan results: Perfect Forward Secrecy, cipher suite and key exchange, OCSP


##### stapling, HTTP/2 ALPN, and TLS issues/recommendations. sitesecurityscore.com/pricing


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


#### DNS Integrity and Authority


##### DNSSEC


```
DNSSEC is not enabled. DNS responses can be spoofed via cache poisoning.
```

##### CAA Certificate Authorisation


```
No CAA records. Any certificate authority can issue certificates for this domain.
```

##### Upgrade to Pro for deep scan results: nameserver redundancy, multi-provider DNS, IPv6 reachability,


##### DNS records, and recommendations. sitesecurityscore.com/pricing


### Email Security Good


```
Sender authentication and spoofing protection.
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

##### Upgrade to Pro for deep scan results: brand identity (BIMI), inbound encryption (MTA-STS, TLS-RPT,


##### DANE), spoofing alerts (DMARC reports), and bulk-sender compliance. sitesecurityscore.com/pricing


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


Contact: mailto:security@proksiabel.ee
Expires: 2027-01-01T00:00:00Z


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


#### PCI DSS v4.0 Partial


#### GDPR Partial


#### ISO 27001:2022 Partial


#### HIPAA Security Rule Partial


### Raw HTTP Response Headers


```
All HTTP response headers returned by the server during the scan.
```

###### HEADER VALUE


**date** Sun, 09 Aug 2026 08:19:44 GMT


**content-type** text/html; charset=utf-


**transfer-encoding** chunked


**connection** keep-alive


**alt-svc** h3=":443"; ma=8640


**cache-control** private, no-cache, no-store, max-age=0, must-revalidate


**report-to** {"group":"cf-nel","max_age":604800,"endpoints":[{"url":"https://a.ne
l.cloudflare.com/report/v4?s=...


**content-security-policy** default-src 'self'; script-src 'self' 'nonce-MWNmOThjMjgtYzBlOS00M
WM5LWI4NDAtYTY5YWY4MTBiOWQ3' 's...


###### HEADER VALUE


```
link </_next/static/media/fa0520225c6f3d07-s.p.33u8lzvd44aqk.woff2>;
rel=preload; as="font"; crossorig...
```

```
permissions-policy camera=(), microphone=(), geolocation=()
```

```
referrer-policy strict-origin-when-cross-origin
```

```
reporting-endpoints csp-endpoint="/api/csp-report"
```

```
strict-transport-security max-age=63072000; includeSubDomains; preload
```

```
vary rsc, next-router-state-tree, next-router-prefetch, next-router-segm
ent-prefetch, Accept-Encoding
```

```
via 1.1 Caddy
```

```
x-content-type-options nosniff
```

```
x-frame-options DENY
```

```
x-powered-by Next.js
```

```
cf-cache-status DYNAMIC
```

```
nel {"report_to":"cf-nel","success_fraction":0.0,"max_age":604800}
```

```
speculation-rules "/cdn-cgi/speculation"
```

```
server-timing cfCacheStatus;desc="DYNAMIC", cfEdge;dur=11,cfOrigin;dur=14
```

```
content-encoding zstd
```

```
server cloudflare
```

```
cf-ray a28556695c0381b1-IAD
```

### Recommendations


```
Prioritized actions to improve your security posture. Address Critical and High items first.
```

#### High Priority


##### HIGH Enable DNSSEC at your registrar and publish DS records. Without it, DNS responses can be


##### spoofed via cache poisoning.


##### HIGH Publish a CAA record listing the certificate authorities authorised to issue certificates for


##### this domain.


#### Medium Priority


##### MEDIUM 'report-uri' is deprecated in CSP3. Use the 'report-to' directive with a Reporting-Endpoints


##### response header instead


##### MEDIUM Configure a cross-origin-opener-policy header. Protects your origin from being accessed


##### by cross-origin popups.


##### MEDIUM Configure a cross-origin-embedder-policy header. Prevents loading cross-origin


##### resources that do not explicitly grant permission.


##### MEDIUM Reissue the certificate with at least a 2048-bit RSA or 256-bit EC key


##### MEDIUM Plan certificate renewal. Expiry is within 90 days.


##### MEDIUM Implement HSTS to force HTTPS connections


##### MEDIUM 1 dangerous response header(s) detected. They often reveal stack versions or use


##### deprecated security mechanisms.

