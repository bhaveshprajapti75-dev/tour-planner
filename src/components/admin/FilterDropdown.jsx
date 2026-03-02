import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

/**
 * Custom dropdown select — replaces native <select> for a polished look.
 *
 * @param {string}   value         - currently selected value
 * @param {Function} onChange      - (value) => void
 * @param {Array}    options       - [{ value, label }]
 * @param {string}   [placeholder] - text when nothing selected
 * @param {string}   [label]       - optional field label above
 * @param {boolean}  [required]
 * @param {boolean}  [searchable]  - enable type-ahead search within options
 * @param {string}   [className]
 */
export default function FilterDropdown({
  value = '',
  onChange,
  options = [],
  placeholder = 'Select...',
  label,
  required = false,
  searchable = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Focus search input when opened
  useEffect(() => {
    if (open && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, searchable]);

  const selected = options.find(o => String(o.value) === String(value));

  const filtered = searchable && query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (val) => {
    onChange?.(val);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.('');
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-2 px-4 py-2.5
          bg-white dark:bg-d-card border rounded-xl text-sm font-medium
          transition-all cursor-pointer text-left
          ${open
            ? 'border-brand ring-2 ring-brand/10'
            : 'border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15]'
          }
        `}
      >
        <span className={selected ? 'text-ink dark:text-white' : 'text-gray-400 dark:text-white/40'}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && !required && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-white/[0.08]">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm text-ink dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 dark:text-white/40 text-center">
                No options found
              </div>
            ) : (
              filtered.map(opt => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5 text-sm text-left
                      transition-colors cursor-pointer
                      ${isSelected
                        ? 'bg-brand/5 text-brand font-bold'
                        : 'text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface font-medium'
                      }
                    `}
                  >
                    {opt.label}
                    {isSelected && <Check className="w-4 h-4 text-brand" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
