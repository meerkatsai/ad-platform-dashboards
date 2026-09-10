import React from 'react';
import { Icon } from './Icon.jsx';

/* Dropdown. options: [{value,label}]. Used for the platform switcher (size lg) and in-card metric selectors (size sm). */
export function Select({ value, options, onChange, size = 'md', icon, className = '' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const cur = options.find((o) => o.value === value) || options[0];
  const sizing =
    size === 'sm'
      ? 'h-ctl-sm px-2 text-label font-medium'
      : size === 'lg'
        ? 'h-9 px-3 text-[15px] font-semibold'
        : 'h-ctl px-3 text-body font-medium';
  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-ctl border bg-card text-ink-900 cursor-pointer focus-ember ${sizing} ${
          open ? 'border-ink-900' : 'border-rule'
        }`}
      >
        {icon && <Icon name={icon} size={14} className="text-ink-500" />}
        <span>{cur.label}</span>
        <Icon name="chevron-down" size={13} className="text-ink-400" />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-full rounded-ctl border border-rule bg-card p-1 shadow-float"
        >
          {options.map((o) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange && onChange(o.value);
                setOpen(false);
              }}
              className={`cursor-pointer whitespace-nowrap rounded-[3px] px-2.5 py-1.5 text-body hover:bg-sunken ${
                o.value === value ? 'font-medium text-accent' : 'font-normal text-ink-700'
              }`}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
