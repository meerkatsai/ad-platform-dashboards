import React from 'react';
/* Ranked/operational table. columns: [{key,label,format?,align?,bar?,width?}]. rows: objects with id. Click row → onSelect. pageSize + Show more. */
export function DataTable({columns=[], rows=[], selectedId, onSelect, pageSize=10, sortKey, sortDir='desc', onSort, style}){
  const [shown,setShown]=React.useState(pageSize); const [hv,setHv]=React.useState(null);
  const [sk,setSk]=React.useState(sortKey), [sd,setSd]=React.useState(sortDir);
  const sorted=React.useMemo(()=>{ if(!sk) return rows; return [...rows].sort((a,b)=>(a[sk]>b[sk]?1:-1)*(sd==='asc'?1:-1)); },[rows,sk,sd]);
  const barMax={}; columns.filter(c=>c.bar).forEach(c=>barMax[c.key]=Math.max(...rows.map(r=>r[c.key]||0))||1);
  const th={height:36,padding:'0 12px',fontSize:'var(--fs-label)',fontWeight:'var(--fw-medium)',color:'var(--ink-500)',background:'var(--surface-sunken)',whiteSpace:'nowrap',cursor:'pointer',userSelect:'none',position:'sticky',top:0};
  const click=c=>{ if(sk===c.key) setSd(sd==='asc'?'desc':'asc'); else {setSk(c.key);setSd('desc');} onSort&&onSort(c.key); };
  return <div style={{width:'100%',...style}}>
    <table className="num" style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
      <colgroup>{columns.map(c=><col key={c.key} style={{width:c.width}}/>)}</colgroup>
      <thead><tr>{columns.map(c=><th key={c.key} onClick={()=>click(c)} style={{...th,textAlign:c.align||(c.format?'right':'left')}}>{c.label}{sk===c.key&&<span style={{marginLeft:4,color:'var(--ink-400)'}}>{sd==='asc'?'↑':'↓'}</span>}</th>)}</tr></thead>
      <tbody>{sorted.slice(0,shown).map(r=>{ const on=r.id===selectedId, h=hv===r.id;
        return <tr key={r.id} onClick={()=>onSelect&&onSelect(r.id)} onMouseEnter={()=>setHv(r.id)} onMouseLeave={()=>setHv(null)} style={{background:on?'var(--select-tint)':h?'var(--surface-sunken)':'transparent',cursor:onSelect?'pointer':'default',transition:'background var(--dur-fast)'}}>
          {columns.map(c=>{ const v=r[c.key]; const right=c.align==='right'||(!c.align&&c.format);
            return <td key={c.key} style={{height:'var(--row-h)',padding:'0 12px',borderBottom:'1px solid var(--rule)',textAlign:right?'right':'left',fontSize:'var(--fs-body)',color:on?'var(--ink-900)':'var(--ink-700)',fontWeight:on&&c.key===columns[0].key?'var(--fw-medium)':400,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',boxShadow:on&&c.key===columns[0].key?'inset 2px 0 0 var(--series-1)':'none'}}>
              {c.bar?<div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'flex-end'}}><div style={{flex:1,height:6,background:'var(--bar-track)',borderRadius:1}}><div style={{height:'100%',width:((v||0)/barMax[c.key]*100)+'%',background:on?'var(--bar-active)':'var(--bar-neutral)',borderRadius:1}}/></div><span style={{width:64,textAlign:'right'}}>{c.format?c.format(v):v}</span></div>
              :c.render?c.render(r):c.format?c.format(v):v}</td>; })}
        </tr>; })}</tbody>
    </table>
    {rows.length>shown&&<div style={{display:'flex',justifyContent:'center',padding:'10px 0 2px'}}><button onClick={()=>setShown(shown+pageSize)} style={{height:'var(--ctl-h-sm)',padding:'0 10px',border:'1px solid var(--rule)',borderRadius:'var(--radius-ctl)',background:'var(--surface-card)',fontSize:'var(--fs-label)',fontWeight:500,color:'var(--ink-700)',cursor:'pointer'}}>Show {Math.min(pageSize,rows.length-shown)} more · {rows.length-shown} remaining</button></div>}
  </div>;
}