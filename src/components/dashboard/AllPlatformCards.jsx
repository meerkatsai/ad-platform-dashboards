import React from 'react';
import { ReportCard } from '../cards/ReportCard.jsx';
import { KpiStrip } from '../cards/KpiStrip.jsx';
import { TrendLine } from '../charts/TrendLine.jsx';
import { BarsVertical } from '../charts/BarsVertical.jsx';
import { DataTable } from '../charts/DataTable.jsx';
import { Select } from '../core/Select.jsx';
import { fmtINR, fmtNum, fmtX } from '../../lib/format.js';
import { days, platforms as D } from '../../data/sampleData.js';
import { labelsFor, roll, useCardTime } from './PlatformCards.jsx';

/* "All platforms" view: blended KPIs plus side-by-side platform comparison. */

const KEYS = ['amazon', 'flipkart', 'google', 'meta'];
const sum = (a) => a.reduce((x, y) => x + y, 0);
const pctd = (a, b) => (b ? ((a - b) / b) * 100 : null);

const agg = () =>
  KEYS.map((k) => {
    const p = D[k];
    const spend = sum(p.kpi.spend), sales = sum(p.kpi.sales);
    return {
      id: k,
      name: p.name,
      spend,
      sales,
      roas: +(sales / spend).toFixed(1),
      prevSpend: sum(p.kpi.prevSpend),
      prevSales: sum(p.kpi.prevSales),
      clicks: sum(p.campaigns.map((c) => c.clicks)),
      orders: sum(p.campaigns.map((c) => c.orders)),
      campaigns: p.campaigns.length,
    };
  });

export function BlendedKpiCard({ pinned, onPin }) {
  const a = agg();
  const { period, ctl } = useCardTime(true, false);
  const tot = a.reduce(
    (t, r) => ({ spend: t.spend + r.spend, sales: t.sales + r.sales, ps: t.ps + r.prevSpend, pv: t.pv + r.prevSales, clicks: t.clicks + r.clicks, orders: t.orders + r.orders }),
    { spend: 0, sales: 0, ps: 0, pv: 0, clicks: 0, orders: 0 },
  );
  const bs = roll(days.map((_, i) => sum(KEYS.map((k) => D[k].kpi.spend[i]))), period);
  const bv = roll(days.map((_, i) => sum(KEYS.map((k) => D[k].kpi.sales[i]))), period);
  const items = [
    { key: 'spend', label: 'Total spend', value: fmtINR(tot.spend), delta: pctd(tot.spend, tot.ps), target: pctd(tot.spend, tot.spend * 1.03), spark: bs },
    { key: 'sales', label: 'Attributed sales', value: fmtINR(tot.sales), delta: pctd(tot.sales, tot.pv), target: pctd(tot.sales, tot.sales * 0.95), spark: bv },
    { key: 'roas', label: 'Blended ROAS', value: fmtX(tot.sales / tot.spend), delta: pctd(tot.sales / tot.spend, tot.pv / tot.ps), target: pctd(tot.sales / tot.spend, 4), spark: bv.map((v, i) => v / bs[i]) },
    { key: 'clicks', label: 'Clicks', value: fmtNum(tot.clicks), delta: 5.1, spark: bs.map((v) => v / 11) },
    { key: 'orders', label: 'Orders / conversions', value: fmtNum(tot.orders), delta: 8.7, target: 1.9, spark: bv.map((v) => v / 1300) },
  ];
  return (
    <ReportCard
      title="Blended KPIs · all platforms"
      question="How is total ad investment translating into sales across Amazon, Flipkart, Google and Meta?"
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={ctl}
    >
      <KpiStrip items={items} />
    </ReportCard>
  );
}

export function PlatformTrendCard({ pinned, onPin }) {
  const [m, setM] = React.useState('spend');
  const { period: lp, ctl } = useCardTime(true, false);
  return (
    <ReportCard
      title={(m === 'spend' ? 'Spend' : 'Sales') + ' over time by platform'}
      question={'How does ' + (m === 'spend' ? 'spend' : 'sales') + ' move ' + (lp === 'D' ? 'day on day' : lp === 'W' ? 'week on week' : 'month on month') + ' on each platform?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={
        <>
          <Select size="sm" value={m} onChange={setM} options={[{ value: 'spend', label: 'Spend' }, { value: 'sales', label: 'Sales' }]} />
          {ctl}
        </>
      }
    >
      <TrendLine labels={labelsFor(lp)} format={fmtINR} height={260} series={KEYS.map((k) => ({ id: k, label: D[k].name, data: roll(D[k].kpi[m], lp) }))} />
    </ReportCard>
  );
}

export function PlatformSpendBarsCard({ pinned, onPin }) {
  const { ctl } = useCardTime(false, false);
  const a = agg();
  return (
    <ReportCard title="Spend by platform vs previous period" question="Where did the budget go this period compared with last?" synced="2m ago" pinned={pinned} onPin={onPin} onDownload={() => {}} controls={ctl}>
      <BarsVertical groups={a.map((r) => ({ label: r.name, values: [r.spend, r.prevSpend] }))} seriesLabels={['This period', 'Previous period']} format={fmtINR} height={240} />
    </ReportCard>
  );
}

export function PlatformRoasBarsCard({ pinned, onPin }) {
  const { ctl } = useCardTime(false, false);
  const a = agg();
  return (
    <ReportCard title="ROAS by platform" question="Which platform returns the most per rupee?" synced="2m ago" pinned={pinned} onPin={onPin} onDownload={() => {}} controls={ctl}>
      <BarsVertical groups={a.map((r) => ({ label: r.name, values: [r.roas] }))} format={fmtX} height={240} />
    </ReportCard>
  );
}

export function PlatformTableCard({ pinned, onPin }) {
  const { ctl } = useCardTime(false, false);
  return (
    <ReportCard title="Platform comparison table" question="What are the exact totals per platform?" synced="2m ago" pinned={pinned} onPin={onPin} onDownload={() => {}} controls={ctl}>
      <DataTable
        rows={agg()}
        pageSize={4}
        columns={[
          { key: 'name', label: 'Platform', width: '22%' },
          { key: 'campaigns', label: 'Campaigns', format: (v) => String(v) },
          { key: 'spend', label: 'Spend', format: fmtINR, bar: true, width: '20%' },
          { key: 'sales', label: 'Sales / conv. value', format: fmtINR, width: '16%' },
          { key: 'roas', label: 'ROAS', format: fmtX },
          { key: 'clicks', label: 'Clicks', format: fmtNum },
          { key: 'orders', label: 'Orders / conv.', format: fmtNum },
        ]}
      />
    </ReportCard>
  );
}
