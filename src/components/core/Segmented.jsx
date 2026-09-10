import React from 'react';

/* Period toggle (D / W / M) and other 2–4 way exclusive choices. */
export function Segmented({ value, options, onChange, size = 'md', className = '' }) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex gap-0.5 rounded-ctl bg-sunken p-0.5 ${size === 'sm' ? 'h-ctl-sm' : 'h-ctl'} ${className}`}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange && onChange(o.value)}
            className={`cursor-pointer rounded-[3px] border-0 font-medium transition-all duration-fast focus-ember ${
              size === 'sm' ? 'px-2 text-label' : 'px-3 text-body'
            } ${on ? 'bg-card text-ink-900 ring-1 ring-rule' : 'bg-transparent text-ink-500'}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
