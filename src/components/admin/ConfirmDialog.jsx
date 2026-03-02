import { AlertTriangle } from 'lucide-react';

/**
 * Reusable confirm dialog for destructive actions.
 *
 * @param {Object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onConfirm
 * @param {Function} props.onCancel
 * @param {string}   [props.title]
 * @param {string}   [props.message]
 */
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Confirm Delete',
  message = 'This action cannot be undone. Are you sure?',
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white dark:bg-d-card rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 dark:border-white/[0.08] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-ink dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-ink-light dark:text-white/60 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-bold text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
