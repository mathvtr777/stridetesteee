import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showGlow?: boolean;
}

export function ProgressBar({ value, max = 100, className, showGlow = true }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('h-1.5 w-full rounded-full bg-white/5 overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn(
          'h-full rounded-full bg-primary',
          showGlow && 'progress-glow'
        )}
      />
    </div>
  );
}
