import React from 'react';
/* Two-dimensional grid: rows × cols, cell = value. Sequential ember tint + value text; invert=true when lower is better (ACOS, CPC). */
export function Heatmap({rows=[], cols=[], values=[], format=v=>v, invert=false, rowLabelW=200, cellH=36, style}){
  const flat=values.flat().filter(v=>v!=null); const min=Math.min(...flat), max=Math.max(...flat); const span=(max-min)||1;
  const shade=v=>{ if(v==null) return 0; let t=(v-min)/span; if(invert) t=1-t; return Math.min(5,Math.floor(t*5.999)); };
  const [hv,setHv]=React.useState(null);
  return <div style={{display:'grid',gridTemplateColumns:rowLabelW+'px repeat('+cols.length+', minmax(0,1fr))',gap:2,...style}}>
    <div/>{cols.map(c=><div key={c} style={{fontSize:'var(--fs-label)',color:'var(--ink-500)',fontWeight:'var(--fw-medium)',textAlign:'center',padding:'0 4px 6px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c}</div>)}
    {rows.map((r,ri)=><React.Fragment key={r}>
      <div style={{height:cellH,display:'flex',alignItems:'center',paddingRight:12,fontSize:'var(--fs-body)',color:hv&&hv[0]===ri?'var(--ink-900)':'var(--ink-700)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r}</div>
      {cols.map((c,ci)=>{ const v=values[ri]?.[ci]; const s=shade(v); const on=hv&&hv[0]===ri&&hv[1]===ci;
        return <div key={c} onMouseEnter={()=>setHv([ri,ci])} onMouseLeave={()=>setHv(null)} className="num" style={{height:cellH,display:'flex',alignItems:'center',justifyContent:'center',background:v==null?'var(--surface-sunken)':'var(--heat-'+s+')',color:s>=4?'var(--heat-text-light)':v==null?'var(--ink-300)':'var(--heat-text-dark)',fontSize:'var(--fs-body)',fontWeight:s>=3?'var(--fw-medium)':400,borderRadius:2,outline:on?'1.5px solid var(--ink-900)':'none',outlineOffset:-1,cursor:'default'}}>{v==null?'—':format(v)}</div>; })}
    </React.Fragment>)}
  </div>;
}