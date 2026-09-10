import React from 'react';
/* Ranked list with many named categories. items: [{id,label,value,sub?}] sorted by caller. One colour per category (RGBY order); when selectedId is set the others dim. */
export function BarsHorizontal({items=[], format=v=>v, selectedId, onSelect, max, rowH=30, labelW=200, style}){
  const [hv,setHv]=React.useState(null); const mx=max||Math.max(...items.map(i=>i.value),0)||1;
  return <div style={{display:'grid',gridTemplateColumns:labelW+'px 1fr 84px',rowGap:4,alignItems:'center',...style}}>
    {items.map((it,i)=>{ const on=it.id===selectedId, h=hv===it.id; const col='var(--series-'+(i%8+1)+')'; const fill=(selectedId&&!on&&!h)?'var(--series-dim)':col;
      return <React.Fragment key={it.id}>
        <div onClick={()=>onSelect&&onSelect(it.id)} onMouseEnter={()=>setHv(it.id)} onMouseLeave={()=>setHv(null)} style={{height:rowH,display:'flex',alignItems:'center',gap:8,paddingRight:12,cursor:onSelect?'pointer':'default',overflow:'hidden'}}>
          <span className="num" style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-micro)',color:'var(--ink-400)',width:18,flex:'0 0 auto'}}>{String(i+1).padStart(2,'0')}</span>
          <span style={{fontSize:'var(--fs-body)',color:on?'var(--ink-900)':'var(--ink-700)',fontWeight:on?'var(--fw-medium)':400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.label}</span></div>
        <div onClick={()=>onSelect&&onSelect(it.id)} onMouseEnter={()=>setHv(it.id)} onMouseLeave={()=>setHv(null)} style={{height:rowH,display:'flex',alignItems:'center',cursor:onSelect?'pointer':'default'}}>
          <div style={{height:Math.round(rowH*0.55),width:(Math.max(0,it.value)/mx*100)+'%',minWidth:2,background:fill,borderRadius:1,transition:'width var(--dur) var(--ease), background var(--dur-fast)'}}/></div>
        <div className="num" style={{textAlign:'right',fontSize:'var(--fs-body)',fontWeight:on?'var(--fw-semibold)':'var(--fw-medium)',color:'var(--ink-900)'}}>{format(it.value)}{it.sub&&<div style={{fontSize:'var(--fs-micro)',color:'var(--ink-400)',fontFamily:'var(--font-mono)',fontWeight:400}}>{it.sub}</div>}</div>
      </React.Fragment>; })}
  </div>;
}