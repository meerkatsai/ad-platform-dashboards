import React from 'react';
import { Select } from '../core/Select.jsx';

/* Dashboard chrome: wordmark + platform dropdown only. Dates, period and compare live on each card. */
export function TopBar({ platform, setPlatform }) {
  const platforms = [
    { value: 'all', label: 'All platforms' },
    { value: 'amazon', label: 'Amazon Ads' },
    { value: 'flipkart', label: 'Flipkart Ads' },
    { value: 'google', label: 'Google Ads' },
    { value: 'meta', label: 'Meta Ads' },
  ];
  return (
    <div className="sticky top-0 z-10 border-b border-rule bg-page">
      <div className="mx-auto flex max-w-page items-center gap-4 px-6 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-title leading-none tracking-[-0.01em] text-ink-900">Dashboard</span>
          <span className="font-mono text-micro uppercase tracking-caps text-ink-400">Sundaram Kitchenware</span>
        </div>
        <div className="flex-1" />
        <Select size="lg" icon="layers" value={platform} options={platforms} onChange={setPlatform} />
      </div>
    </div>
  );
}
