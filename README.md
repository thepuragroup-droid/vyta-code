# VYTA Code

Static site for **vytacode.com**, a VYTA-owned manual code-review lookup. It needs no database or server runtime.

## Layout

- `source/`: build scripts and review data. This is what gets deployed from. It is never served publicly.
  - `review-records.json`: the published review records (currently VYTA10 and VYTA20).
  - `build.mjs`: generates `source/dist/`, then runs `install-real.mjs` to embed the records into `app.js`.
  - `check.mjs`: checks pages, internal links, noindex/viewport tags and lookup behaviour.
- `website/`: a prebuilt copy of `source/dist/` for uploading to a plain static host. Vercel does not use it.
- `vercel.json`: Vercel build, routing and header settings.

## Build locally

```bash
node source/build.mjs && node source/check.mjs
```

The output is in `source/dist/`. After changing anything under `source/`, refresh the prebuilt copy with `rm -rf website && cp -r source/dist website`.

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
- `X-Robots-Tag: noindex`, on top of the page-level noindex and `robots.txt`.

### Updating review records

Edit `source/review-records.json` and push to `main`. Vercel then rebuilds and redeploys.

### Before going public

The site is deliberately not indexable and the legal pages are drafts. See "Current limitations" in [HOSTING.md](HOSTING.md). To allow indexing, remove the `X-Robots-Tag` header from `vercel.json`, the `noindex` meta in `build.mjs`, and the `Disallow: /` line in `robots.txt`. Then update `check.mjs`, which currently asserts noindex.
