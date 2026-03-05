import { Minus, Plus } from 'lucide-react';

export default function Counter({ label, value, onChange, min = 0, max = 20, inline }) {
  return (
    <div className={`flex items-center ${inline ? 'gap-3' : 'gap-2 flex-col'}`}>
      {label && <span className="text-xs font-bold text-ink/45">{label}</span>}
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }}
          className="w-8 h-8 rounded-lg bg-ink/[0.04] dark:bg-white/[0.06] border border-ink/[0.08] dark:border-white/[0.08] flex items-center justify-center text-ink/50 dark:text-white/50 hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white cursor-pointer transition-all">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-bold text-ink dark:text-white">{value}</span>
        <button onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
          className="w-8 h-8 rounded-lg bg-ink/[0.04] dark:bg-white/[0.06] border border-ink/[0.08] dark:border-white/[0.08] flex items-center justify-center text-ink/50 dark:text-white/50 hover:bg-ink/[0.08] dark:hover:bg-white/[0.1] hover:text-ink dark:hover:text-white cursor-pointer transition-all">
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
