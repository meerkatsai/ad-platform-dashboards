import React from 'react';
/* Labelled switch — used for "Compare" (previous period / target). */
export function Toggle({checked, onChange, label, style}){
  return <label style={{display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'var(--fs-body)',color:'var(--ink-700)',...style}}>
    <span role="switch" aria-checked={checked} onClick={()=>onChange&&onChange(!checked)} style={{width:30,height:18,borderRadius:'var(--radius-pill)',background:checked?'var(--accent)':'var(--ink-300)',position:'relative',transition:'background var(--dur-fast)',flex:'0 0 auto'}}>
      <span style={{position:'absolute',top:2,left:checked?14:2,width:14,height:14,borderRadius:'50%',background:'#fff',transition:'left var(--dur-fast) var(--ease)'}}/></span>
    {label&&<span>{label}</span>}
  </label>;
}