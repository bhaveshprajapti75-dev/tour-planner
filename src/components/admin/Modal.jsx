import { X } from 'lucide-react';

/**
 * Reusable admin modal with fixed header, scrollable body, and fixed footer.
 *
 * Pass `footer` for a pinned footer below the scroll area.
 * Pass `onSubmit` to wrap the whole modal interior in a <form> so the
 * submit button in the footer works correctly.
 */
export default function Modal({ open, onClose, title, maxWidth = 'max-w-lg', footer, onSubmit, children }) {
  if (!open) return null;

  const Wrapper = onSubmit ? 'form' : 'div';
  const wrapperProps = onSubmit ? { onSubmit, className: 'flex flex-col flex-1 min-h-0' } : { className: 'flex flex-col flex-1 min-h-0' };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white dark:bg-d-card rounded-2xl shadow-2xl w-full ${maxWidth} border border-gray-200/60 dark:border-white/[0.08] max-h-[90vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Fixed header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200/60 dark:border-white/[0.08] flex-shrink-0">
          <h3 className="text-[15px] font-semibold text-ink dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/[0.06] rounded-lg cursor-pointer text-ink-light dark:text-white/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Wrapper {...wrapperProps}>
          {/* ── Scrollable body ── */}
          <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0">{children}</div>

          {/* ── Fixed footer ── */}
          {footer && (
            <div className="px-5 py-3 border-t border-gray-200/60 dark:border-white/[0.08] flex-shrink-0">
              {footer}
            </div>
          )}
        </Wrapper>
      </div>
    </div>
  );
}

/**
 * Modal footer actions — Cancel + Submit buttons.
 * Pass as the `footer` prop to Modal for a truly fixed footer.
 */
export function ModalActions({ onCancel, saving, isEdit, submitLabel }) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-white/[0.1] text-[13px] font-medium text-ink dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2 rounded-lg bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors shadow-sm cursor-pointer disabled:opacity-60"
      >
        {saving ? 'Saving...' : submitLabel || (isEdit ? 'Update' : 'Create')}
      </button>
    </div>
  );
}
