import React from 'react';
/* Dashboard chrome: wordmark + platform dropdown only. Dates, period and compare live on each card. */
export function TopBar({platform,setPlatform}){
  const platforms=[{value:'all',label:'All platforms'},{value:'amazon',label:'Amazon Ads'},{value:'flipkart',label:'Flipkart Ads'},{value:'google',label:'Google Ads'},{value:'meta',label:'Meta Ads'}];
  return <div style={{position:'sticky',top:0,zIndex:10,background:'var(--surface-page)',borderBottom:'1px solid var(--rule)'}}>
    <div style={{maxWidth:'var(--page-max-w)',margin:'0 auto',padding:'12px var(--page-pad)',display:'flex',alignItems:'center',gap:16}}>
      <div style={{display:'flex',alignItems:'baseline',gap:12}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:'var(--fs-title)',color:'var(--ink-900)',letterSpacing:'-0.01em',lineHeight:1}}>Dashboard</span>
        <span style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-micro)',color:'var(--ink-400)',textTransform:'uppercase',letterSpacing:'var(--tracking-caps)'}}>Sundaram Kitchenware</span></div>
      <div style={{flex:1}}/>
      <Select size="lg" icon="layers" value={platform} options={platforms} onChange={setPlatform}/>
    </div></div>;
}