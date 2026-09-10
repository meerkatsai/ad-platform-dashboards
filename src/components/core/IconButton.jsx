import React from 'react';
import { Icon } from './Icon.jsx';

/* Square 28px icon-only control used in card headers. active = pinned/on state (ember). */
export function IconButton({ icon, label, active, onClick, className = '' }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-ctl border border-transparent bg-transparent transition-all duration-fast hover:bg-sunken focus-ember ${
        active ? 'text-accent' : 'text-ink-400 hover:text-ink-700'
      } ${className}`}
    >
      <Icon name={icon} size={15} />
    </button>
  );
}
