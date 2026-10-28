VYTA Code — hosting handoff
Upload the CONTENTS of website/ to your static host's web root. No database or server runtime required. Configure directory index routing, HTTPS, and HTTP 404 responses using 404.html. Serve JavaScript/CSS with correct MIME types. Use short/no-cache caching for HTML and app.js.

source/ contains build scripts and review data. With Node.js, run node build.mjs then node check.mjs in source/. Deploy the generated dist/ contents. Keep source/ outside the public web root.

Records: VYTA10 and VYTA20, based on October 27 screenshots with capture times. These are historical screenshot observations, not live verification. No screenshots, credentials or private ledger included.

Current limitations:
- Canonicals/sitemap target https://vytacode.com/.
- Pages are noindex; robots.txt blocks crawling. Keep this for temporary hosting; review launch readiness and final URLs before enabling indexing.
- Privacy/terms remain drafts. Operator details and marketing eligibility are unconfirmed.
- Records are managed in the VYTA admin (Admin → VYTA Code) and pulled in at build time through VYTA_RECORDS_URL. Each admin change triggers a rebuild through a Vercel Deploy Hook. See README.md.
- Visual browser/mobile testing and production update testing remain outstanding. Source/link/lookup checks pass.

Host testing: visit all navigation routes; look up VYTA10 and VYTA20 and check dates/times; confirm unknown codes return Not reviewed; test mobile widths and keyboard access; confirm missing routes return HTTP 404. Test the next record update after deploying it. Configure domain DNS and HTTPS when the domain is connected.

Vercel: this repo includes vercel.json, which builds from source/ and handles routing, the HTTP 404 status, caching and headers. Setup steps are in README.md.
