Exact values, full metric sets and operational drill-down. Numbers right-aligned, tabular; one inline bar column at most.

```jsx
<DataTable columns={[{key:'name',label:'Campaign'},{key:'spend',label:'Spend',format:fmtINR,bar:true},{key:'roas',label:'ROAS',format:fmtX}]} rows={campaigns} selectedId={sel} onSelect={setSel} />
```