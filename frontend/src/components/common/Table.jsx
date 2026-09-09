import React from 'react';
import { cn } from '../../utils/cn';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

export function Table({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  className,
  onRowClick,
}) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs', className)}>
      <table className="w-full text-left text-sm text-slate-600 border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider select-none">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={cn('px-6 py-3.5', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12">
                <LoadingState label="Loading table data..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12">
                <EmptyState title="No Data Available" description={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || row._id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={col.key || colIdx} className={cn('px-6 py-4 whitespace-nowrap', col.tdClassName)}>
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
