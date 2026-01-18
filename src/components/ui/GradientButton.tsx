import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, loading = false, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn-gradient flex w-full items-center justify-between rounded-2xl p-6 transition-all active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
