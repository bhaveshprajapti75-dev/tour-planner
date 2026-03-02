/**
 * iOS-style toggle switch — replaces checkboxes for boolean fields.
 *
 * Usage in forms:
 *   <ToggleSwitch label="Active" checked={form.is_active} onChange={val => setForm(f => ({ ...f, is_active: val }))} />
 *
 * Usage in tables (compact, no label):
 *   <ToggleSwitch checked={row.is_active} size="sm" disabled />
 */
export default function ToggleSwitch({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',     // 'sm' | 'md'
  className = '',
}) {
  const handleClick = () => {
    if (!disabled && onChange) onChange(!checked);
  };

  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-3.5 h-3.5', translate: 'translate-x-4', offset: 'translate-x-0.5' },
    md: { track: 'w-11 h-6', thumb: 'w-4.5 h-4.5', translate: 'translate-x-5', offset: 'translate-x-0.5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        className={`
          relative inline-flex shrink-0 ${s.track} items-center rounded-full
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand/30
          ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'}
          ${checked
            ? 'bg-brand'
            : 'bg-gray-200 dark:bg-white/[0.12]'
          }
        `}
      >
        <span
          className={`
            inline-block ${s.thumb} rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out
            ${checked ? s.translate : s.offset}
          `}
        />
      </button>
      {(label || description) && (
        <div
          className={`select-none ${disabled ? '' : 'cursor-pointer'}`}
          onClick={handleClick}
        >
          {label && (
            <span className="text-sm font-bold text-ink dark:text-white">{label}</span>
          )}
          {description && (
            <p className="text-xs text-ink-light dark:text-white/50 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Table-cell status toggle — compact switch for Active/Inactive.
 * No text label — on/off state is self-explanatory.
 */
export function StatusToggle({ active, onChange, disabled = false }) {
  return <ToggleSwitch checked={active} onChange={onChange} size="sm" disabled={disabled} />;
}
