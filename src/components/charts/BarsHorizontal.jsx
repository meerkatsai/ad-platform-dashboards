import React from 'react';

/* Ranked list with many named categories. items: [{id,label,value,sub?}] sorted by caller.
   One colour per category (RGBY order); when selectedId is set the others dim. */
export function BarsHorizontal({ items = [], format = (v) => v, selectedId, onSelect, max, rowH = 30, labelW = 200 }) {
  const [hv, setHv] = React.useState(null);
  const mx = max || Math.max(...items.map((i) => i.value), 0) || 1;
  return (
    <div className="grid items-center gap-y-1" style={{ gridTemplateColumns: `${labelW}px 1fr 84px` }}>
      {items.map((it, i) => {
        const on = it.id === selectedId, h = hv === it.id;
        const col = `var(--series-${(i % 8) + 1})`;
        const fill = selectedId && !on && !h ? 'var(--series-dim)' : col;
        const interactive = onSelect ? 'cursor-pointer' : 'cursor-default';
        return (
          <React.Fragment key={it.id}>
            <div
              onClick={() => onSelect && onSelect(it.id)}
              onMouseEnter={() => setHv(it.id)}
              onMouseLeave={() => setHv(null)}
              className={`flex items-center gap-2 overflow-hidden pr-3 ${interactive}`}
              style={{ height: rowH }}
            >
              <span className="num w-[18px] flex-none font-mono text-micro text-ink-400">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`truncate text-body ${on ? 'font-medium text-ink-900' : 'font-normal text-ink-700'}`}>
                {it.label}
              </span>
            </div>
            <div
              onClick={() => onSelect && onSelect(it.id)}
              onMouseEnter={() => setHv(it.id)}
              onMouseLeave={() => setHv(null)}
              className={`flex items-center ${interactive}`}
              style={{ height: rowH }}
            >
              <div
                className="min-w-[2px] rounded-[1px] transition-all duration-200 ease-mk"
                style={{
                  height: Math.round(rowH * 0.55),
                  width: (Math.max(0, it.value) / mx) * 100 + '%',
                  background: fill,
                }}
              />
            </div>
            <div className={`num text-right text-body text-ink-900 ${on ? 'font-semibold' : 'font-medium'}`}>
              {format(it.value)}
              {it.sub && <div className="font-mono text-micro font-normal text-ink-400">{it.sub}</div>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
