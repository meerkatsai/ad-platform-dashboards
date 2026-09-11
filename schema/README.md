# JSON Schemas — ad platform dashboards

Machine-readable contracts (JSON Schema draft 2020-12) for the dashboard system, so cards and dashboards can be generated, validated and synced programmatically — e.g. by an agent that turns a user prompt ("top performing campaigns") into a card instance, or by the app.meerkats.ai backend serving card payloads to the React components.

| File | What it describes |
| --- | --- |
| `catalog.schema.json` | Validates [`src/data/catalog.json`](../src/data/catalog.json) — the 35-report catalog per platform (title, business question, native metrics, recommended representation, grid axes) |
| `card.schema.json` | **The core contract.** One card = one dataset × one representation. Header controls (per-card date range, D/W/M, Compare, metric/entity selectors) plus a `data` payload whose shape is fixed by `representation` and maps 1:1 onto the props of the matching React component |
| `dashboard.schema.json` | Dashboard state: active platform view, client, and the ordered card stack per view (pinned cards only, newest pin last) |
| `tokens.schema.json` + `tokens.json` | Design tokens as portable JSON (colors, type scale, shape, layout, chart chrome, motion). Mirrors the CSS variables in [`src/index.css`](../src/index.css), which remains the runtime source of truth |
| `examples/amazon-cards.example.json` | Valid card instances (kpiStrip, trendLine, barsHorizontal, heatmap) that validate against `card.schema.json` |

## Representation → component mapping

| `representation` | Component | Use for |
| --- | --- | --- |
| `kpiStrip` | `cards/KpiStrip.jsx` | Headline metrics with delta vs prev **and** vs target, sparklines |
| `trendLine` | `charts/TrendLine.jsx` | Time-series movement; dashed grey compare series |
| `barsHorizontal` | `charts/BarsHorizontal.jsx` | Rankings with many named categories (campaigns, keywords, terms) |
| `barsVertical` | `charts/BarsVertical.jsx` | Few discrete categories / side-by-side (placements, Android vs iOS) |
| `heatmap` | `charts/Heatmap.jsx` | Entity × dimension grids (campaign × placement/device/OS) |
| `dataTable` | `charts/DataTable.jsx` | Exact values, full metric sets, drill-down |
| `periodTable` | `charts/PeriodTable.jsx` | DoD / WoW / MoM: dates as columns, value + Δ per cell |

## Conventions encoded in the schemas

- `unit` (`inr` \| `num` \| `pct` \| `x`) selects the formatter from [`src/lib/format.js`](../src/lib/format.js) — ₹ with K/L/Cr, one decimal max, `4.7×`, `26.2%`; unavailable values render `—`.
- `invert: true` marks lower-is-better metrics (ACOS, CPC, CPI, cost/conv.): flips delta colouring, rank order and heatmap shading.
- Numeric payloads are **raw numbers**; formatting happens at render. The one exception is `kpiStrip` item `value`, which is the pre-formatted display string.
- Comparison series are `dashed: true` and render grey — they never consume one of the 8 RGBY series colours.
- One visualization per card is structural: `data` is a single payload, and a catalog row listing several representations becomes several cards.

## Validating

```bash
npx ajv-cli validate --spec=draft2020 -s schema/catalog.schema.json -d src/data/catalog.json
npx ajv-cli validate --spec=draft2020 -s schema/tokens.schema.json -d schema/tokens.json
```
