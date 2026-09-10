import React from 'react';

/* Ranked/operational table. columns: [{key,label,format?,align?,bar?,width?,render?}]. rows: objects with id.
   Click row → onSelect. pageSize + Show more. */
export function DataTable({ columns = [], rows = [], selectedId, onSelect, pageSize = 10, sortKey, sortDir = 'desc', onSort }) {
  const [shown, setShown] = React.useState(pageSize);
  const [sk, setSk] = React.useState(sortKey);
  const [sd, setSd] = React.useState(sortDir);
  const sorted = React.useMemo(() => {
    if (!sk) return rows;
    return [...rows].sort((a, b) => (a[sk] > b[sk] ? 1 : -1) * (sd === 'asc' ? 1 : -1));
  }, [rows, sk, sd]);
  const barMax = {};
  columns.filter((c) => c.bar).forEach((c) => (barMax[c.key] = Math.max(...rows.map((r) => r[c.key] || 0)) || 1));
  const click = (c) => {
    if (sk === c.key) setSd(sd === 'asc' ? 'desc' : 'asc');
    else { setSk(c.key); setSd('desc'); }
    onSort && onSort(c.key);
  };
  return (
    <div className="w-full">
      <table className="num w-full table-fixed border-collapse">
        <colgroup>
          {columns.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => click(c)}
                className={`sticky top-0 h-9 cursor-pointer select-none whitespace-nowrap bg-sunken px-3 text-label font-medium text-ink-500 ${
                  c.align === 'right' || (!c.align && c.format) ? 'text-right' : 'text-left'
                }`}
              >
                {c.label}
                {sk === c.key && <span className="ml-1 text-ink-400">{sd === 'asc' ? '↑' : '↓'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, shown).map((r) => {
            const on = r.id === selectedId;
            return (
              <tr
                key={r.id}
                onClick={() => onSelect && onSelect(r.id)}
                className={`transition-colors duration-fast ${on ? 'bg-select' : 'hover:bg-sunken'} ${
                  onSelect ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {columns.map((c) => {
                  const v = r[c.key];
                  const right = c.align === 'right' || (!c.align && c.format);
                  return (
                    <td
                      key={c.key}
                      className={`h-row truncate whitespace-nowrap border-b border-rule px-3 text-body ${
                        right ? 'text-right' : 'text-left'
                      } ${on ? 'text-ink-900' : 'text-ink-700'} ${
                        on && c.key === columns[0].key
                          ? 'font-medium shadow-[inset_2px_0_0_var(--series-1)]'
                          : 'font-normal'
                      }`}
                    >
                      {c.bar ? (
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 flex-1 rounded-[1px] bg-bar-track">
                            <div
                              className={`h-full rounded-[1px] ${on ? 'bg-bar-active' : 'bg-bar-neutral'}`}
                              style={{ width: ((v || 0) / barMax[c.key]) * 100 + '%' }}
                            />
                          </div>
                          <span className="w-16 text-right">{c.format ? c.format(v) : v}</span>
                        </div>
                      ) : c.render ? (
                        c.render(r)
                      ) : c.format ? (
                        c.format(v)
                      ) : (
                        v
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length > shown && (
        <div className="flex justify-center pb-0.5 pt-2.5">
          <button
            onClick={() => setShown(shown + pageSize)}
            className="h-ctl-sm cursor-pointer rounded-ctl border border-rule bg-card px-2.5 text-label font-medium text-ink-700 hover:bg-sunken"
          >
            Show {Math.min(pageSize, rows.length - shown)} more · {rows.length - shown} remaining
          </button>
        </div>
      )}
    </div>
  );
}
