import React from 'react';
import { Icon } from './Icon.jsx';

/* Change indicator. value = % change. invert=true when lower is better (ACOS, CPC, CPI). tone: 'status' colours it, 'plain' keeps ink. */
export function Delta({ value, invert = false, tone = 'status', suffix, className = '' }) {
  if (value == null) return <span className={`text-micro text-ink-400 ${className}`}>—</span>;
  const good = invert ? value < 0 : value > 0;
  const flat = Math.abs(value) < 0.05;
  const color = tone === 'plain' || flat ? 'text-ink-500' : good ? 'text-good' : 'text-bad';
  const txt = (value > 0 ? '+' : value < 0 ? '−' : '') + Math.abs(Math.round(value * 10) / 10).toFixed(1) + '%';
  return (
    <span className={`num inline-flex items-center gap-0.5 font-mono text-micro font-medium ${color} ${className}`}>
      {!flat && <Icon name={value > 0 ? 'arrow-up-right' : 'arrow-down-right'} size={11} />}
      {txt}
      {suffix && <span className="ml-1 font-normal text-ink-400">{suffix}</span>}
    </span>
  );
}
