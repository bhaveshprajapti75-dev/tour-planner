import { motion } from 'framer-motion';

export default function StepHeader({ icon: Icon, title, desc }) {
  return (
    <div className="mb-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/15 flex items-center justify-center text-brand">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-ink dark:text-white">{title}</h2>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="text-ink/45 dark:text-white/50 font-medium ml-15 text-sm">{desc}</motion.p>
    </div>
  );
}
