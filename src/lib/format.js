/* Indian-locale number formatting: K (thousand), L (lakh), Cr (crore). Never more than 1 decimal on a card. */
export function fmtINR(v) {
  if (v == null || isNaN(v)) return '—';
  const abs = Math.abs(v), sign = v < 0 ? '−' : '';
  const p = '₹';
  if (abs >= 1e7) return sign + p + trim(abs / 1e7) + ' Cr';
  if (abs >= 1e5) return sign + p + trim(abs / 1e5) + ' L';
  if (abs >= 1e3) return sign + p + trim(abs / 1e3) + 'K';
  return sign + p + Math.round(abs);
}

export function fmtNum(v) {
  if (v == null || isNaN(v)) return '—';
  const abs = Math.abs(v), sign = v < 0 ? '−' : '';
  if (abs >= 1e7) return sign + trim(abs / 1e7) + ' Cr';
  if (abs >= 1e5) return sign + trim(abs / 1e5) + ' L';
  if (abs >= 1e3) return sign + trim(abs / 1e3) + 'K';
  return sign + Math.round(abs);
}

export function fmtPct(v, d = 1) {
  return v == null ? '—' : (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d) + '%';
}

export function fmtX(v) {
  return v == null ? '—' : (Math.round(v * 10) / 10).toFixed(1) + '×';
}

export function fmtDelta(v) {
  if (v == null) return '—';
  const s = v > 0 ? '+' : v < 0 ? '−' : '';
  return s + Math.abs(Math.round(v * 10) / 10).toFixed(1) + '%';
}

function trim(n) {
  return n >= 100 ? Math.round(n).toString() : (Math.round(n * 10) / 10).toString();
}

/* Pick a formatter from a metric's unit key */
export function fmtBy(unit) {
  return { inr: fmtINR, num: fmtNum, pct: fmtPct, x: fmtX }[unit] || fmtNum;
}
