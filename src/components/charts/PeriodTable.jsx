import React from 'react';
import { Delta } from '../core/Delta.jsx';

/* Period-over-period table: rows = entities, columns = dates (days / ISO weeks / months), cell = value + delta vs the previous column.
   rows: [{id,label,values:number[]}]  periods: string[]  format: value formatter  invert: lower is better  showDelta: toggle per-cell deltas */
export function PeriodTable({ rows = [], periods = [], format = (v) => v, invert = false, showDelta = true, labelW = 220, cellW = 96, pageSize = 10 }) {
  const [shown, setShown] = React.useState(pageSize);
  const [hv, setHv] = React.useState(null);
  const thBase = 'sticky top-0 z-[1] h-9 whitespace-nowrap bg-sunken px-2.5 text-label font-medium text-ink-500';
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="num border-separate border-spacing-0" style={{ minWidth: labelW + periods.length * cellW }}>
          <thead>
            <tr>
              <th className={`${thBase} sticky left-0 z-[2] text-left`} style={{ minWidth: labelW }}>
                Campaign
              </th>
              {periods.map((p) => (
                <th key={p} className={`${thBase} text-right`} style={{ minWidth: cellW }}>
                  {p}
                </th>
              ))}
              <th className={`${thBase} border-l border-rule text-right`} style={{ minWidth: cellW }}>
                Period Δ
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, shown).map((r) => {
              const h = hv === r.id;
              const first = r.values[0], last = r.values[r.values.length - 1];
              const tot = first ? ((last - first) / first) * 100 : null;
              return (
                <tr key={r.id} onMouseEnter={() => setHv(r.id)} onMouseLeave={() => setHv(null)} className={h ? 'bg-sunken' : ''}>
                  <td
                    className={`sticky left-0 z-[1] h-row truncate whitespace-nowrap border-b border-rule px-2.5 text-body text-ink-700 ${
                      h ? 'bg-sunken' : 'bg-card'
                    }`}
                    style={{ maxWidth: labelW }}
                  >
                    {r.label}
                  </td>
                  {r.values.map((v, i) => {
                    const prev = i ? r.values[i - 1] : null;
                    const d = prev ? ((v - prev) / prev) * 100 : null;
                    return (
                      <td key={i} className="h-row whitespace-nowrap border-b border-rule px-2.5 text-right align-middle text-body text-ink-900">
                        <div className="leading-tight">{format(v)}</div>
                        {showDelta && (
                          <div className="mt-0.5 leading-none">
                            {i ? (
                              <Delta value={d} invert={invert} tone={Math.abs(d) >= 5 ? 'status' : 'plain'} />
                            ) : (
                              <span className="font-mono text-micro text-ink-300">—</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="h-row whitespace-nowrap border-b border-l border-rule px-2.5 text-right">
                    <Delta value={tot} invert={invert} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > shown && (
        <div className="flex justify-center pb-0.5 pt-2.5">
          <button
            onClick={() => setShown(shown + pageSize)}
            className="h-ctl-sm cursor-pointer rounded-ctl border border-rule bg-card px-2.5 text-label font-medium text-ink-700 hover:bg-sunken"
          >
            Show {Math.min(pageSize, rows.length - shown)} more · {rows.length - shown} remaining
          </button>
        </div>
      )}
    </div>
  );
}
