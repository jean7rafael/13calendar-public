# Third-party notices

The MIT license in [`LICENSE`](LICENSE) applies to the entire first-party live
13 Calendar website and application, including original source code, interface
assets, editorial content and documentation.

## Historical provenance archive

`vendor/13months-site` is a private historical archive of an earlier
experimental adaptation of
[Andree37/13-months](https://github.com/Andree37/13-months). It is not installed,
built, published or used at runtime, and the public sync explicitly excludes
it. The former generated `public/reference-site` package has been removed.

The upstream repository did not publish a license when it was imported, so the
archive is **not** granted under this project's MIT license. Its provenance,
pinned revision and past local changes remain recorded in
[`vendor/13months-site/UPSTREAM.md`](vendor/13months-site/UPSTREAM.md).

The earlier collaboration request was replaced by a neutral independence and
reference notice, then closed. The live project has no permission, build or
runtime dependency on that repository; it may cite 13months.net only as an
external historical or comparative reference.

## Main open-source dependencies

- Vue, Vue Router and Vue I18n — MIT.
- Quasar Framework — MIT.
- Astronomy Engine — MIT.
- `date-holidays`, `date-holidays-parser` and their datasets — MIT.
- Cloudflare Wrangler — Apache-2.0.

The complete dependency tree and exact versions are recorded in the respective
`package-lock.json` files. Each dependency remains governed by its own license.
