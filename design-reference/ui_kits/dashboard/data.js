/* Seeded sample data per platform (INR). Not real figures. */
(function(){
 let seed=7; const rnd=()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
 const days=Array.from({length:30},(_,i)=>(i+1)+' Aug');
 const weeks=['W27','W28','W29','W30','W31','W32','W33','W34','W35'];
 const months=['Mar','Apr','May','Jun','Jul','Aug'];
 const walk=(base,vol,n,drift=0)=>{ let v=base; return Array.from({length:n},(_,i)=>{ v=v*(1+(rnd()-.5)*vol+drift); return Math.round(v); }); };
 const mk=(names,spendBase=180000,roasBase=4.4,extra)=>names.map((name,i)=>{ const spend=Math.round(spendBase/(1+i*.28)*(0.85+rnd()*.3)); const roas=+(roasBase*(1.15-i*.07)*(0.9+rnd()*.2)).toFixed(1); const sales=Math.round(spend*roas); const clicks=Math.round(spend/(8+rnd()*10)); const impr=clicks*Math.round(90+rnd()*120);
   return Object.assign({id:'c'+i,name,spend,sales,roas,acos:+(100/roas).toFixed(1),clicks,impr,ctr:+(clicks/impr*100).toFixed(2),cpc:+(spend/clicks).toFixed(1),orders:Math.round(sales/(900+rnd()*900)),cvr:+(3+rnd()*6).toFixed(1),share:0},extra?extra(i):{}); });
 const share=rows=>{ const t=rows.reduce((a,r)=>a+r.spend,0); rows.forEach(r=>r.share=+(r.spend/t*100).toFixed(1)); return rows; };
 const P={};
 P.amazon={ name:'Amazon Ads', kpi_labels:{spend:'Spend',sales:'Sales',roas:'ROAS'}, campaigns:share(mk(['Diwali Sale · SP','Brand Defense · SB','Kitchen Bestsellers · SP','Retargeting · SD','Category Cookware · SP','Auto Broad · SP','New Launch Mixer · SP','Competitor Conquest · SP','Video Cookware · SBV','Festive Gifting · SB','Stainless Range · SP','Clearance · SP'])),
   placements:['Top of search','Rest of search','Product pages'], kpi:{spend:walk(72000,.12,30,.006),sales:walk(330000,.14,30,.008)},
   metrics:[{key:'roas',label:'ROAS',unit:'x'},{key:'sales',label:'Sales',unit:'inr'},{key:'spend',label:'Spend',unit:'inr'},{key:'acos',label:'ACOS',unit:'pct',invert:true}] };
 P.flipkart={ name:'Flipkart Ads', kpi_labels:{spend:'Ad Spend',sales:'Revenue',roas:'ROAS'}, campaigns:share(mk(['Big Billion Days · PLA','Brand Store · Display','Kitchen Appliances · PLA','Category Contextual · PCA','Retarget Cart · Display','Broad Match · PLA','Mixer Launch · PLA','Cookware Browse · PLA','Homepage Takeover · Display','Gifting · PCA'])),
   placements:['Search','Browse / Category','PDP','Homepage'], kpi:{spend:walk(48000,.14,30,.004),sales:walk(196000,.16,30,.006)},
   metrics:[{key:'roas',label:'ROAS',unit:'x'},{key:'sales',label:'Revenue',unit:'inr'},{key:'spend',label:'Ad Spend',unit:'inr'},{key:'ctr',label:'CTR',unit:'pct'}] };
 P.google={ name:'Google Ads', kpi_labels:{spend:'Cost',sales:'Conv. value',roas:'Conv. value / cost'}, campaigns:share(mk(['Brand Search · IN','Generic Cookware · Search','PMax · Kitchen','Shopping · Bestsellers','Competitor · Search','Remarketing · Display','YouTube · Launch','Demand Gen · Festive','Discovery · Gifting','App Install · UAC','Local · Metro Stores'])),
   placements:['Mobile','Desktop','Tablet'], kpi:{spend:walk(95000,.1,30,.005),sales:walk(380000,.12,30,.007)},
   metrics:[{key:'roas',label:'Conv. value / cost',unit:'x'},{key:'sales',label:'Conv. value',unit:'inr'},{key:'spend',label:'Cost',unit:'inr'},{key:'cpc',label:'Cost / conv.',unit:'inr',invert:true}] };
 P.meta={ name:'Meta Ads', kpi_labels:{spend:'Spend',sales:'Purchase value',roas:'ROAS'}, campaigns:share(mk(['Prospecting · Broad IN','Retargeting · ATC 7d','Lookalike · Purchasers','Festive Launch · Video','Catalog Sales · DPA','App Install · Android','App Install · iOS','Creators · UGC','Metro · Interest','Lead Gen · Signups'],60000,3.2,i=>({cpi:+(38+rnd()*40+i*3).toFixed(0),freq:+(1.4+rnd()*2.2).toFixed(1),reach:Math.round(80000+rnd()*400000)}))),
   placements:['Android','iOS'], kpi:{spend:walk(64000,.13,30,.005),sales:walk(205000,.15,30,.006)},
   metrics:[{key:'roas',label:'ROAS',unit:'x'},{key:'share',label:'Spend share',unit:'pct'},{key:'spend',label:'Spend',unit:'inr'},{key:'cpi',label:'CPI',unit:'inr',invert:true},{key:'cvr',label:'CVR',unit:'pct'}] };
 for(const k in P){ const p=P[k]; p.kpi.prevSpend=p.kpi.spend.map(v=>Math.round(v*(0.86+rnd()*.1))); p.kpi.prevSales=p.kpi.sales.map(v=>Math.round(v*(0.84+rnd()*.12)));
   p.grid=p.campaigns.slice(0,8).map(c=>p.placements.map((_,j)=>+(c.roas*(1.25-j*.22)*(0.85+rnd()*.3)).toFixed(1)));
   p.trendByCampaign={}; p.campaigns.forEach(c=>{ p.trendByCampaign[c.id]={roas:walk(c.roas*10,.1,30).map(v=>+(v/10).toFixed(1)),sales:walk(c.sales/30,.18,30,.004),spend:walk(c.spend/30,.12,30,.003),acos:walk(c.acos*10,.1,30).map(v=>+(v/10).toFixed(1)),ctr:walk(c.ctr*100,.08,30).map(v=>+(v/100).toFixed(2)),cpc:walk(c.cpc*10,.08,30).map(v=>+(v/10).toFixed(1)),share:walk(c.share*10,.06,30).map(v=>+(v/10).toFixed(1)),cpi:walk((c.cpi||50)*10,.1,30).map(v=>+(v/10).toFixed(0)),cvr:walk(c.cvr*10,.1,30).map(v=>+(v/10).toFixed(1))}; });
 }
 window.DATA={days,weeks,months,platforms:P};
})();