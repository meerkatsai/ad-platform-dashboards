import React from 'react';
import { Icon } from './Icon.jsx';

/* variant: primary | secondary | ghost. size: md (32) | sm (26). */
export function Button({ variant = 'secondary', size = 'md', icon, children, disabled, className = '', ...rest }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-ctl font-medium whitespace-nowrap border border-transparent transition-colors duration-fast ease-mk focus-ember ' +
    (size === 'sm' ? 'h-ctl-sm px-2.5 text-label ' : 'h-ctl px-3 text-body ') +
    (disabled ? 'cursor-not-allowed opacity-45 ' : 'cursor-pointer ');
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-card text-ink-700 border-rule hover:bg-sunken',
    ghost: 'bg-transparent text-ink-500 hover:bg-sunken',
  };
  return (
    <button disabled={disabled} className={`${base}${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 13 : 15} />}
      {children}
    </button>
  );
}
