import React from 'react';
import { Icon } from './Icon.jsx';
/* Change indicator. value = % change. invert=true when lower is better (ACOS, CPC, CPI). tone: 'status' colours it, 'plain' keeps ink. */
export function Delta({value, invert=false, tone='status', suffix, style}){
  if (value==null) return <span style={{color:'var(--ink-400)',fontSize:'var(--fs-micro)',...style}}>—</span>;
  const good = invert ? value<0 : value>0; const flat=Math.abs(value)<0.05;
  const color = tone==='plain'||flat ? 'var(--ink-500)' : good ? 'var(--good)' : 'var(--bad)';
  const txt=(value>0?'+':value<0?'−':'')+Math.abs(Math.round(value*10)/10).toFixed(1)+'%';
  return <span className="num" style={{display:'inline-flex',alignItems:'center',gap:2,color,fontSize:'var(--fs-micro)',fontWeight:'var(--fw-medium)',fontFamily:'var(--font-mono)',...style}}>
    {!flat&&<Icon name={value>0?'arrow-up-right':'arrow-down-right'} size={11}/>}{txt}{suffix&&<span style={{color:'var(--ink-400)',fontWeight:400,marginLeft:4}}>{suffix}</span>}</span>;
}