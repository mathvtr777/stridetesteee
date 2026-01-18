import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'trail' | 'tempo' | 'easy' | 'interval';
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary',
  trail: 'bg-trail',
  tempo: 'bg-primary',
  easy: 'bg-success',
  interval: 'bg-warning',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-lg text-white',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
