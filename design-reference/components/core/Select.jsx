import React from 'react';
import { Icon } from './Icon.jsx';
/* Dropdown. options: [{value,label}]. Used for platform switcher (size lg) and in-card metric selector (size sm). */
export function Select({value, options, onChange, size='md', icon, style}){
  const [open,setOpen]=React.useState(false);
  const ref=React.useRef();
  React.useEffect(()=>{ const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[]);
  const cur=options.find(o=>o.value===value)||options[0];
  const h=size==='sm'?'var(--ctl-h-sm)':size==='lg'?36:'var(--ctl-h)';
  return <div ref={ref} style={{position:'relative',display:'inline-block',...style}}>
    <button onClick={()=>setOpen(!open)} style={{height:h,display:'inline-flex',alignItems:'center',gap:8,padding:size==='sm'?'0 8px':'0 12px',border:'1px solid '+(open?'var(--ink-900)':'var(--rule)'),borderRadius:'var(--radius-ctl)',background:'var(--surface-card)',color:'var(--ink-900)',fontSize:size==='sm'?'var(--fs-label)':size==='lg'?15:'var(--fs-body)',fontWeight:size==='lg'?'var(--fw-semibold)':'var(--fw-medium)',cursor:'pointer',whiteSpace:'nowrap'}}>
      {icon&&<Icon name={icon} size={14} style={{color:'var(--ink-500)'}}/>}<span>{cur.label}</span><Icon name="chevron-down" size={13} style={{color:'var(--ink-400)'}}/></button>
    {open&&<div role="listbox" style={{position:'absolute',top:'calc(100% + 4px)',left:0,minWidth:'100%',background:'var(--surface-card)',border:'1px solid var(--rule)',borderRadius:'var(--radius-ctl)',boxShadow:'var(--shadow-float)',padding:4,zIndex:20}}>
      {options.map(o=><Opt key={o.value} o={o} sel={o.value===value} onPick={()=>{onChange&&onChange(o.value);setOpen(false);}}/>)}</div>}
  </div>;
}
function Opt({o,sel,onPick}){ const [hv,setHv]=React.useState(false);
  return <div role="option" aria-selected={sel} onMouseEnter={()=>setHv(true)} onMouseLeave={()=>setHv(false)} onClick={onPick} style={{padding:'6px 10px',borderRadius:3,fontSize:'var(--fs-body)',color:sel?'var(--accent)':'var(--ink-700)',fontWeight:sel?'var(--fw-medium)':'var(--fw-regular)',background:hv?'var(--surface-sunken)':'transparent',cursor:'pointer',whiteSpace:'nowrap'}}>{o.label}</div>; }