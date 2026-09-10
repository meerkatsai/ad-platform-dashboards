import React from 'react';
import { Delta } from '../core/Delta.jsx';
/* Period-over-period table: rows = entities, columns = dates (days / ISO weeks / months), cell = value + delta vs the previous column.
   rows: [{id,label,values:number[]}]  periods: string[]  format: value formatter  invert: lower is better  showDelta: toggle per-cell deltas */
export function PeriodTable({rows=[], periods=[], format=v=>v, invert=false, showDelta=true, labelW=220, cellW=96, pageSize=10, style}){
  const [shown,setShown]=React.useState(pageSize); const [hv,setHv]=React.useState(null);
  const th={height:36,padding:'0 10px',fontSize:'var(--fs-label)',fontWeight:'var(--fw-medium)',color:'var(--ink-500)',background:'var(--surface-sunken)',whiteSpace:'nowrap',textAlign:'right',position:'sticky',top:0,zIndex:1};
  return <div style={{width:'100%',...style}}>
    <div style={{overflowX:'auto'}}>
    <table className="num" style={{borderCollapse:'separate',borderSpacing:0,minWidth:labelW+periods.length*cellW}}>
      <thead><tr>
        <th style={{...th,textAlign:'left',minWidth:labelW,position:'sticky',left:0,zIndex:2}}>Campaign</th>
        {periods.map(p=><th key={p} style={{...th,minWidth:cellW}}>{p}</th>)}
        <th style={{...th,minWidth:cellW,borderLeft:'1px solid var(--rule)'}}>Period Δ</th>
      </tr></thead>
      <tbody>{rows.slice(0,shown).map(r=>{ const h=hv===r.id; const first=r.values[0], last=r.values[r.values.length-1]; const tot=first?((last-first)/first*100):null;
        return <tr key={r.id} onMouseEnter={()=>setHv(r.id)} onMouseLeave={()=>setHv(null)} style={{background:h?'var(--surface-sunken)':'transparent'}}>
          <td style={{height:'var(--row-h)',padding:'0 10px',borderBottom:'1px solid var(--rule)',fontSize:'var(--fs-body)',color:'var(--ink-700)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:labelW,position:'sticky',left:0,background:h?'var(--surface-sunken)':'var(--surface-card)',zIndex:1}}>{r.label}</td>
          {r.values.map((v,i)=>{ const prev=i?r.values[i-1]:null; const d=prev?((v-prev)/prev*100):null;
            return <td key={i} style={{height:'var(--row-h)',padding:'0 10px',borderBottom:'1px solid var(--rule)',textAlign:'right',fontSize:'var(--fs-body)',color:'var(--ink-900)',whiteSpace:'nowrap',verticalAlign:'middle'}}>
              <div style={{lineHeight:1.15}}>{format(v)}</div>
              {showDelta&&<div style={{lineHeight:1,marginTop:2}}>{i?<Delta value={d} invert={invert} tone={Math.abs(d)>=5?'status':'plain'}/>:<span style={{fontSize:'var(--fs-micro)',color:'var(--ink-300)',fontFamily:'var(--font-mono)'}}>—</span>}</div>}
            </td>; })}
          <td style={{height:'var(--row-h)',padding:'0 10px',borderBottom:'1px solid var(--rule)',borderLeft:'1px solid var(--rule)',textAlign:'right',whiteSpace:'nowrap'}}><Delta value={tot} invert={invert}/></td>
        </tr>; })}</tbody>
    </table></div>
    {rows.length>shown&&<div style={{display:'flex',justifyContent:'center',padding:'10px 0 2px'}}><button onClick={()=>setShown(shown+pageSize)} style={{height:'var(--ctl-h-sm)',padding:'0 10px',border:'1px solid var(--rule)',borderRadius:'var(--radius-ctl)',background:'var(--surface-card)',fontSize:'var(--fs-label)',fontWeight:500,color:'var(--ink-700)',cursor:'pointer'}}>Show {Math.min(pageSize,rows.length-shown)} more · {rows.length-shown} remaining</button></div>}
  </div>;
}