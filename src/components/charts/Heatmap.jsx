import React from 'react';

/* Two-dimensional grid: rows × cols, cell = value. Sequential blue ramp + value text always shown;
   invert=true when lower is better (ACOS, CPC, CPI). */
export function Heatmap({ rows = [], cols = [], values = [], format = (v) => v, invert = false, rowLabelW = 200, cellH = 36 }) {
  const flat = values.flat().filter((v) => v != null);
  const min = Math.min(...flat), max = Math.max(...flat);
  const span = max - min || 1;
  const shade = (v) => {
    if (v == null) return 0;
    let t = (v - min) / span;
    if (invert) t = 1 - t;
    return Math.min(5, Math.floor(t * 5.999));
  };
  const [hv, setHv] = React.useState(null);
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `${rowLabelW}px repeat(${cols.length}, minmax(0,1fr))` }}>
      <div />
      {cols.map((c) => (
        <div key={c} className="truncate px-1 pb-1.5 text-center text-label font-medium text-ink-500">
          {c}
        </div>
      ))}
      {rows.map((r, ri) => (
        <React.Fragment key={r}>
          <div
            className={`flex items-center truncate pr-3 text-body ${hv && hv[0] === ri ? 'text-ink-900' : 'text-ink-700'}`}
            style={{ height: cellH }}
          >
            {r}
          </div>
          {cols.map((c, ci) => {
            const v = values[ri]?.[ci];
            const s = shade(v);
            const on = hv && hv[0] === ri && hv[1] === ci;
            return (
              <div
                key={c}
                onMouseEnter={() => setHv([ri, ci])}
                onMouseLeave={() => setHv(null)}
                className={`num flex cursor-default items-center justify-center rounded-sm text-body ${
                  s >= 3 ? 'font-medium' : 'font-normal'
                }`}
                style={{
                  height: cellH,
                  background: v == null ? 'var(--surface-sunken)' : `var(--heat-${s})`,
                  color: s >= 4 ? 'var(--heat-text-light)' : v == null ? 'var(--ink-300)' : 'var(--heat-text-dark)',
                  outline: on ? '1.5px solid var(--ink-900)' : 'none',
                  outlineOffset: -1,
                }}
              >
                {v == null ? '—' : format(v)}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
