import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
/* Full-width dashboard card. Every table / chart lives inside one. Header: drag handle · title + question · controls (metric selector, period, compare) · synced · CSV · pin. */
export function ReportCard({title, question, controls, synced, pinned=true, onPin, onDownload, draggable=true, footer, children, style}){
  return <section style={{background:'var(--surface-card)',border:'1px solid var(--rule)',borderRadius:'var(--radius-card)',width:'100%',display:'flex',flexDirection:'column',...style}}>
    <header style={{display:'flex',alignItems:'center',gap:12,minHeight:'var(--card-header-h)',padding:'10px 12px 10px 8px',borderBottom:'1.5px solid var(--rule-strong)'}}>
      {draggable&&<span title="Drag to reorder" style={{color:'var(--ink-300)',cursor:'grab',display:'flex',padding:'0 2px'}}><Icon name="grip-vertical" size={14}/></span>}
      <div style={{flex:'1 1 auto',minWidth:0}}>
        <h3 style={{margin:0,fontSize:'var(--fs-card)',fontWeight:'var(--fw-semibold)',color:'var(--ink-900)',lineHeight:1.2}}>{title}</h3>
        {question&&<div style={{fontSize:'var(--fs-label)',color:'var(--ink-500)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{question}</div>}
      </div>
      {controls&&<div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',justifyContent:'flex-end'}}>{controls}</div>}
      <div style={{display:'flex',alignItems:'center',gap:2,marginLeft:4,flex:'0 0 auto'}}>
        {synced&&<span style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-micro)',color:'var(--ink-400)',marginRight:6,whiteSpace:'nowrap'}}>synced {synced}</span>}
        {onDownload&&<IconButton icon="download" label="Download CSV" onClick={onDownload}/>}
        <IconButton icon={pinned?'pin':'pin-off'} label={pinned?'Unpin from dashboard':'Pin to dashboard'} active={pinned} onClick={onPin}/>
      </div>
    </header>
    <div style={{padding:'var(--card-pad-y) var(--card-pad-x)',display:'flex',flexDirection:'column',gap:16,minWidth:0}}>{children}</div>
    {footer&&<div style={{padding:'8px var(--card-pad-x) 12px',fontSize:'var(--fs-label)',color:'var(--ink-400)',borderTop:'1px solid var(--rule)'}}>{footer}</div>}
  </section>;
}