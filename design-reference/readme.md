# Ad Platform Dashboard Design System (meerkats.ai)

A visual system for building **reporting dashboards and charts for paid-media platforms** — Amazon Ads, Flipkart Ads (FCC), Google Ads and Meta Ads — published on meerkats.ai. It covers tokens, chart components, the pinnable report-card shell, and a working dashboard UI kit. It is a reporting system only: no alerting UI.

Sources
- `uploads/platform_reporting_dashboard_catalog_v2.xlsx` — the report catalog (sheets Amazon, Flipkart, Google, Meta, Legend & Method, Sources). Normalised into `data/catalog.json`.
- `uploads/brand-1789040789900-a9b1.css` — meerkats.ai homepage tokens (ember accent, ink scale, near-square radii, mono system voice). Used as a cue, not copied verbatim.
- Data-visualisation do's & don'ts supplied in the brief (data-ink ratio, no pie/area, context for every number, sparing status colour). These are binding.

Audience: agencies (multi-client), in-house marketing, exec leadership. Currency INR with K / L / Cr. Light theme, balanced density, one neutral system for all platforms (no per-platform hue).

## Product decisions baked in
- **Navigation** is a platform dropdown (All / Amazon / Flipkart / Google / Meta) in the top bar — nothing else up there. **There is no global date range**: every card owns its own date range (and, for time-based cards, its own D/W/M period and Compare toggle).
- **Every chart, table and KPI group is a full-width `ReportCard`** with pin / unpin in the header. **One visualization per card** — one dataset × one representation; never mix a bar chart, trend and table in the same card. Cards are generated on demand from user prompts and pinned individually. The dashboard shows only pinned cards, newest last; unpinned cards live on a separate Reports page.
- Card header carries: drag handle · title + business question · metric selector · D/W/M period · Compare · date range · last-synced · CSV · pin.
- Every KPI has context: delta vs previous period **and** vs target. Status is good/bad only, coloured sparingly; lower-is-better metrics invert.
- Trend hover: crosshair + nearest-series tooltip; other series dim. Clicking a ranked bar or table row updates the trend beside it.
- "All platforms" shows blended KPIs **and** side-by-side platform comparison.
- Tables show 10 rows then "Show more".

## Content fundamentals
- Card titles are the catalog report names (Title Case): *Campaign Performance*, *Placement Performance*. Subtitle is the catalog's business question, verbatim, sentence case with a question mark.
- Metric names stay **native to the platform** (ACOS on Amazon, Conv. value / cost on Google, PPV / ATC on Flipkart, CPI on Meta). Never rename to force parity.
- Numbers: ₹ with K / L / Cr, one decimal max; ratios as `4.7×`; rates as `26.2%`; deltas `+9.4% vs prev`. Dashes (—) for unavailable.
- System voice (timestamps, axis ticks, caps labels) is mono, lowercase or small caps: `synced 2m ago`.
- No emoji. No exclamation marks. No explanatory prose inside cards.

## Visual foundations
- **Colour**: warm-white page (#FAFAF9), pure-white cards, ink scale for text. **Data uses the standard RGBY categorical palette (blue, red, yellow, green, then purple, teal, pink, brown — no orange)**. Single-series bars colour each category; multi-series charts colour each series. The brand ember **never encodes data** and appears only on the primary button and the pin state. Comparison series is dashed grey. Unselected bars are muted blue-grey. Status green/red appears only on deltas. Heatmaps use a 5-step sequential blue ramp with values printed. Row / KPI selection uses a light blue tint.
- **Type**: Geist (UI, tabular figures), Geist Mono (system voice), Instrument Serif only for the dashboard title. Scale: 26 title / 28 KPI / 15 card / 13 body / 12 label / 11 micro.
- **Shape**: near-square — 6px cards, 4px controls, pill only for the toggle. 1px hairline card border, 1.5px ink rule under every card header. No card shadows; shadow only on floating menus/tooltips.
- **Charts**: one horizontal gridline style, no vertical gridlines, no chart borders, no backgrounds, axis text mono 11px grey. Lines 2px; compare 1.5px dashed. Bars flat, 1px radius. Legends are text with a short line/square swatch.
- **Motion**: 120ms colour, 200ms size, ease `cubic-bezier(.2,.7,.2,1)`. No bounces, no entrance animations.
- **Hover**: sunken surface on rows/buttons; ink-500 on ranked bars; dim non-hovered series. **Press**: accent-hover darkening. **Focus**: 3px ember 25% ring.
- Layout: max-width 1440, 24px page padding, cards stacked with 16px gap, card padding 20×16. Fluid down to ~900px (columns collapse via minmax).
- No imagery, gradients, textures or illustration anywhere.

## Iconography
Lucide (ISC), stroke 2, path data inlined in `components/core/Icon.jsx` so glyphs inherit `currentColor`. Set used: pin, pin-off, download, grip-vertical, chevron-down, calendar, arrow-up-right, arrow-down-right, layers, filter, search, x, refresh-cw, external-link. Add icons by copying path data from lucide.dev — never hand-draw. No emoji; the only unicode glyphs are × (ratio) and — (empty).

**No logo was provided.** The wordmark position renders "Dashboard" in Instrument Serif with the client name in mono caps. Drop a logo into `assets/` and swap it in `ui_kits/dashboard/TopBar.jsx`.

## Index
- `styles.css` → `tokens/` (fonts, colors, typography, spacing, charts, base)
- `lib/format.js` — fmtINR / fmtNum / fmtPct / fmtX / fmtDelta / fmtBy (INR, K/L/Cr)
- `lib/loader.js` — dev helper that loads the .jsx components into `window.MK` for cards and kits
- `data/catalog.json` — all 35 catalog reports with question, metrics, representation and grid axes
- `components/core/` — Icon, Button, IconButton, Select, Segmented, Toggle, DateRange, Delta
- `components/cards/` — ReportCard, KpiStrip
- `components/charts/` — TrendLine, Sparkline, BarsVertical, BarsHorizontal, Heatmap, DataTable, PeriodTable (DoD / WoW / MoM: dates as columns, value + Δ per cell)
- `guidelines/` — foundation cards (colours, type, numbers, spacing, card anatomy, chart map, interaction, catalog)
- `ui_kits/dashboard/` — the dashboard: top bar, KPI card, Campaign Performance card, platform grid card, All-platforms cards
- `SKILL.md` — agent skill entry point

## Intentional additions
- `Icon` — wrapper for the Lucide set (needed for currentColor glyphs).
- `Delta` — the contextual-change primitive the do's & don'ts require on every number.

## Building a new catalog report
1. Find the row in `data/catalog.json`; title + question go on the `ReportCard`.
2. Map "Recommended representation" to components using `guidelines/representation-map.html`.
3. Each representation the row lists becomes its **own card**: ranked → `BarsHorizontal` card; entity history → `TrendLine` card; exact values → `DataTable` card.
4. If `grid` is true, a separate `Heatmap` card using the stated axes; `invert` for ACOS/CPC/CPI.
5. Every number gets a Delta; colour only what changes a decision.
