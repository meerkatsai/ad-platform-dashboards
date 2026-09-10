import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

/* Full-width dashboard card. Every table / chart lives inside one.
   Header: drag handle · title + question · controls (metric selector, period, compare, date range) · synced · CSV · pin. */
export function ReportCard({
  title,
  question,
  controls,
  synced,
  pinned = true,
  onPin,
  onDownload,
  draggable = true,
  footer,
  children,
}) {
  return (
    <section className="flex w-full flex-col rounded-card border border-rule bg-card">
      <header className="flex min-h-12 items-center gap-3 border-b-strong border-rule-strong py-2.5 pl-2 pr-3">
        {draggable && (
          <span title="Drag to reorder" className="flex cursor-grab px-0.5 text-ink-300">
            <Icon name="grip-vertical" size={14} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-card font-semibold leading-tight text-ink-900">{title}</h3>
          {question && <div className="mt-0.5 truncate text-label text-ink-500">{question}</div>}
        </div>
        {controls && <div className="flex flex-wrap items-center justify-end gap-2">{controls}</div>}
        <div className="ml-1 flex flex-none items-center gap-0.5">
          {synced && (
            <span className="mr-1.5 whitespace-nowrap font-mono text-micro text-ink-400">synced {synced}</span>
          )}
          {onDownload && <IconButton icon="download" label="Download CSV" onClick={onDownload} />}
          <IconButton
            icon={pinned ? 'pin' : 'pin-off'}
            label={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
            active={pinned}
            onClick={onPin}
          />
        </div>
      </header>
      <div className="flex min-w-0 flex-col gap-4 px-5 py-4">{children}</div>
      {footer && <div className="border-t border-rule px-5 pb-3 pt-2 text-label text-ink-400">{footer}</div>}
    </section>
  );
}
