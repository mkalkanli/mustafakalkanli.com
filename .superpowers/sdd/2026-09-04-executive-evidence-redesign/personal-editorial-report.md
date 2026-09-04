# Temporary personal landing page

Replaced the corporate and editorial-profile flow with one Turkish-only screen: Mustafa Kalkanlı, four requested areas, and a mailto link to `mk@mustafakalkanli.com`.

Preserved `noindex, nofollow, noarchive`, Person schema, and `content/tr.json` as the sentence source. Removed approach, principles, navigation, cards, and contact-section copy from the generated page.

Validation completed:

- `npm test` (13 passing)
- `npm run lint`
- `npm run build:static`
- Playwright one-screen entrypoint on Chromium 1440px (passing)

Commit: `d48aa82 feat: simplify personal landing page`.

The preview-security work was not included in these commits. Generated `test-results/` remains uncommitted.
