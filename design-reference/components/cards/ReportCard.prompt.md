The single container for every dashboard element. One card = one catalog report, full width, stacked with 16px gaps.

```jsx
<ReportCard title="Campaign Performance" question="Which campaigns are driving sales efficiently?" synced="2m ago" pinned onPin={toggle} onDownload={csv}
  controls={<><Select size="sm" .../><Segmented size="sm" .../><Toggle label="Compare" .../></>}>
  <TrendLine .../>
  <DataTable .../>
</ReportCard>
```