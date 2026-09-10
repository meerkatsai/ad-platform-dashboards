import React from 'react';
/* Period toggle (D / W / M) and other 2–4 way exclusive choices. */
export function Segmented({value, options, onChange, size='md', style}){
  const h=size==='sm'?'var(--ctl-h-sm)':'var(--ctl-h)';
  return <div role="radiogroup" style={{display:'inline-flex',height:h,padding:2,background:'var(--surface-sunken)',borderRadius:'var(--radius-ctl)',gap:2,...style}}>
    {options.map(o=>{ const on=o.value===value; return <button key={o.value} role="radio" aria-checked={on} onClick={()=>onChange&&onChange(o.value)} style={{padding:size==='sm'?'0 8px':'0 12px',border:0,borderRadius:3,background:on?'var(--surface-card)':'transparent',color:on?'var(--ink-900)':'var(--ink-500)',fontSize:size==='sm'?'var(--fs-label)':'var(--fs-body)',fontWeight:'var(--fw-medium)',boxShadow:on?'0 0 0 1px var(--rule)':'none',cursor:'pointer',transition:'all var(--dur-fast)'}}>{o.label}</button>; })}
  </div>;
}