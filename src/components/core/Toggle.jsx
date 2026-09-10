import React from 'react';

/* Labelled switch — used for "Compare" (previous period / target). */
export function Toggle({ checked, onChange, label, className = '' }) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2 text-body text-ink-700 ${className}`}>
      <span
        role="switch"
        aria-checked={checked}
        onClick={() => onChange && onChange(!checked)}
        className={`relative h-[18px] w-[30px] flex-none rounded-full transition-colors duration-fast ${
          checked ? 'bg-accent' : 'bg-ink-300'
        }`}
      >
        <span
          className="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all duration-fast ease-mk"
          style={{ left: checked ? 14 : 2 }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  );
}
