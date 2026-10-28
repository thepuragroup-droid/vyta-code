VYTA Code — hosting handoff (SEO production build, 2026-10-28)
Upload the CONTENTS of website/ to your static host's web root for https://vytacode.com/. No database or server runtime required. Configure directory index routing (/process/ serves /process/index.html), HTTPS, and HTTP 404 responses using 404.html. Redirect HTTP and www to https://vytacode.com and keep one trailing-slash policy. If /vyta-network/ was ever deployed, remove its files and 301-redirect it to /about/. Serve CSS, JavaScript and SVG with correct MIME types and enable gzip/Brotli. Revalidate HTML, app.js and style.css on deploy. The pages request these assets with a content-hash query string, so don't strip query strings from cache keys.

source/ contains build scripts and review data. With Node.js, run node observations.test.mjs, then node build.mjs --production, then node check.mjs --production in source/. Deploy the generated dist-production/ contents. Running build.mjs and check.mjs without --production writes a noindex preview to dist/. Keep source/ outside the public web root.

SEO: nine evergreen pages are index,follow and listed in sitemap.xml. robots.txt allows crawling and declares the sitemap. /codes/, /codes/vyta10/, /codes/vyta20/, /verification-archive/, /privacy/ and /terms/ stay noindex until code publication approvals and final legal details are supplied. Canonical, Open Graph and sitemap URLs use https://vytacode.com/. Change them if the preferred domain differs. Structured data is WebSite, Organization, WebPage/AboutPage/CollectionPage and BreadcrumbList. There is no Product, Offer or rating schema. No ranking, indexing or rich-result outcome is guaranteed.

Records: VYTA10 and VYTA20, with screenshot history from October 26–27. These are historical screenshot observations, not live verification. No screenshots, credentials or private ledger included. The record format is described in source/MAINTENANCE.md.

Current limitations:
- Privacy/terms remain drafts. Operator details and marketing eligibility are unconfirmed.
- Records are managed in the VYTA admin (Admin → VYTA Code) and pulled in at build time through VYTA_RECORDS_URL. Each admin change triggers a rebuild through a Vercel Deploy Hook. See README.md.
- Visual browser/mobile testing and live host behaviour remain unverified. Source, link, metadata, schema and lookup checks pass.

Host testing: visit all navigation routes and nested code pages. Look up VYTA10 (2026-10-27 at 3:20:41 PM) and VYTA20 (2026-10-27 at 3:20:24 PM). Confirm an unknown code returns Not reviewed and an empty entry is rejected. Test mobile widths and keyboard access. Confirm missing routes return HTTP 404. Check response headers for an unintended X-Robots-Tag on production. Validate structured data, submit /sitemap.xml in Search Console and inspect canonical/indexing status. Test the next record update after deploying it.

Vercel: this repo includes vercel.json, which builds the production version from source/ and handles routing, the HTTP 404 status, the /vyta-network/ redirect, caching and headers. Setup steps are in README.md.
