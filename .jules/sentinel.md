## 2025-04-28 - [DNS Rebinding SSRF Fix]
**Vulnerability:** Scraper was vulnerable to DNS rebinding attacks because it validated the URL string *before* DNS resolution by `fetch`, meaning malicious users could point safe-looking domains to private IPs dynamically during the lookup.
**Learning:** Checking the URL string against a blocklist is insufficient for SSRF protection because it suffers from a Time-Of-Check to Time-Of-Use (TOCTOU) vulnerability where the DNS record can change or return malicious internal IPs for seemingly safe domains.
**Prevention:** Intercept the actual DNS `lookup` phase using `undici`'s custom `Agent` dispatcher, enabling direct validation of the resolved IPs right before the HTTP connection is made, effectively blocking both simple SSRF and DNS rebinding SSRF.
