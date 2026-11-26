# best-national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/karmilanerila/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/karmilanerila/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat — a national statistics site for Indonesia: population, economy, health, education, employment, and provinces, built from real published figures (BPS, Kemenkes SSGI, APJII) with source and year on every number. Seven linked sections, SVG charts drawn from the data, and working controls: a year selector, chart-type toggle, topic tabs, and a searchable, sortable province table. Static files only — no network, no build step.

## Run it

```sh
node main.ts
```

`main.ts` copies `app/` and `screenshots/` to `/output` (or `$MAKEFUN_OUTPUT_DIR`) and writes `/output/dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`. To browse the site, serve `app/` with any static server — for example `python3 -m http.server --directory app 8080` — and open http://localhost:8080.

---

<sub>Entered on [make.fun](https://make.fun/?ref=h379tqrk&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
