import React from 'react';
import { TopBar } from './components/dashboard/TopBar.jsx';
import {
  KpiCard, TrendCard, RankCard, CampaignTrendCard, TableCard,
  DoDTableCard, WoWTableCard, MoMTableCard, GridCard, PlacementBarsCard, OsBarsCard,
} from './components/dashboard/PlatformCards.jsx';
import {
  BlendedKpiCard, PlatformTrendCard, PlatformSpendBarsCard, PlatformRoasBarsCard, PlatformTableCard,
} from './components/dashboard/AllPlatformCards.jsx';

/* Dashboard = stack of independently pinned single-visualization cards, newest pin last. */
const PLATFORM_CARDS = [
  { id: 'kpi', C: KpiCard }, { id: 'trend', C: TrendCard }, { id: 'rank', C: RankCard },
  { id: 'ctrend', C: CampaignTrendCard }, { id: 'table', C: TableCard }, { id: 'dod', C: DoDTableCard },
  { id: 'wow', C: WoWTableCard }, { id: 'mom', C: MoMTableCard }, { id: 'grid', C: GridCard },
  { id: 'pbars', C: PlacementBarsCard },
];
const META_CARDS = [
  { id: 'kpi', C: KpiCard }, { id: 'trend', C: TrendCard }, { id: 'rank', C: RankCard },
  { id: 'ctrend', C: CampaignTrendCard }, { id: 'table', C: TableCard }, { id: 'dod', C: DoDTableCard },
  { id: 'wow', C: WoWTableCard }, { id: 'mom', C: MoMTableCard }, { id: 'os', C: OsBarsCard },
  { id: 'grid', C: GridCard },
];
const ALL_CARDS = [
  { id: 'bkpi', C: BlendedKpiCard }, { id: 'ptrend', C: PlatformTrendCard },
  { id: 'pspend', C: PlatformSpendBarsCard }, { id: 'proas', C: PlatformRoasBarsCard },
  { id: 'ptable', C: PlatformTableCard },
];

export default function App() {
  const [platform, setPlatform] = React.useState(() => localStorage.getItem('mk-dash-platform') || 'amazon');
  const [unpinned, setUnpinned] = React.useState({});
  React.useEffect(() => localStorage.setItem('mk-dash-platform', platform), [platform]);
  const list = platform === 'all' ? ALL_CARDS : platform === 'meta' ? META_CARDS : PLATFORM_CARDS;
  const key = (id) => platform + ':' + id;
  const toggle = (id) => setUnpinned((u) => ({ ...u, [key(id)]: !u[key(id)] }));
  const hidden = list.filter((c) => unpinned[key(c.id)]).length;
  return (
    <div className="min-h-screen bg-page">
      <TopBar platform={platform} setPlatform={setPlatform} />
      <main className="mx-auto flex max-w-page flex-col gap-4 p-6">
        {list
          .filter((c) => !unpinned[key(c.id)])
          .map((c) => (
            <c.C key={key(c.id)} pk={platform} pinned onPin={() => toggle(c.id)} />
          ))}
        {hidden > 0 && (
          <div className="flex items-center justify-between rounded-card border border-dashed border-rule px-4 py-3 text-body text-ink-500">
            <span>
              {hidden} card{hidden > 1 ? 's' : ''} unpinned — available in Reports.
            </span>
            <button onClick={() => setUnpinned({})} className="cursor-pointer border-0 bg-transparent text-body font-medium text-accent">
              Restore all
            </button>
          </div>
        )}
        <div className="py-2 pb-6 font-mono text-micro text-ink-400">
          Sample data · figures in INR · one visualization per card · pin order: newest last
        </div>
      </main>
    </div>
  );
}
