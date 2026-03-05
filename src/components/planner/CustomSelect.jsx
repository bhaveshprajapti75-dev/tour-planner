import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl hover:bg-ink/5 dark:hover:bg-white/5 cursor-pointer flex items-center gap-1 transition-colors font-bold text-ink dark:text-white"
      >
        {selectedLabel}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{ scrollbarWidth: 'none' }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-28 max-h-48 overflow-y-auto bg-white/95 dark:bg-d-surface/95 backdrop-blur-3xl border border-ink/[0.08] dark:border-white/[0.08] rounded-2xl shadow-xl z-50 p-1"
            >
              {options.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-3 py-2 text-sm font-bold rounded-xl cursor-pointer transition-colors ${value === opt.value ? 'bg-brand text-white shadow-md' : 'hover:bg-ink/5 dark:hover:bg-white/5 text-ink/80 dark:text-white/80'}`}
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
