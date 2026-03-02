import { Search, Plus } from 'lucide-react';

/**
 * Reusable page header with search bar, filter dropdowns, and action buttons.
 *
 * @param {Object}   props
 * @param {string}   props.searchValue
 * @param {Function} props.onSearchChange
 * @param {Function} props.onSearchSubmit  - form submit handler
 * @param {string}   [props.searchPlaceholder]
 * @param {Function} [props.onAdd]         - primary "Add" button handler
 * @param {string}   [props.addLabel]      - e.g. "Add Country"
 * @param {React.ReactNode} [props.filters]      - extra filter JSX (selects etc.)
 * @param {React.ReactNode} [props.extraActions]  - extra action buttons
 */
export default function PageHeader({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search...',
  onAdd,
  addLabel = 'Add',
  filters,
  extraActions,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex gap-3 w-full sm:w-auto flex-wrap">
        <form onSubmit={onSearchSubmit} className="relative flex-1 sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className="pl-11 pr-4 py-2.5 bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-ink dark:text-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 w-full transition-all"
          />
        </form>
        {filters}
      </div>
      <div className="flex gap-3 shrink-0">
        {extraActions}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 text-sm font-bold bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-hover transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
