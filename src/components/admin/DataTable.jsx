import { Loader2, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Reusable admin data table with loading, error, empty state, and pagination.
 *
 * @param {Object}   props
 * @param {Array}    props.columns       - [{ key, label, className?, render? }]
 * @param {Array}    props.data          - row objects
 * @param {boolean}  props.loading
 * @param {string}   [props.error]       - error message to display
 * @param {Function} [props.onRetry]     - retry callback shown when error
 * @param {number}   props.page
 * @param {number}   props.totalPages
 * @param {Function} props.onPageChange
 * @param {Function} [props.onEdit]      - (row) => void
 * @param {Function} [props.onDelete]    - (row) => void
 * @param {Function} [props.renderActions] - (row) => JSX  — override default edit/delete buttons
 * @param {string}   [props.emptyMessage]
 * @param {Function} [props.onEmptyAction] - callback for "Add first" link
 * @param {string}   [props.emptyActionLabel]
 * @param {number}   [props.pageSize=30]
 * @param {number}   [props.totalCount]
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  onRetry,
  page = 1,
  totalPages = 1,
  totalCount,
  onPageChange,
  renderActions,
  emptyMessage = 'No data found',
  onEmptyAction,
  emptyActionLabel,
  pageSize = 30,
}) {
  return (
    <div className="bg-white dark:bg-d-card rounded-3xl border border-gray-100 dark:border-white/[0.08] shadow-lg shadow-ink/5 dark:shadow-black/20 overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 text-brand animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-red-500 dark:text-red-400 font-medium text-center max-w-sm">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand hover:bg-brand/10 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-light dark:text-white/50 font-medium">{emptyMessage}</p>
          {onEmptyAction && (
            <button onClick={onEmptyAction} className="text-brand font-bold text-sm mt-2 hover:underline cursor-pointer">
              {emptyActionLabel || 'Add your first item'}
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-ink-light dark:text-white/50 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-white/[0.08]">
                <th className="px-6 py-3 font-bold">#</th>
                {columns.map(col => (
                  <th key={col.key} className={`px-6 py-3 font-bold ${col.headerClassName || ''}`}>
                    {col.label}
                  </th>
                ))}
                {renderActions && <th className="px-6 py-3 font-bold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} className="hover:bg-canvas dark:hover:bg-d-surface transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                  <td className="px-6 py-4 text-sm font-bold text-brand">
                    {(page - 1) * pageSize + i + 1}
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className={`px-6 py-4 ${col.className || ''}`}>
                      {col.render ? col.render(row) : (
                        <span className="text-sm text-ink dark:text-white">{row[col.key] ?? '-'}</span>
                      )}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4">
                      <div className="flex gap-1">{renderActions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination — always show when data exists */}
      {!loading && !error && data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.08]">
          <p className="text-sm text-ink-light dark:text-white/50">
            {totalCount != null
              ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalCount)} of ${totalCount}`
              : `Page ${page} of ${totalPages}`
            }
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(1)}
                disabled={page === 1}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] disabled:opacity-30 hover:bg-canvas dark:hover:bg-d-surface cursor-pointer text-ink dark:text-white transition-all text-xs font-bold"
              >
                First
              </button>
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] disabled:opacity-30 hover:bg-canvas dark:hover:bg-d-surface cursor-pointer text-ink dark:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page number buttons */}
              {(() => {
                const pages = [];
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPages, start + 4);
                if (end - start < 4) start = Math.max(1, end - 4);
                for (let p = start; p <= end; p++) pages.push(p);
                return pages.map(p => (
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      p === page
                        ? 'bg-brand text-white shadow-sm'
                        : 'border border-gray-200 dark:border-white/[0.08] text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface'
                    }`}
                  >
                    {p}
                  </button>
                ));
              })()}

              <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] disabled:opacity-30 hover:bg-canvas dark:hover:bg-d-surface cursor-pointer text-ink dark:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={page === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] disabled:opacity-30 hover:bg-canvas dark:hover:bg-d-surface cursor-pointer text-ink dark:text-white transition-all text-xs font-bold"
              >
                Last
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
