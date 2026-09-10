# Ads dashboard UI kit

The meerkats.ai dashboard surface: a top bar holding only the platform dropdown and a vertical stack of **full-width pinned ReportCards**.

**Rule: one visualization per card.** A card is one dataset × one representation (KPI strip, trend line, horizontal bars, vertical bars, heatmap, or table). Cards are generated on demand from prompts — "top performing campaigns" → `RankCard`; "day on day spend for Amazon" → `TrendCard` — and pinned individually. Never combine chart types inside a card.

Files
- `App.jsx` — shell, platform state (persisted), per-card pin state.
- `TopBar.jsx` — sticky bar: wordmark + platform dropdown. Each card carries its own DateRange (+ period / Compare where time-based).
- `PlatformCards.jsx` — per platform: KpiCard, TrendCard, RankCard, CampaignTrendCard, TableCard, DoDTableCard / WoWTableCard / MoMTableCard (PeriodTable), GridCard, PlacementBarsCard, OsBarsCard (Meta). All platforms: BlendedKpiCard, PlatformTrendCard, PlatformSpendBarsCard, PlatformRoasBarsCard, PlatformTableCard.
- `data.js` — seeded sample data (INR).

Every card maps to a row in `data/catalog.json`; a catalog row that lists several representations becomes several cards.