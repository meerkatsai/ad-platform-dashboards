import React from 'react';
import { Delta } from '../core/Delta.jsx';
import { Sparkline } from '../charts/Sparkline.jsx';

/* Grouped headline metrics in one row. items: [{key,label,value(string),delta,target,invert,spark,compare}]. selectedKey highlights. */
export function KpiStrip({ items = [], selectedKey, onSelect, columns }) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${columns || items.length}, minmax(0,1fr))` }}
    >
      {items.map((it, i) => {
        const on = it.key === selectedKey;
        return (
          <div
            key={it.key}
            onClick={() => onSelect && onSelect(it.key)}
            className={`min-w-0 px-4 py-3 transition-colors duration-fast ${i ? 'border-l border-rule' : ''} ${
              on ? 'bg-select shadow-[inset_0_-2px_0_var(--series-1)]' : 'hover:bg-sunken'
            } ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="truncate text-label font-medium text-ink-500">{it.label}</div>
            <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
              <div className="num whitespace-nowrap text-kpi font-semibold tracking-[-0.01em] text-ink-900">
                {it.value}
              </div>
              {it.spark && <Sparkline data={it.spark} compare={it.compare} width={64} height={22} />}
            </div>
            <div className="mt-1.5 flex flex-col gap-0.5 whitespace-nowrap">
              <Delta value={it.delta} invert={it.invert} suffix="vs prev" />
              {it.target != null && <Delta value={it.target} invert={it.invert} suffix="vs target" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
