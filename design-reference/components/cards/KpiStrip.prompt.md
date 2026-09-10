Headline numbers grouped in one strip so related metrics sit together; each carries delta vs previous and vs target. Clicking a KPI can drive the trend below.

```jsx
<KpiStrip items={[{key:'spend',label:'Spend',value:fmtINR(1240000),delta:8.2,target:-2.1,spark:[…]},{key:'acos',label:'ACOS',value:fmtPct(24.1),delta:-1.4,invert:true}]} selectedKey={metric} onSelect={setMetric} />
```