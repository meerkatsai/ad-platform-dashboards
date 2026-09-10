import React from 'react';
import { ReportCard } from '../cards/ReportCard.jsx';
import { KpiStrip } from '../cards/KpiStrip.jsx';
import { TrendLine } from '../charts/TrendLine.jsx';
import { BarsHorizontal } from '../charts/BarsHorizontal.jsx';
import { BarsVertical } from '../charts/BarsVertical.jsx';
import { Heatmap } from '../charts/Heatmap.jsx';
import { DataTable } from '../charts/DataTable.jsx';
import { PeriodTable } from '../charts/PeriodTable.jsx';
import { Select } from '../core/Select.jsx';
import { Segmented } from '../core/Segmented.jsx';
import { Toggle } from '../core/Toggle.jsx';
import { DateRange } from '../core/DateRange.jsx';
import { fmtINR, fmtNum, fmtPct, fmtX, fmtBy } from '../../lib/format.js';
import { days, weeks, months, platforms as D } from '../../data/sampleData.js';

/* ONE visualization per card. Each card = one dataset × one representation. Cards are generated on demand from a prompt
   ("top performing campaigns" → RankCard; "day on day spend" → TrendCard) and pinned individually. Never combine chart types in a card. */

const sum = (a) => a.reduce((x, y) => x + y, 0);
const pctd = (a, b) => (b ? ((a - b) / b) * 100 : null);
export const labelsFor = (p) => (p === 'D' ? days : p === 'W' ? weeks : months);
export const roll = (arr, period, avg) => {
  if (period === 'D') return arr;
  const n = period === 'W' ? 9 : 6;
  const size = Math.ceil(arr.length / n);
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    const s = arr.slice(i, i + size);
    out.push(avg ? +(sum(s) / s.length).toFixed(2) : sum(s));
  }
  return out.slice(0, n);
};
const periodCtl = (v, set) => (
  <Segmented size="sm" value={v} onChange={set} options={[{ value: 'D', label: 'D' }, { value: 'W', label: 'W' }, { value: 'M', label: 'M' }]} />
);
const metricCtl = (p, v, set) => (
  <Select size="sm" value={v} onChange={set} options={p.metrics.map((x) => ({ value: x.key, label: x.label }))} />
);
const isAvg = (m) => m.unit === 'x' || m.unit === 'pct' || m.key === 'cpc' || m.key === 'cpi';

/* every card owns its own date range; time-based cards also own period + compare */
export const useCardTime = (withPeriod, withCompare) => {
  const [range, setRange] = React.useState('30d');
  const [period, setPeriod] = React.useState('D');
  const [compare, setCompare] = React.useState(true);
  const ctl = (
    <>
      {withPeriod && periodCtl(period, setPeriod)}
      {withCompare && <Toggle checked={compare} onChange={setCompare} label="Compare" />}
      <DateRange value={range} onChange={setRange} />
    </>
  );
  return { range, period, compare, ctl };
};

/* Numbers: headline KPIs with context */
export function KpiCard({ pk, pinned, onPin }) {
  const p = D[pk], k = p.kpi;
  const { period, compare, ctl } = useCardTime(true, true);
  const spend = sum(k.spend), sales = sum(k.sales), ps = sum(k.prevSpend), pv = sum(k.prevSales);
  const roas = sales / spend, proas = pv / ps, acos = 100 / roas, pacos = 100 / proas;
  const items = [
    { key: 'spend', label: p.kpi_labels.spend, value: fmtINR(spend), delta: pctd(spend, ps), target: pctd(spend, spend * 1.04), spark: roll(k.spend, period), compare: compare ? roll(k.prevSpend, period) : null },
    { key: 'sales', label: p.kpi_labels.sales, value: fmtINR(sales), delta: pctd(sales, pv), target: pctd(sales, sales * 0.93), spark: roll(k.sales, period), compare: compare ? roll(k.prevSales, period) : null },
    { key: 'roas', label: p.kpi_labels.roas, value: fmtX(roas), delta: pctd(roas, proas), target: pctd(roas, 4.2), spark: roll(k.sales, period).map((v, i) => v / roll(k.spend, period)[i]) },
    {
      key: 'eff',
      label: pk === 'google' ? 'Cost / conversion' : pk === 'meta' ? 'Cost per purchase' : 'ACOS',
      value: pk === 'google' || pk === 'meta' ? fmtINR(spend / sum(p.campaigns.map((c) => c.orders))) : fmtPct(acos),
      delta: pctd(acos, pacos),
      target: pctd(acos, 25),
      invert: true,
      spark: roll(k.spend, period).map((v, i) => (v / roll(k.sales, period)[i]) * 100),
    },
    { key: 'clicks', label: 'Clicks', value: fmtNum(sum(p.campaigns.map((c) => c.clicks))), delta: 6.3, spark: roll(k.spend.map((v) => v / 12), period) },
    {
      key: 'orders',
      label: pk === 'google' ? 'Conversions' : pk === 'meta' ? 'Purchases' : 'Orders',
      value: fmtNum(sum(p.campaigns.map((c) => c.orders))),
      delta: 9.1,
      target: 2.4,
      spark: roll(k.sales.map((v) => v / 1300), period),
    },
  ];
  return (
    <ReportCard title="Account KPIs" question="How is the account performing this period versus last period and plan?" synced="2m ago" pinned={pinned} onPin={onPin} onDownload={() => {}} controls={ctl}>
      <KpiStrip items={items} />
    </ReportCard>
  );
}

/* Trend line: one account metric over time */
export function TrendCard({ pk, pinned, onPin }) {
  const p = D[pk], k = p.kpi;
  const [m, setM] = React.useState('spend');
  const { period: lp, compare, ctl } = useCardTime(true, true);
  const cur = roll(m === 'sales' ? k.sales : k.spend, lp), prev = roll(m === 'sales' ? k.prevSales : k.prevSpend, lp);
  const data = m === 'roas' ? roll(k.sales, lp).map((v, i) => +(v / roll(k.spend, lp)[i]).toFixed(2)) : cur;
  const pdata = m === 'roas' ? roll(k.prevSales, lp).map((v, i) => +(v / roll(k.prevSpend, lp)[i]).toFixed(2)) : prev;
  const label = { spend: p.kpi_labels.spend, sales: p.kpi_labels.sales, roas: p.kpi_labels.roas }[m];
  const fmt = m === 'roas' ? fmtX : fmtINR;
  return (
    <ReportCard
      title={label + ' over time'}
      question={'How is ' + label.toLowerCase() + ' changing ' + (lp === 'D' ? 'day on day' : lp === 'W' ? 'week on week' : 'month on month') + '?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={
        <>
          <Select size="sm" value={m} onChange={setM} options={[{ value: 'spend', label: p.kpi_labels.spend }, { value: 'sales', label: p.kpi_labels.sales }, { value: 'roas', label: p.kpi_labels.roas }]} />
          {ctl}
        </>
      }
    >
      <TrendLine labels={labelsFor(lp)} format={fmt} height={240} series={[{ id: 'a', label, data }, ...(compare ? [{ id: 'b', label: 'Previous period', data: pdata, dashed: true }] : [])]} />
    </ReportCard>
  );
}

/* Horizontal bars: top campaigns by one metric */
export function RankCard({ pk, pinned, onPin }) {
  const p = D[pk];
  const { ctl } = useCardTime(false, false);
  const [mk, setMk] = React.useState(p.metrics[0].key);
  const m = p.metrics.find((x) => x.key === mk);
  const fmt = fmtBy(m.unit);
  const items = [...p.campaigns].sort((a, b) => (m.invert ? a[mk] - b[mk] : b[mk] - a[mk])).slice(0, 10).map((c) => ({ id: c.id, label: c.name, value: c[mk] }));
  return (
    <ReportCard
      title={'Top campaigns by ' + m.label}
      question={'Which campaigns ' + (m.invert ? 'are most efficient on ' : 'lead on ') + m.label + '?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={<>{metricCtl(p, mk, setMk)}{ctl}</>}
    >
      <BarsHorizontal items={items} format={fmt} labelW={240} rowH={32} />
    </ReportCard>
  );
}

/* Trend line: one campaign's metric over time */
export function CampaignTrendCard({ pk, pinned, onPin }) {
  const p = D[pk];
  const [cid, setCid] = React.useState(p.campaigns[0].id);
  const [mk, setMk] = React.useState(p.metrics[0].key);
  const { period: lp, compare, ctl } = useCardTime(true, true);
  const m = p.metrics.find((x) => x.key === mk);
  const c = p.campaigns.find((x) => x.id === cid);
  const t = p.trendByCampaign[cid][mk] || p.trendByCampaign[cid].roas;
  const fmt = fmtBy(m.unit);
  return (
    <ReportCard
      title={'Campaign ' + m.label + ' over time'}
      question={'How is ' + c.name + ' trending on ' + m.label + '?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={
        <>
          <Select size="sm" value={cid} onChange={setCid} options={p.campaigns.map((x) => ({ value: x.id, label: x.name }))} />
          {metricCtl(p, mk, setMk)}
          {ctl}
        </>
      }
    >
      <TrendLine
        labels={labelsFor(lp)}
        format={fmt}
        height={240}
        series={[
          { id: 'a', label: c.name, data: roll(t, lp, isAvg(m)) },
          ...(compare ? [{ id: 'b', label: 'Previous period', data: roll(t.map((v) => +(v * 0.9).toFixed(2)), lp, isAvg(m)), dashed: true }] : []),
        ]}
      />
    </ReportCard>
  );
}

/* Table: full campaign metric set */
export function TableCard({ pk, pinned, onPin }) {
  const p = D[pk];
  const { ctl } = useCardTime(false, false);
  const cols =
    pk === 'meta'
      ? [
          { key: 'name', label: 'Campaign', width: '26%' },
          { key: 'spend', label: 'Spend', format: fmtINR },
          { key: 'share', label: 'Spend share', format: fmtPct, bar: true, width: '18%' },
          { key: 'reach', label: 'Reach', format: fmtNum },
          { key: 'freq', label: 'Frequency', format: (v) => v.toFixed(1) },
          { key: 'cpi', label: 'CPI', format: fmtINR },
          { key: 'ctr', label: 'CTR', format: fmtPct },
          { key: 'cvr', label: 'CVR', format: fmtPct },
          { key: 'roas', label: 'ROAS', format: fmtX },
        ]
      : [
          { key: 'name', label: 'Campaign', width: '24%' },
          { key: 'spend', label: p.kpi_labels.spend, format: fmtINR },
          { key: 'sales', label: p.kpi_labels.sales, format: fmtINR, bar: true, width: '18%' },
          { key: 'roas', label: p.kpi_labels.roas, format: fmtX },
          { key: pk === 'amazon' ? 'acos' : 'cvr', label: pk === 'amazon' ? 'ACOS' : pk === 'google' ? 'Conv. rate' : 'CVR', format: fmtPct },
          { key: 'clicks', label: 'Clicks', format: fmtNum },
          { key: 'ctr', label: 'CTR', format: fmtPct },
          { key: 'cpc', label: pk === 'google' ? 'Avg CPC' : 'CPC', format: fmtINR },
          { key: 'orders', label: pk === 'google' ? 'Conv.' : 'Orders', format: fmtNum },
        ];
  return (
    <ReportCard
      title={pk === 'meta' ? 'Campaign budget allocation' : 'Campaign performance table'}
      question={pk === 'meta' ? 'Where is budget being allocated and how efficiently?' : 'What are the exact numbers for every campaign?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={ctl}
    >
      <DataTable columns={cols} rows={p.campaigns} pageSize={10} sortKey="spend" />
    </ReportCard>
  );
}

/* Period tables: campaign × date, value + delta per cell. One card per granularity (DoD / WoW / MoM). */
function PeriodCard({ pk, granularity, pinned, onPin }) {
  const p = D[pk];
  const { ctl } = useCardTime(false, false);
  const [mk, setMk] = React.useState('spend');
  const m = p.metrics.find((x) => x.key === mk) || p.metrics[0];
  const fmt = fmtBy(m.unit);
  const periods = labelsFor(granularity);
  const name = { D: 'Day on day', W: 'Week on week', M: 'Month on month' }[granularity];
  const rows = p.campaigns.map((c) => {
    const t = p.trendByCampaign[c.id][mk] || p.trendByCampaign[c.id].roas;
    return { id: c.id, label: c.name, values: roll(t, granularity, isAvg(m)) };
  });
  return (
    <ReportCard
      title={name + ' · campaign ' + m.label}
      question={"How did each campaign's " + m.label + ' move ' + name.toLowerCase() + '?'}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={<>{metricCtl(p, mk, setMk)}{ctl}</>}
    >
      <PeriodTable periods={periods} rows={rows} format={fmt} invert={!!m.invert} cellW={granularity === 'D' ? 92 : 110} />
    </ReportCard>
  );
}
export function DoDTableCard(props) { return <PeriodCard {...props} granularity="D" />; }
export function WoWTableCard(props) { return <PeriodCard {...props} granularity="W" />; }
export function MoMTableCard(props) { return <PeriodCard {...props} granularity="M" />; }

/* Heatmap: campaign × placement / device / OS */
export function GridCard({ pk, pinned, onPin }) {
  const p = D[pk];
  const [mk, setMk] = React.useState('roas');
  const { ctl } = useCardTime(false, false);
  const dim = pk === 'google' ? 'device' : pk === 'meta' ? 'OS' : 'placement';
  const rows = p.campaigns.slice(0, 8).map((c) => c.name);
  const vals = p.grid.map((r) => r.map((v) => (mk === 'roas' ? v : +(100 / v).toFixed(1))));
  const q = {
    amazon: 'Where on Amazon are ads performing best?',
    flipkart: 'Which retail-media placements are most effective?',
    google: 'Are mobile, desktop and tablet users behaving differently?',
    meta: 'Is there a meaningful gap between Android and iOS?',
  }[pk];
  return (
    <ReportCard
      title={'Campaign × ' + dim + ' · ' + (mk === 'roas' ? p.kpi_labels.roas : pk === 'amazon' ? 'ACOS' : 'Cost / value')}
      question={q}
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={
        <>
          <Select size="sm" value={mk} onChange={setMk} options={[{ value: 'roas', label: p.kpi_labels.roas }, { value: 'acos', label: pk === 'amazon' ? 'ACOS' : 'Cost / value' }]} />
          {ctl}
        </>
      }
    >
      <Heatmap rows={rows} cols={p.placements} values={vals} format={mk === 'roas' ? fmtX : fmtPct} invert={mk !== 'roas'} rowLabelW={240} />
    </ReportCard>
  );
}

/* Vertical bars: one metric by placement / device / OS */
export function PlacementBarsCard({ pk, pinned, onPin }) {
  const p = D[pk];
  const { ctl } = useCardTime(false, false);
  const dim = pk === 'google' ? 'device' : pk === 'meta' ? 'OS' : 'placement';
  const avg = p.placements.map((_, j) => +(p.grid.reduce((a, r) => a + r[j], 0) / p.grid.length).toFixed(1));
  return (
    <ReportCard title={p.kpi_labels.roas + ' by ' + dim} question={'Which ' + dim + ' delivers the best return?'} synced="2m ago" pinned={pinned} onPin={onPin} onDownload={() => {}} controls={ctl}>
      <BarsVertical groups={p.placements.map((l, j) => ({ label: l, values: [avg[j]] }))} format={fmtX} height={240} />
    </ReportCard>
  );
}

/* Vertical bars: Android vs iOS (Meta only) */
export function OsBarsCard({ pinned, onPin }) {
  const p = D.meta;
  const [mm, setMm] = React.useState('cpi');
  const six = p.campaigns.slice(0, 6);
  const { ctl } = useCardTime(false, false);
  const groups = six.map((c) => ({
    label: c.name.split(' · ')[0],
    values: mm === 'cpi' ? [c.cpi, +(c.cpi * (0.85 + (c.freq % 1) * 0.4)).toFixed(0)] : [c.cvr, +(c.cvr * (0.8 + (c.freq % 1) * 0.5)).toFixed(1)],
  }));
  return (
    <ReportCard
      title={'Android vs iOS · ' + mm.toUpperCase()}
      question="Is there a meaningful CPI/CVR gap between operating systems?"
      synced="2m ago"
      pinned={pinned}
      onPin={onPin}
      onDownload={() => {}}
      controls={
        <>
          <Select size="sm" value={mm} onChange={setMm} options={[{ value: 'cpi', label: 'CPI' }, { value: 'cvr', label: 'CVR' }]} />
          {ctl}
        </>
      }
    >
      <BarsVertical groups={groups} seriesLabels={['Android', 'iOS']} format={mm === 'cpi' ? fmtINR : fmtPct} height={240} />
    </ReportCard>
  );
}
