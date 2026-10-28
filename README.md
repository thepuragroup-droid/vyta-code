# VYTA Code

Static site for **vytacode.com**, a VYTA-owned manual code-review lookup. It needs no database or server runtime.

## Layout

- `website/`: the built static site, ready to upload to a static host's web root.
- `source/`: build scripts and review data. Keep this out of the public web root.
  - `review-records.json`: the published review records (currently VYTA10 and VYTA20).
  - `build.mjs`: generates `source/dist/`, then runs `install-real.mjs` to embed the records into `app.js`.
  - `check.mjs`: checks pages, internal links, noindex/viewport tags and lookup behaviour.

## Build

```bash
cd source && node build.mjs && node check.mjs
```

Deploy the contents of `source/dist/`. See [HOSTING.md](HOSTING.md) for hosting notes and current limitations.
