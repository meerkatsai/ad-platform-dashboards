import React from 'react';
import { Icon } from './Icon.jsx';
/* Per-card date range control. Presets dropdown; a real calendar picker can replace the menu. value: preset key. */
const PRESETS=[{value:'7d',label:'Last 7 days',range:'24 – 30 Aug 2026'},{value:'30d',label:'Last 30 days',range:'1 – 30 Aug 2026'},{value:'mtd',label:'Month to date',range:'1 – 10 Sep 2026'},{value:'90d',label:'Last 90 days',range:'2 Jun – 30 Aug 2026'},{value:'custom',label:'Custom range…',range:'Custom'}];
export function DateRange({value='30d', onChange, size='sm', style}){
  const [open,setOpen]=React.useState(false); const ref=React.useRef();
  React.useEffect(()=>{ const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[]);
  const cur=PRESETS.find(p=>p.value===value)||PRESETS[1];
  return <div ref={ref} style={{position:'relative',display:'inline-block',...style}}>
    <button onClick={()=>setOpen(!open)} style={{height:size==='sm'?'var(--ctl-h-sm)':'var(--ctl-h)',display:'inline-flex',alignItems:'center',gap:6,padding:size==='sm'?'0 8px':'0 12px',border:'1px solid '+(open?'var(--ink-900)':'var(--rule)'),borderRadius:'var(--radius-ctl)',background:'var(--surface-card)',color:'var(--ink-900)',fontSize:size==='sm'?'var(--fs-label)':'var(--fs-body)',fontWeight:'var(--fw-medium)',cursor:'pointer',whiteSpace:'nowrap'}}>
      <Icon name="calendar" size={13} style={{color:'var(--ink-500)'}}/><span className="num">{cur.range}</span><Icon name="chevron-down" size={12} style={{color:'var(--ink-400)'}}/></button>
    {open&&<div role="listbox" style={{position:'absolute',top:'calc(100% + 4px)',right:0,minWidth:180,background:'var(--surface-card)',border:'1px solid var(--rule)',borderRadius:'var(--radius-ctl)',boxShadow:'var(--shadow-float)',padding:4,zIndex:20}}>
      {PRESETS.map(p=><Opt key={p.value} p={p} sel={p.value===value} onPick={()=>{onChange&&onChange(p.value);setOpen(false);}}/>)}</div>}
  </div>;
}
function Opt({p,sel,onPick}){ const [hv,setHv]=React.useState(false);
  return <div role="option" aria-selected={sel} onMouseEnter={()=>setHv(true)} onMouseLeave={()=>setHv(false)} onClick={onPick} style={{display:'flex',justifyContent:'space-between',gap:16,padding:'6px 10px',borderRadius:3,fontSize:'var(--fs-body)',color:sel?'var(--accent)':'var(--ink-700)',fontWeight:sel?'var(--fw-medium)':400,background:hv?'var(--surface-sunken)':'transparent',cursor:'pointer',whiteSpace:'nowrap'}}><span>{p.label}</span><span className="num" style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-micro)',color:'var(--ink-400)'}}>{p.range}</span></div>; }