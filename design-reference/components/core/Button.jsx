import React from 'react';
import { Icon } from './Icon.jsx';
/* variant: primary | secondary | ghost. size: md (32) | sm (26). */
export function Button({variant='secondary', size='md', icon, children, disabled, style, ...rest}){
  const [hover,setHover]=React.useState(false);
  const base={display:'inline-flex',alignItems:'center',gap:6,height:size==='sm'?'var(--ctl-h-sm)':'var(--ctl-h)',padding:size==='sm'?'0 10px':'0 12px',borderRadius:'var(--radius-ctl)',fontSize:size==='sm'?'var(--fs-label)':'var(--fs-body)',fontWeight:'var(--fw-medium)',cursor:disabled?'not-allowed':'pointer',border:'1px solid transparent',transition:'background var(--dur-fast) var(--ease), color var(--dur-fast)',opacity:disabled?.45:1,whiteSpace:'nowrap'};
  const v={
    primary:{background:hover?'var(--accent-hover)':'var(--accent)',color:'var(--text-on-accent)'},
    secondary:{background:hover?'var(--surface-sunken)':'var(--surface-card)',color:'var(--ink-700)',borderColor:'var(--rule)'},
    ghost:{background:hover?'var(--surface-sunken)':'transparent',color:'var(--ink-500)'}
  }[variant];
  return <button disabled={disabled} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{...base,...v,...style}} {...rest}>{icon&&<Icon name={icon} size={size==='sm'?13:15}/>}{children}</button>;
}