/**
 * Reusable form field components for admin forms.
 * All follow the same visual style and accept a label, value, onChange, error, etc.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Check, Clock, AlertCircle, CalendarDays } from 'lucide-react';

const baseInputClass = (hasError) =>
  `w-full px-4 py-3 bg-canvas dark:bg-d-surface border rounded-xl text-sm font-medium text-ink dark:text-white focus:outline-none transition-all ${
    hasError
      ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
      : 'border-gray-200 dark:border-white/[0.08] focus:border-brand focus:ring-2 focus:ring-brand/10'
  }`;

const labelClass = 'block text-sm font-bold text-ink dark:text-white mb-1.5';

const errorMsgClass = 'flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500 dark:text-red-400';

const triggerClass = (open, hasError) => `
  w-full flex items-center justify-between gap-2 px-4 py-3
  bg-canvas dark:bg-d-surface border rounded-xl text-sm font-medium
  transition-all cursor-pointer text-left
  ${open
    ? 'border-brand ring-2 ring-brand/10'
    : hasError
      ? 'border-red-400 dark:border-red-500'
      : 'border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15]'
  }
`;

const panelClass =
  'absolute z-50 mt-1.5 w-full bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150';

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className={errorMsgClass}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {error}
    </p>
  );
}

/**
 * Text / number / email / password input.
 */
export function Input({ label, required, error, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input {...props} className={baseInputClass(!!error)} />
      <FieldError error={error} />
    </div>
  );
}

/**
 * Custom select dropdown — fully styled, replaces native <select>.
 *
 * @param {string}   value         - currently selected value
 * @param {Function} onChange      - (value) => void — receives the value directly
 * @param {Array}    options       - [{ value, label }]
 * @param {string}   [placeholder] - text when nothing selected
 * @param {boolean}  [searchable]  - enable type-ahead search within options
 */
export function Select({
  label, required, error, options = [], placeholder = 'Select...', searchable = false, className, value, onChange,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

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

  useEffect(() => {
    if (open && searchable && inputRef.current) inputRef.current.focus();
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

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUp(spaceBelow < 280);
    }
    setOpen(!open);
  };

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <button type="button" ref={triggerRef} onClick={handleToggle} className={triggerClass(open, !!error)}>
        <span className={selected ? 'text-ink dark:text-white' : 'text-gray-400 dark:text-white/40'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute z-50 w-full bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden animate-in fade-in duration-150 ${
          openUp ? 'bottom-full mb-1.5 slide-in-from-bottom-1' : 'mt-1.5 slide-in-from-top-1'
        }`}>
          {searchable && (
            <div className="p-2 border-b border-gray-100 dark:border-white/[0.08]">
              <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..." className="w-full px-3 py-2 bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] rounded-lg text-sm text-ink dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand" />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {/* Placeholder option */}
            {placeholder && (
              <button type="button" onClick={() => handleSelect('')}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer
                  ${!value ? 'bg-brand/5 text-brand font-bold' : 'text-gray-400 dark:text-white/40 hover:bg-canvas dark:hover:bg-d-surface font-medium'}`}>
                {placeholder}
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 dark:text-white/40 text-center">No options found</div>
            ) : (
              filtered.map(opt => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button key={opt.value} type="button" onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer
                      ${isSelected ? 'bg-brand/5 text-brand font-bold' : 'text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface font-medium'}`}>
                    {opt.label}
                    {isSelected && <Check className="w-4 h-4 text-brand" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  );
}

/**
 * Custom time picker — styled dropdown with time slots.
 *
 * @param {string}   value    - "HH:MM" format
 * @param {Function} onChange - (value: string) => void
 * @param {number}   [step]   - minutes between options (default 30)
 */
export function TimePicker({ label, required, error, value = '', onChange, step = 30, className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Scroll active option into view when opened
  useEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }, [open]);

  // Generate time slots
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += step) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const time24 = `${hh}:${mm}`;
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? 'AM' : 'PM';
      slots.push({ value: time24, label: `${hour12}:${mm} ${ampm}` });
    }
  }

  const displayLabel = slots.find(s => s.value === value)?.label || value || null;

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <button type="button" onClick={() => setOpen(!open)} className={triggerClass(open, !!error)}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className={displayLabel ? 'text-ink dark:text-white' : 'text-gray-400 dark:text-white/40'}>
            {displayLabel || 'Select time'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={panelClass}>
          <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {slots.map(slot => {
              const isSelected = slot.value === value;
              return (
                <button key={slot.value} type="button"
                  ref={isSelected ? activeRef : null}
                  onClick={() => { onChange?.(slot.value); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors cursor-pointer
                    ${isSelected ? 'bg-brand/5 text-brand font-bold' : 'text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface font-medium'}`}>
                  {slot.label}
                  {isSelected && <Check className="w-4 h-4 text-brand" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <FieldError error={error} />
    </div>
  );
}

/**
 * Textarea.
 */
export function Textarea({ label, required, error, className, ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <textarea {...props} className={`${baseInputClass(!!error)} resize-none`} />
      <FieldError error={error} />
    </div>
  );
}

/**
 * Checkbox with label.
 */
export function Checkbox({ label, id, className, ...props }) {
  const checkId = id || `chk_${label?.replace(/\s+/g, '_').toLowerCase()}`;
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <input
        type="checkbox"
        id={checkId}
        {...props}
        className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand cursor-pointer"
      />
      {label && (
        <label htmlFor={checkId} className="text-sm font-bold text-ink dark:text-white cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}

/**
 * Read-only display input (e.g. auto-computed fields).
 */
export function ReadOnlyInput({ label, value, className }) {
  return (
    <div className={className}>
      {label && <label className={labelClass}>{label}</label>}
      <input
        type="text"
        value={value}
        readOnly
        className="w-full px-4 py-3 bg-gray-100 dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-ink-light dark:text-white/50"
      />
    </div>
  );
}

// ─── DateInput (dd/mm/yyyy custom calendar picker) ────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function toDisplay(isoStr) {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-');
  return `${d}/${m}/${y}`;
}

function parseDisplay(str) {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(+y, +mo - 1, +d);
  if (date.getFullYear() === +y && date.getMonth() === +mo - 1 && date.getDate() === +d) {
    return `${y}-${mo}-${d}`;
  }
  return null;
}

/**
 * Custom date picker with dd/mm/yyyy display and a dropdown calendar.
 * @param {string}   value    - ISO date string yyyy-mm-dd (stored value)
 * @param {Function} onChange - receives synthetic-like event { target: { value: 'yyyy-mm-dd' } }
 */
export function DateInput({ label, required, error, value, onChange, className, disabled, placeholder = 'dd/mm/yyyy' }) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(toDisplay(value));
  const containerRef = useRef(null);

  // Sync displayed text when external value changes
  useEffect(() => { setInputText(toDisplay(value)); }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = value ? new Date(value + 'T00:00:00') : null;
  const initMonth = selected || new Date();
  const [viewYear, setViewYear] = useState(initMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initMonth.getMonth());

  // Reset calendar view when opening
  const handleOpen = useCallback(() => {
    if (disabled) return;
    const d = value ? new Date(value + 'T00:00:00') : new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setOpen(true);
  }, [value, disabled]);

  const emit = (iso) => {
    onChange?.({ target: { value: iso } });
  };

  const handleInputChange = (e) => {
    const txt = e.target.value;
    setInputText(txt);
    if (txt === '') { emit(''); return; }
    const iso = parseDisplay(txt);
    if (iso) emit(iso);
  };

  const handleInputBlur = () => {
    // Revert to last valid value on blur
    setInputText(toDisplay(value));
  };

  const pickDate = (day) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const iso = `${viewYear}-${mm}-${dd}`;
    emit(iso);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSelected = (day) => {
    if (!selected || !day) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  };

  const isToday = (day) => {
    if (!day) return false;
    const t = new Date();
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === day;
  };

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      {label && (
        <label className={labelClass}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleOpen}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputClass(!!error)} pr-10`}
          maxLength={10}
        />
        <button
          type="button"
          onClick={() => open ? setOpen(false) : handleOpen()}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light dark:text-white/40 hover:text-brand transition-colors cursor-pointer"
          tabIndex={-1}
        >
          <CalendarDays className="w-4.5 h-4.5" />
        </button>
      </div>
      <FieldError error={error} />

      {open && (
        <div className={panelClass} style={{ minWidth: 280 }}>
          {/* Month/Year header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-white/[0.08]">
            <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-canvas dark:hover:bg-d-surface transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4 text-ink-light dark:text-white/50" />
            </button>
            <span className="text-sm font-bold text-ink dark:text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-canvas dark:hover:bg-d-surface transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4 text-ink-light dark:text-white/50" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-2 pt-2">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-ink-light dark:text-white/40 uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-2 pb-2">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day ? (
                  <button
                    type="button"
                    onClick={() => pickDate(day)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer
                      ${isSelected(day)
                        ? 'bg-brand text-white font-bold shadow-sm'
                        : isToday(day)
                          ? 'bg-brand/10 text-brand font-bold'
                          : 'text-ink dark:text-white hover:bg-canvas dark:hover:bg-d-surface'
                      }`}
                  >
                    {day}
                  </button>
                ) : <span className="w-8 h-8" />}
              </div>
            ))}
          </div>

          {/* Today shortcut */}
          <div className="border-t border-gray-100 dark:border-white/[0.08] px-3 py-2">
            <button
              type="button"
              onClick={() => {
                const t = new Date();
                setViewYear(t.getFullYear());
                setViewMonth(t.getMonth());
                pickDate(t.getDate());
              }}
              className="text-xs font-bold text-brand hover:underline cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
