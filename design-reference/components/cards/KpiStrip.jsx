import React from 'react';
import { Delta } from '../core/Delta.jsx';
import { Sparkline } from '../charts/Sparkline.jsx';
/* Grouped headline metrics in one row. items: [{key,label,value(string),delta,target,invert,spark,compare}]. selectedKey highlights. */
export function KpiStrip({items=[], selectedKey, onSelect, columns, style}){
  const [hv,setHv]=React.useState(null);
  return <div style={{display:'grid',gridTemplateColumns:'repeat('+(columns||items.length)+', minmax(0,1fr))',...style}}>
    {items.map((it,i)=>{ const on=it.key===selectedKey, h=hv===it.key;
      return <div key={it.key} onClick={()=>onSelect&&onSelect(it.key)} onMouseEnter={()=>setHv(it.key)} onMouseLeave={()=>setHv(null)} style={{padding:'12px 16px',borderLeft:i?'1px solid var(--rule)':'none',background:on?'var(--select-tint)':h?'var(--surface-sunken)':'transparent',cursor:onSelect?'pointer':'default',boxShadow:on?'inset 0 -2px 0 var(--series-1)':'none',transition:'background var(--dur-fast)',minWidth:0}}>
        <div style={{fontSize:'var(--fs-label)',color:'var(--ink-500)',fontWeight:'var(--fw-medium)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.label}</div>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:8,marginTop:4,flexWrap:'wrap'}}>
          <div className="num" style={{fontSize:'var(--fs-kpi)',fontWeight:'var(--fw-semibold)',color:'var(--ink-900)',lineHeight:1.05,letterSpacing:'-0.01em',whiteSpace:'nowrap'}}>{it.value}</div>
          {it.spark&&<Sparkline data={it.spark} compare={it.compare} width={64} height={22}/>}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:2,marginTop:6,whiteSpace:'nowrap'}}>
          <Delta value={it.delta} invert={it.invert} suffix="vs prev"/>
          {it.target!=null&&<Delta value={it.target} invert={it.invert} suffix="vs target"/>}
        </div>
      </div>; })}
  </div>;
}