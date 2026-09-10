import React from 'react';
/* Few discrete categories side by side. Single series → one colour per category (RGBY order); multi-series → one colour per series. groups: [{label, values:number[]}] */
export function BarsVertical({groups=[], seriesLabels=['Value'], format=v=>v, height=220, style}){
  const ref=React.useRef(); const [w,setW]=React.useState(600); const [hv,setHv]=React.useState(null);
  React.useEffect(()=>{ const ro=new ResizeObserver(e=>setW(e[0].contentRect.width)); ro.observe(ref.current); return ()=>ro.disconnect(); },[]);
  const pad={l:52,r:8,t:16,b:26}; const iw=w-pad.l-pad.r, ih=height-pad.t-pad.b; const ns=seriesLabels.length;
  const nice=niceScale(0,Math.max(...groups.flatMap(g=>g.values),0)*1.08||1,4); const max=nice.max; const y=v=>pad.t+ih-(v/max)*ih;
  const gw=iw/groups.length, bw=Math.min(ns>1?56:96,(gw*0.6)/ns), gap=4;
  const colors=['var(--series-1)','var(--series-2)','var(--series-3)','var(--series-4)','var(--series-5)','var(--series-6)','var(--series-7)','var(--series-8)'];
  const ticks=nice.ticks;
  return <div ref={ref} style={{position:'relative',width:'100%',...style}} onMouseLeave={()=>setHv(null)}>
    <svg width={w} height={height} style={{display:'block'}}>
      {ticks.map(t=><g key={t}><line x1={pad.l} x2={w-pad.r} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)"/><text x={pad.l-8} y={y(t)+4} textAnchor="end" fontSize="11" fontFamily="var(--font-mono)" fill="var(--chart-axis)">{format(t)}</text></g>)}
      {groups.map((g,i)=>{ const cx=pad.l+gw*i+gw/2; const tot=bw*ns+gap*(ns-1); return <g key={i}>
        {g.values.map((v,k)=>{ const bx=cx-tot/2+k*(bw+gap); const on=hv&&hv.i===i&&hv.k===k; const dim=hv&&!on; return <rect key={k} x={bx} y={y(v)} width={bw} height={Math.max(0,pad.t+ih-y(v))} fill={dim?'var(--series-dim)':(ns===1?colors[i%8]:colors[k])} rx="1" onMouseEnter={()=>setHv({i,k})} style={{transition:'fill var(--dur-fast)',cursor:'default'}}/>; })}
        <text x={cx} y={height-6} textAnchor="middle" fontSize="11" fontFamily="var(--font-ui)" fill="var(--ink-500)">{trunc(g.label,gw)}</text></g>; })}
      {hv&&(()=>{ const g=groups[hv.i]; const cx=pad.l+gw*hv.i+gw/2; const v=g.values[hv.k]; return <text x={cx-((bw*ns+gap*(ns-1))/2)+hv.k*(bw+gap)+bw/2} y={y(v)-6} textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="var(--font-mono)" fill="var(--ink-900)">{format(v)}</text>; })()}
    </svg>
    {ns>1&&<div style={{display:'flex',gap:16,paddingLeft:pad.l,paddingTop:4}}>{seriesLabels.map((l,k)=><span key={l} style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:'var(--fs-label)',color:'var(--ink-500)'}}><span style={{width:10,height:10,background:colors[k],borderRadius:1}}/>{l}</span>)}</div>}
  </div>;
}
function niceScale(min,max,n){ if(max===min){max=min+1;} const raw=(max-min)/n, mag=Math.pow(10,Math.floor(Math.log10(raw))); const step=[1,2,2.5,5,10].map(m=>m*mag).find(s=>s>=raw); const lo=Math.floor(min/step)*step, hi=Math.ceil(max/step)*step; const ticks=[]; for(let t=lo;t<=hi+1e-9;t+=step) ticks.push(+t.toFixed(10)); return {min:lo,max:hi,ticks}; }
function trunc(s,w){ const n=Math.max(3,Math.floor((w-8)/6.4)); return s.length>n?s.slice(0,n-1)+'…':s; }