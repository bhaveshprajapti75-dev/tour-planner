import { X, MapPin, Clock, Star, Mail, Phone, Globe, Image } from 'lucide-react';

/**
 * Reusable read-only detail / view modal.
 * Renders a list of labeled fields in a clean layout.
 *
 * @param {boolean}  open
 * @param {Function} onClose
 * @param {string}   title
 * @param {Array}    fields  - [{ label, value, type?, colSpan?, icon? }]
 *   type: 'text' (default) | 'badge' | 'status' | 'image' | 'link' | 'stars' | 'coords'
 *   colSpan: 1 | 2  (how many columns it should span)
 * @param {string}   [maxWidth]
 */
export default function ViewModal({ open, onClose, title, fields = [], maxWidth = 'max-w-lg' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white dark:bg-d-card rounded-3xl shadow-2xl w-full ${maxWidth} border border-gray-100 dark:border-white/[0.08] max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/[0.08]">
          <h3 className="text-lg font-bold text-ink dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-canvas dark:hover:bg-d-surface rounded-xl cursor-pointer text-ink-light dark:text-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — 2-column grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {fields.map((f, i) => {
              if (!f) return null;
              const span = f.colSpan === 2 ? 'col-span-2' : '';
              return (
                <div key={i} className={span}>
                  <dt className="text-xs font-bold text-ink-light dark:text-white/40 uppercase tracking-wider mb-1">
                    {f.label}
                  </dt>
                  <dd>{renderValue(f)}</dd>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderValue(field) {
  const { value, type = 'text' } = field;

  if (value === null || value === undefined || value === '') {
    return <span className="text-sm text-gray-300 dark:text-white/20">—</span>;
  }

  switch (type) {
    case 'badge':
      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold
          ${field.variant === 'green' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
          : field.variant === 'red' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          : field.variant === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
          : field.variant === 'orange' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
          : 'bg-brand/10 text-brand'}`}>
          {value}
        </span>
      );

    case 'status':
      return (
        <span className={`inline-flex items-center gap-1.5 text-sm font-bold
          ${value ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-white/30'}`}>
          <span className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/20'}`} />
          {value ? 'Active' : 'Inactive'}
        </span>
      );

    case 'stars': {
      const n = parseInt(value) || 0;
      return (
        <span className="text-amber-500 text-base tracking-wider">
          {'★'.repeat(n)}{'☆'.repeat(Math.max(0, 5 - n))}
        </span>
      );
    }

    case 'coords':
      if (!value.lat && !value.lng) return <span className="text-sm text-gray-300 dark:text-white/20">—</span>;
      return (
        <div className="flex items-center gap-2 text-sm text-ink dark:text-white font-mono">
          <MapPin className="w-3.5 h-3.5 text-brand" />
          {value.lat}, {value.lng}
        </div>
      );

    case 'image':
      return (
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-canvas dark:bg-d-surface border border-gray-100 dark:border-white/[0.08]">
            <img src={value} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <span className="text-xs text-ink-light dark:text-white/40 truncate max-w-[200px]">{value}</span>
        </div>
      );

    case 'gallery':
      if (!Array.isArray(value) || !value.length) {
        return <span className="text-sm text-gray-300 dark:text-white/20">No images</span>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((img, i) => (
            <div key={img.id || i} className="w-20 h-16 rounded-lg overflow-hidden bg-canvas dark:bg-d-surface border border-gray-100 dark:border-white/[0.08]">
              <img src={img.image || img} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
            </div>
          ))}
        </div>
      );

    case 'link':
      return (
        <a href={value} target="_blank" rel="noopener noreferrer"
          className="text-sm text-brand hover:underline truncate block max-w-full">
          {value}
        </a>
      );

    case 'multiline':
      return (
        <p className="text-sm text-ink dark:text-white/80 whitespace-pre-wrap leading-relaxed">{value}</p>
      );

    default:
      return <span className="text-sm text-ink dark:text-white font-medium">{value}</span>;
  }
}
