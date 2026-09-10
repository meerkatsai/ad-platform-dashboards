Primary time-series representation for Performance-over-Time, pacing, selected-entity history. Max 4 series; compare = dashed.

```jsx
<TrendLine labels={days} format={fmtINR} series={[{id:'spend',label:'Spend',data:spend},{id:'prev',label:'Spend · prev period',data:prev,dashed:true}]} />
```
Hover shows the single nearest series; the others dim.