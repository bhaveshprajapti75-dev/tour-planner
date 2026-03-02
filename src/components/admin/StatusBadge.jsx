/**
 * Reusable badge components.
 */

/**
 * Active / Inactive status badge.
 */
export function StatusBadge({ active }) {
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-full ${
        active
          ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

/**
 * Generic colored badge. Configure via `variant`.
 */
const VARIANT_STYLES = {
  brand:  'bg-brand/5 text-brand',
  blue:   'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green:  'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
  red:    'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
  amber:  'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  gray:   'bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400',
  orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

export function Badge({ children, variant = 'brand', className = '' }) {
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 ${VARIANT_STYLES[variant] || VARIANT_STYLES.brand} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Role badge with appropriate colors.
 */
const ROLE_VARIANTS = {
  superadmin: { label: 'Super Admin', variant: 'purple' },
  admin:      { label: 'Admin',       variant: 'blue' },
  agent:      { label: 'Agent',       variant: 'amber' },
  basic_user: { label: 'User',        variant: 'gray' },
};

export function RoleBadge({ role }) {
  const cfg = ROLE_VARIANTS[role] || ROLE_VARIANTS.basic_user;
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
