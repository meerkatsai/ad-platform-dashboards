import React from 'react';

/* Time-series line chart. Hover: vertical crosshair, point marker on the nearest series, single-series tooltip, other series dimmed.
   series: [{id,label,data:number[],color?,dashed?}]  labels: string[] (same length as data). */
const COLORS = [
  'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)',
  'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)',
];

export function TrendLine({ series = [], labels = [], format = (v) => v, height = 240, yTicks = 4 }) {
  const ref = React.useRef();
  const [w, setW] = React.useState(800);
  const [hv, setHv] = React.useState(null); // {i, sid}
  React.useEffect(() => {
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const pad = { l: 52, r: 16, t: 12, b: 26 };
  const iw = Math.max(10, w - pad.l - pad.r), ih = height - pad.t - pad.b;
  const n = labels.length;
  const all = series.flatMap((s) => s.data).filter((v) => v != null);
  const max = Math.max(...all, 0), min = Math.min(...all, 0);
  const nice = niceScale(min, max, yTicks);
  const x = (i) => pad.l + (n > 1 ? i / (n - 1) : 0.5) * iw;
  const y = (v) => pad.t + ih - ((v - nice.min) / (nice.max - nice.min || 1)) * ih;
  const path = (s) =>
    s.data.map((v, i) => (v == null ? '' : (i && s.data[i - 1] != null ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1))).join(' ');
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    if (px < pad.l || px > w - pad.r) { setHv(null); return; }
    const i = Math.round(((px - pad.l) / iw) * (n - 1));
    let best = null, bd = 1e9;
    series.forEach((s) => {
      const v = s.data[i];
      if (v == null) return;
      const d = Math.abs(y(v) - py);
      if (d < bd) { bd = d; best = s.id; }
    });
    setHv({ i, sid: best });
  };
  const hs = hv && series.find((s) => s.id === hv.sid);
  const hvv = hs && hs.data[hv.i];
  const tipLeft = hv ? Math.min(Math.max(x(hv.i) + 12, pad.l), w - 180) : 0;
  const strokeFor = (s, k) => s.color || (s.dashed ? 'var(--series-compare)' : COLORS[k % 8]);
  return (
    <div ref={ref} className="relative w-full" onMouseMove={onMove} onMouseLeave={() => setHv(null)}>
      <svg width={w} height={height} className="block overflow-visible">
        {nice.ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fontFamily="'Geist Mono', ui-monospace, monospace" fill="var(--chart-axis)">
              {format(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) => {
          const st = Math.ceil(n / 8);
          return (
            (n <= 8 || i === n - 1 || (i % st === 0 && n - 1 - i >= st / 2)) && (
              <text
                key={i}
                x={x(i)}
                y={height - 6}
                textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                fontSize="11"
                fontFamily="'Geist Mono', ui-monospace, monospace"
                fill="var(--chart-axis)"
              >
                {l}
              </text>
            )
          );
        })}
        {series.map((s, k) => {
          const dim = hv && hv.sid !== s.id;
          return (
            <path
              key={s.id}
              d={path(s)}
              fill="none"
              stroke={dim ? 'var(--series-dim)' : strokeFor(s, k)}
              strokeWidth={s.dashed ? 1.5 : 2}
              strokeDasharray={s.dashed ? '4 4' : undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="transition-[stroke] duration-fast"
            />
          );
        })}
        {hv && <line x1={x(hv.i)} x2={x(hv.i)} y1={pad.t} y2={pad.t + ih} stroke="var(--chart-crosshair)" strokeWidth="1" strokeDasharray="2 3" />}
        {hs && hvv != null && (
          <circle cx={x(hv.i)} cy={y(hvv)} r="4.5" fill="var(--surface-card)" stroke={strokeFor(hs, series.indexOf(hs))} strokeWidth="2" />
        )}
      </svg>
      {hs && hvv != null && (
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-ctl bg-ink-900 px-2.5 py-1.5 text-label leading-snug text-white shadow-float"
          style={{ left: tipLeft, top: Math.max(0, y(hvv) - 44) }}
        >
          <div className="font-mono text-micro text-ink-300">{labels[hv.i]}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-ink-300">{hs.label}</span>
            <strong className="num text-[13px] font-semibold">{format(hvv)}</strong>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 pt-1.5" style={{ paddingLeft: pad.l }}>
        {series.map((s, k) => (
          <span key={s.id} className="inline-flex items-center gap-1.5 text-label text-ink-500">
            <span
              className="h-0 w-3.5"
              style={{ borderTop: (s.dashed ? '1.5px dashed ' : '2px solid ') + strokeFor(s, k) }}
            />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function niceScale(min, max, n) {
  if (max === min) max = min + 1;
  const raw = (max - min) / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(+t.toFixed(10));
  return { min: lo, max: hi, ticks };
}
