# VYTA Code

Static site for **vytacode.com**, a VYTA-owned manual code-review lookup. It needs no database or server runtime.

## Layout

- `source/`: build scripts, page content and review data. This is what gets deployed from. It is never served publicly.
  - `content.mjs`: the editorial pages. `site.css` is the stylesheet.
  - `records.mjs`: loads the review records. On Vercel they come from the VYTA admin (see "Review records" below). Locally they come from `review-records.json`.
  - `review-records.json`: the records used for local builds, with each code's observation history.
  - `lookup.mjs` and `observations.mjs`: status labels, date/time validation and history ordering, shared by the build, the lookup and the checks. `observations.test.mjs` tests them.
  - `build.mjs`: generates the site, including a page per code under `/codes/`. `--production` writes `source/dist-production/` with indexing on. Without it, `source/dist/` is a noindex preview.
  - `check.mjs`: checks metadata, canonicals, structured data, links, indexing/sitemap rules and lookup behaviour. Pass `--production` to check the production build.
  - `MAINTENANCE.md`: the record format and the publication-approval rules.
- `website/`: a prebuilt copy of `source/dist-production/` for uploading to a plain static host. Vercel does not use it.
- `vercel.json`: Vercel build, routing, redirect and header settings.

## Build locally

```bash
node source/observations.test.mjs && node source/build.mjs --production && node source/check.mjs --production
```

The output is in `source/dist-production/`. Use `node source/build.mjs && node source/check.mjs` for the noindex preview in `source/dist/`. After changing anything under `source/`, refresh the prebuilt copy with `rm -rf website && cp -r source/dist-production website`.

## Deploy on Vercel

Vercel runs the build and the checks itself on every push, so a failing check blocks the deploy. Pushes to `main` go to production, and other branches get preview URLs.

1. In Vercel, choose **Add New… → Project** and import `thepuragroup-droid/vyta-code`. If the repo isn't listed, use **Adjust GitHub App Permissions** to give Vercel access to it.
2. Leave **Root Directory** as `./`. The framework, build command, output directory and empty install command all come from `vercel.json`, so nothing needs to be overridden.
3. Click **Deploy**. Then open the `*.vercel.app` URL and work through the host testing list in [HOSTING.md](HOSTING.md).
4. To connect the domain, go to **Settings → Domains** and add `vytacode.com` (and `www.vytacode.com`, redirecting to the apex). Set the DNS records Vercel shows at your registrar. HTTPS is issued automatically once DNS resolves.

`vercel.json` sets up:

- Trailing-slash URLs that match the canonicals (`/process` redirects to `/process/`).
- A real HTTP 404 status for unknown paths, using `404.html`.
- `max-age=0, must-revalidate` caching, so record updates show up straight away.
- Security headers, including a strict same-origin Content-Security-Policy.
- A 301 redirect from the retired `/vyta-network/` page to `/about/`.

Vercel builds the production version for every deploy. Preview deployments stay out of search results because Vercel adds `X-Robots-Tag: noindex` to them itself.

### Review records

Admins manage records in the VYTA admin under **Admin → VYTA Code** (vyta-rtl-x). Each code gets a cart screenshot, plus the date and time shown on it. Every upload is kept as history. The site shows the newest *published* capture for each code: its date and time, never the screenshot, which stays private in Supabase.

How a change reaches the site:

1. The admin saves a change. The admin calls this project's Vercel Deploy Hook.
2. Vercel rebuilds. `records.mjs` fetches `VYTA_RECORDS_URL` and validates every record, then the lookup is rebuilt with them and `check.mjs` runs.
3. The new deploy goes live, usually within a minute. If the fetch fails or returns bad data, the build fails and the previous deploy stays live.

One-time setup:

1. In this Vercel project, go to **Settings → Environment Variables** and add `VYTA_RECORDS_URL` = `https://www.vytabio.com/api/code-reviews` for Production and Preview.
2. In **Settings → Git → Deploy Hooks**, create a hook named `vyta-admin` for the `main` branch and copy its URL.
3. In the vyta-rtl-x Vercel project, add `VYTA_CODE_DEPLOY_HOOK_URL` = that hook URL, then redeploy vyta-rtl-x so the variable takes effect.
4. Redeploy this project once so it picks up `VYTA_RECORDS_URL`.

Until `VYTA_RECORDS_URL` is set, builds use `source/review-records.json`.

### Indexing

The production build lets search engines index the nine evergreen information pages, and lists them in `sitemap.xml`. `robots.txt` allows crawling and points to the sitemap. These pages stay noindex:

- `/codes/`, `/verification-archive/` and each `/codes/<code>/` page. Each one stays noindex until its records have `publicationApproved: true`, a `publicationApprovalReference` and `publicationApprovedJurisdictions` (see `source/MAINTENANCE.md`).
- `/privacy/` and `/terms/`, while they are drafts.

After the domain is live, submit `https://vytacode.com/sitemap.xml` in Google Search Console.
