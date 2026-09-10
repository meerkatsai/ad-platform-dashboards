import React from 'react';
import { Icon } from './Icon.jsx';
/* Square 28px icon-only control used in card headers. active = pinned/on state (ember). */
export function IconButton({icon, label, active, size=28, onClick, style}){
  const [hover,setHover]=React.useState(false);
  return <button aria-label={label} title={label} onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:'var(--radius-ctl)',background:hover?'var(--surface-sunken)':'transparent',color:active?'var(--accent)':hover?'var(--ink-700)':'var(--ink-400)',cursor:'pointer',transition:'all var(--dur-fast)',...style}}>
    <Icon name={icon} size={15}/></button>;
}