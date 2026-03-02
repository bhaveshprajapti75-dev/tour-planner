import { Edit3, Trash2 } from 'lucide-react';

/**
 * Standard Edit + Delete action buttons for table rows.
 */
export function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-ink-light dark:text-white/50 hover:text-brand hover:bg-brand/5 rounded-lg transition-all cursor-pointer"
      title="Edit"
    >
      <Edit3 className="w-4 h-4" />
    </button>
  );
}

export function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-ink-light dark:text-white/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
      title="Delete"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

/**
 * Combined Edit + Delete. Most common pattern.
 */
export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <>
      <EditButton onClick={onEdit} />
      <DeleteButton onClick={onDelete} />
    </>
  );
}

/**
 * Generic icon action button.
 */
export function IconButton({ icon: Icon, onClick, title, variant = 'brand' }) {
  const styles = {
    brand:  'hover:text-brand hover:bg-brand/5',
    green:  'hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10',
    red:    'hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10',
    blue:   'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 text-ink-light dark:text-white/50 ${styles[variant] || styles.brand} rounded-lg transition-all cursor-pointer`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
