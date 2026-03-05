import { motion } from 'framer-motion';

export default function ToggleOption({ label, desc, value, onChange }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }}
      className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all shadow-sm
        ${value ? 'bg-brand/10 dark:bg-brand/20 border-brand/50 ring-1 ring-brand/30' : 'bg-white/80 dark:bg-d-card/80 backdrop-blur-md border border-ink/[0.04] dark:border-white/[0.04] hover:bg-brand/[0.03] dark:hover:bg-brand/[0.06] hover:border-brand/20'}`}
      onClick={() => onChange(!value)}>
      <div>
        <div className="font-bold text-ink dark:text-white">{label}</div>
        <div className="text-sm text-ink/40 dark:text-white/40 mt-0.5">{desc}</div>
      </div>
      <div className={`w-12 h-7 rounded-full flex items-center transition-all p-1 cursor-pointer shrink-0 ml-4
        ${value ? 'bg-brand shadow-md shadow-brand/25' : 'bg-ink/10 dark:bg-white/10'}`}>
        <motion.div layout className={`w-5 h-5 rounded-full bg-white shadow-md ${value ? 'ml-auto' : ''}`} />
      </div>
    </motion.div>
  );
}
