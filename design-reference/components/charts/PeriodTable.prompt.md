Day-on-day / week-on-week / month-on-month campaign table. Dates are the columns; every cell shows the value and its Δ vs the previous period; the last column is the full-period Δ. Deltas under 5% stay grey so the table is not a sea of red/green.

```jsx
<PeriodTable periods={weeks} rows={campaigns.map(c=>({id:c.id,label:c.name,values:c.weeklySpend}))} format={fmtINR} />
<PeriodTable periods={days} rows={acosRows} format={fmtPct} invert />
```