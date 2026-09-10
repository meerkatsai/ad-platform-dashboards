/**
 * meerkats.ai ad-dashboard design tokens.
 * Colors resolve to CSS custom properties declared in src/index.css so the
 * token layer stays a single source of truth (charts read the same vars in SVG).
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        page: 'var(--surface-page)',
        card: 'var(--surface-card)',
        sunken: 'var(--surface-sunken)',
        tint: 'var(--surface-tint)',
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
          300: 'var(--ink-300)',
        },
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
          grid: 'var(--rule-grid)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          tint: 'var(--accent-tint)',
        },
        good: { DEFAULT: 'var(--good)', bg: 'var(--good-bg)' },
        bad: { DEFAULT: 'var(--bad)', bg: 'var(--bad-bg)' },
        series: {
          1: 'var(--series-1)',
          2: 'var(--series-2)',
          3: 'var(--series-3)',
          4: 'var(--series-4)',
          5: 'var(--series-5)',
          6: 'var(--series-6)',
          7: 'var(--series-7)',
          8: 'var(--series-8)',
          compare: 'var(--series-compare)',
          dim: 'var(--series-dim)',
        },
        select: 'var(--select-tint)',
        'bar-track': 'var(--bar-track)',
        'bar-neutral': 'var(--bar-neutral)',
        'bar-active': 'var(--bar-active)',
      },
      fontFamily: {
        ui: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        title: ['26px', { lineHeight: '1.15' }],
        kpi: ['28px', { lineHeight: '1.05' }],
        card: ['15px', { lineHeight: '1.2' }],
        body: ['13px', { lineHeight: '1.45' }],
        label: ['12px', { lineHeight: '1.45' }],
        micro: ['11px', { lineHeight: '1.45' }],
      },
      borderRadius: {
        card: '6px',
        ctl: '4px',
      },
      borderWidth: {
        strong: '1.5px',
      },
      maxWidth: {
        page: '1440px',
      },
      boxShadow: {
        float: '0 4px 16px rgba(11,11,12,.10), 0 0 0 1px rgba(11,11,12,.06)',
      },
      transitionTimingFunction: {
        mk: 'cubic-bezier(.2,.7,.2,1)',
      },
      transitionDuration: {
        fast: '120ms',
      },
      letterSpacing: {
        caps: '0.06em',
      },
      height: {
        ctl: '32px',
        'ctl-sm': '26px',
        row: '40px',
      },
    },
  },
  plugins: [],
};
