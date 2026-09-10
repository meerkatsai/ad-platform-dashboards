import React from 'react';
import { Icon } from './Icon.jsx';

/* Per-card date range control. Presets dropdown; a real calendar picker can replace the menu. value: preset key. */
const PRESETS = [
  { value: '7d', label: 'Last 7 days', range: '24 – 30 Aug 2026' },
  { value: '30d', label: 'Last 30 days', range: '1 – 30 Aug 2026' },
  { value: 'mtd', label: 'Month to date', range: '1 – 10 Sep 2026' },
  { value: '90d', label: 'Last 90 days', range: '2 Jun – 30 Aug 2026' },
  { value: 'custom', label: 'Custom range…', range: 'Custom' },
];

export function DateRange({ value = '30d', onChange, size = 'sm', className = '' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const cur = PRESETS.find((p) => p.value === value) || PRESETS[1];
  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-ctl border bg-card font-medium text-ink-900 focus-ember ${
          size === 'sm' ? 'h-ctl-sm px-2 text-label' : 'h-ctl px-3 text-body'
        } ${open ? 'border-ink-900' : 'border-rule'}`}
      >
        <Icon name="calendar" size={13} className="text-ink-500" />
        <span className="num">{cur.range}</span>
        <Icon name="chevron-down" size={12} className="text-ink-400" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[180px] rounded-ctl border border-rule bg-card p-1 shadow-float"
        >
          {PRESETS.map((p) => (
            <div
              key={p.value}
              role="option"
              aria-selected={p.value === value}
              onClick={() => {
                onChange && onChange(p.value);
                setOpen(false);
              }}
              className={`flex cursor-pointer justify-between gap-4 whitespace-nowrap rounded-[3px] px-2.5 py-1.5 text-body hover:bg-sunken ${
                p.value === value ? 'font-medium text-accent' : 'font-normal text-ink-700'
              }`}
            >
              <span>{p.label}</span>
              <span className="num font-mono text-micro text-ink-400">{p.range}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
