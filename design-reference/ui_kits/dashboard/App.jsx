import React from 'react';
/* Dashboard = stack of independently pinned single-visualization cards, newest pin last. */
const PLATFORM_CARDS=[
  {id:'kpi',C:'KpiCard'},{id:'trend',C:'TrendCard'},{id:'rank',C:'RankCard'},{id:'ctrend',C:'CampaignTrendCard'},{id:'table',C:'TableCard'},{id:'dod',C:'DoDTableCard'},{id:'wow',C:'WoWTableCard'},{id:'mom',C:'MoMTableCard'},{id:'grid',C:'GridCard'},{id:'pbars',C:'PlacementBarsCard'}];
const META_CARDS=[{id:'kpi',C:'KpiCard'},{id:'trend',C:'TrendCard'},{id:'rank',C:'RankCard'},{id:'ctrend',C:'CampaignTrendCard'},{id:'table',C:'TableCard'},{id:'dod',C:'DoDTableCard'},{id:'wow',C:'WoWTableCard'},{id:'mom',C:'MoMTableCard'},{id:'os',C:'OsBarsCard'},{id:'grid',C:'GridCard'}];
const ALL_CARDS=[{id:'bkpi',C:'BlendedKpiCard'},{id:'ptrend',C:'PlatformTrendCard'},{id:'pspend',C:'PlatformSpendBarsCard'},{id:'proas',C:'PlatformRoasBarsCard'},{id:'ptable',C:'PlatformTableCard'}];
export function App(){
  const [platform,setPlatform]=React.useState(localStorage.getItem('mk-dash-platform')||'amazon');
  const [unpinned,setUnpinned]=React.useState({});
  React.useEffect(()=>localStorage.setItem('mk-dash-platform',platform),[platform]);
  const list=platform==='all'?ALL_CARDS:platform==='meta'?META_CARDS:PLATFORM_CARDS;
  const key=id=>platform+':'+id; const toggle=id=>setUnpinned(u=>({...u,[key(id)]:!u[key(id)]}));
  const hidden=list.filter(c=>unpinned[key(c.id)]).length;
  return <div style={{minHeight:'100vh',background:'var(--surface-page)'}}>
    <TopBar platform={platform} setPlatform={setPlatform}/>
    <main style={{maxWidth:'var(--page-max-w)',margin:'0 auto',padding:'var(--page-pad)',display:'flex',flexDirection:'column',gap:'var(--card-gap)'}}>
      {list.filter(c=>!unpinned[key(c.id)]).map(c=>React.createElement(MK[c.C],{key:key(c.id),pk:platform,pinned:true,onPin:()=>toggle(c.id)}))}
      {hidden>0&&<div style={{padding:'12px 16px',border:'1px dashed var(--rule)',borderRadius:'var(--radius-card)',fontSize:'var(--fs-body)',color:'var(--ink-500)',display:'flex',justifyContent:'space-between',alignItems:'center'}}><span>{hidden} card{hidden>1?'s':''} unpinned — available in Reports.</span><button onClick={()=>setUnpinned({})} style={{border:0,background:'none',color:'var(--accent)',fontWeight:500,cursor:'pointer',fontSize:'var(--fs-body)'}}>Restore all</button></div>}
      <div style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-micro)',color:'var(--ink-400)',padding:'8px 0 24px'}}>Sample data · figures in INR · one visualization per card · pin order: newest last</div>
    </main>
  </div>;
}