Dropdown for platform switching and in-card metric selection.

```jsx
<Select size="lg" icon="layers" value="all" options={[{value:'all',label:'All platforms'},{value:'amazon',label:'Amazon Ads'}]} onChange={setPlatform} />
<Select size="sm" value="roas" options={metrics} onChange={setMetric} />
```