import React from 'react';

/* Tiny trend beside a KPI. No axes, no points; series-blue line, optional dashed compare. */
export function Sparkline({ data = [], compare, width = 96, height = 28, color = 'var(--series-1)' }) {
  const all = [...data, ...(compare || [])];
  const min = Math.min(...all), max = Math.max(...all), span = max - min || 1;
  const pts = (arr) =>
    arr.map((v, i) => [(i / (arr.length - 1 || 1)) * (width - 2) + 1, height - 2 - ((v - min) / span) * (height - 4)]);
  const d = (arr) => pts(arr).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return (
    <svg width={width} height={height} className="block overflow-visible">
      {compare && <path d={d(compare)} fill="none" stroke="var(--series-compare)" strokeWidth="1" strokeDasharray="3 3" />}
      <path d={d(data)} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
