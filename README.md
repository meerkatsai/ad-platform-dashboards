# Ad Platform Dashboards — meerkats.ai

Reporting dashboards for paid-media platforms — **Amazon Ads, Flipkart Ads (FCC), Google Ads and Meta Ads** — built in **React + Tailwind CSS** from the meerkats.ai dashboard design system. This repo is the reference implementation for syncing into `app.meerkats.ai`.

```bash
npm install
npm run dev      # http://localhost:4720
npm run build
```

## What's here

| Path | Contents |
| --- | --- |
| `src/index.css` | Design tokens as CSS custom properties (single source of truth) + base styles + `.num` tabular-figure utility |
| `tailwind.config.js` | Tailwind theme mapped to the tokens (`bg-page`, `text-ink-700`, `border-rule`, `text-kpi`, `rounded-card`, …) |
| `src/lib/format.js` | `fmtINR / fmtNum / fmtPct / fmtX / fmtDelta / fmtBy` — INR with K / L / Cr, ratios `4.7×`, deltas `+9.4%` |
| `src/data/catalog.json` | All 35 catalog reports per platform: title, business question, metrics, representation, grid axes |
| `src/data/sampleData.js` | Seeded sample data (INR). Swap for live platform data at integration time |
| `src/components/core/` | Icon (inlined Lucide), Button, IconButton, Select, Segmented, Toggle, DateRange, Delta |
| `src/components/cards/` | `ReportCard` (the pinnable full-width card shell), `KpiStrip` |
| `src/components/charts/` | TrendLine, Sparkline, BarsVertical, BarsHorizontal, Heatmap, DataTable, PeriodTable (DoD/WoW/MoM) |
| `src/components/dashboard/` | TopBar + every card type per platform and the "All platforms" cards |
| `design-reference/` | The original design-handoff package (tokens, guidelines HTML, component prompts, catalog) — the binding spec |

## Product decisions baked in

- **Navigation** is a platform dropdown (All / Amazon / Flipkart / Google / Meta) in the top bar — nothing else up there. **There is no global date range**: every card owns its own date range (and, for time-based cards, its own D/W/M period and Compare toggle).
- **Every chart, table and KPI group is a full-width `ReportCard`** with pin / unpin in the header. **One visualization per card** — one dataset × one representation; never mix a bar chart, trend and table in the same card. Cards are generated on demand from user prompts and pinned individually. The dashboard shows only pinned cards, newest last; unpinned cards live on a separate Reports page.
- Card header carries: drag handle · title + business question · metric selector · D/W/M period · Compare · date range · last-synced · CSV · pin.
- Every KPI has context: delta vs previous period **and** vs target. Status is good/bad only, coloured sparingly; lower-is-better metrics (ACOS, CPC, CPI, cost/conv.) invert.
- Trend hover: crosshair + nearest-series tooltip; other series dim.
- "All platforms" shows blended KPIs **and** side-by-side platform comparison.
- Tables show 10 rows then "Show more".
- Metric names stay **native to the platform** (ACOS on Amazon, Conv. value / cost on Google, PPV / ATC on Flipkart, CPI on Meta). Never rename to force parity.
- No emoji. No exclamation marks. No explanatory prose inside cards. Reporting only — no alerting UI.

## Visual foundations (enforced by the Tailwind theme)

- **Colour**: warm-white page `#FAFAF9`, pure-white cards, ink scale for text. Data uses the standard RGBY categorical palette (blue, red, yellow, green, then purple, teal, pink, brown — no orange). The brand ember `#EA580C` **never encodes data**; it appears only on the primary button and the pin state. Comparison series is dashed grey; unselected bars are muted blue-grey; status green/red appears only on deltas. Heatmaps use a 5-step sequential blue ramp with values printed. Selection uses a light blue tint.
- **Type**: Geist (UI, tabular figures via `.num`), Geist Mono (system voice: timestamps, axis ticks — lowercase), Instrument Serif only for the dashboard title. Scale: 26 title / 28 KPI / 15 card / 13 body / 12 label / 11 micro.
- **Shape**: near-square — 6px cards, 4px controls, pill only for the toggle. 1px hairline card border, 1.5px ink rule under every card header. No card shadows; shadow only on floating menus/tooltips.
- **Charts**: one horizontal gridline style, no vertical gridlines, no chart borders/backgrounds, axis text mono 11px grey. Lines 2px; compare 1.5px dashed. Bars flat, 1px radius. Legends are text with a short line/square swatch.
- **Motion**: 120ms colour, 200ms size, ease `cubic-bezier(.2,.7,.2,1)`. No bounces, no entrance animations.
- **Layout**: max-width 1440, 24px page padding, cards stacked with 16px gap, card padding 20×16.
- No imagery, gradients, textures or illustration anywhere.

## Building a new catalog report

1. Find the row in `src/data/catalog.json`; title + question go on the `ReportCard`.
2. Map "Recommended representation" to components (`design-reference/guidelines/representation-map.html`).
3. Each representation the row lists becomes its **own card**: ranked → `BarsHorizontal` card; entity history → `TrendLine` card; exact values → `DataTable` card.
4. If `grid` is true, a separate `Heatmap` card using the stated axes; pass `invert` for ACOS/CPC/CPI.
5. Every number gets a `Delta`; colour only what changes a decision.

## Integration notes for app.meerkats.ai

- Tokens live as CSS variables in `src/index.css`; the Tailwind config only references them, so the token layer can be lifted into the platform app unchanged (or remapped onto an existing Tailwind setup by swapping variable values).
- Charts are dependency-free inline SVG (no chart library); they read the same CSS variables, so theming stays centralised.
- `sampleData.js` is the only mock layer — every card takes plain props (`items`, `series`, `rows`, `columns`), so wiring real report data is a data-shaping task, not a UI change.
- No logo asset was provided: the wordmark position renders "Dashboard" in Instrument Serif with the client name in mono caps (`TopBar.jsx`). Drop the logo in and swap it there.
