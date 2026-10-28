# VYTA Code maintenance

This revision has been requested as a production hosting ZIP. Packaging does not deploy it or update the live host.

## Build and check

- `node build.mjs` writes the local preview to `dist/`, with noindex on all pages.
- `node check.mjs` checks the preview.
- `node build.mjs --production` writes a separate `dist-production/` without changing the preview.
- `node check.mjs --production` checks production metadata and indexing rules.

Only the contents of the selected output folder belong on a public host. Source files, the private processing ledger and original screenshots do not. No external dependencies are required to build or serve this static site. The local preview at port 4174 serves dist/.

## Update screenshot records

`review-records.json` remains the input for the daily Drive review workflow. Preserve the other codes and their history when adding evidence. The exact public success label remains “Code verified in cart,” with the screenshot's date and time. The filename timezone stays null unless actually confirmed.

Each record has captureDate (YYYY-MM-DD), captureTime (h:mm:ss AM/PM), status, captureTimezone, publicationApproved and history. Supported statuses: screenshot-applied, settings-reviewed, needs-recheck, screenshot-not-applied, expired. Unrecognized or incomplete records must not get a green success label. Add an observation to history using captureDate, captureTime, status and screen; keep earlier observations. Do not label an older screen as newly captured. No expiry or recheck interval has been supplied; do not invent one.

Record Drive file IDs, upload time, modification time and review time ONLY in the private ledger under work/screenshot-review-ledger.json. Public record JSON must not contain private screenshot links, filenames with identifying information, credentials or customer data. The build exports only approved public fields and generates static record pages from the same data as the interactive lookup.

Capture-date/time changes update the app's content hash automatically so a rebuilt page requests the new version. The host must honor the query string and revalidate HTML on deployment. Replacing local files is not a production deployment.

## Production indexing

The production build allows indexing for nine evergreen informational pages. The code directory, combined archive and individual code pages stay noindex until each applicable record has all three values: publicationApproved=true, a nonempty publicationApprovalReference, and a nonempty publicationApprovedJurisdictions array. Only set those fields from actual documented approval. These private approval details are never embedded in generated pages. Privacy and terms stay noindex while incomplete.

Robots allows crawling so Google can read page-level noindex directives. The sitemap contains only pages selected for eventual production indexing, with absolute https://vytacode.com/ URLs. Preview files still have noindex even though their candidate sitemap uses the production URLs. Protect any remotely hosted staging copy with access control rather than relying on robots as privacy protection.

## Host setup and production verification

Confirm that the live domain really is https://vytacode.com. Configure HTTP/www redirects to that preferred origin and one consistent trailing-slash policy. Serve /codes/vyta10/ from /codes/vyta10/index.html and use HTTP 404 for missing paths. Configure HTTPS, compression, correct CSS/JS/SVG MIME types and short/revalidated HTML caching. Versioned app/style URLs are generated from actual content. Avoid blanket rewrites that turn missing pages into a successful homepage response.

Before release, test the homepage and every route on the actual host, the two actual code lookups and times, unknown/blank entries, keyboard access and mobile layouts. Validate JSON-LD with Google's tools, inspect canonical selection in Search Console and submit /sitemap.xml. No ranking, rich result or indexing outcome is guaranteed.

Current verification: source/link/metadata/schema and lookup tests pass. Visual browser/mobile rendering has not been verified in this environment because local browser inspection was blocked by browser policy. Public-domain fetches also failed in the web tool, so live hosting configuration remains unverified. No changes to other VYTA sites, production hosting or the existing ZIP were made in this redesign.
