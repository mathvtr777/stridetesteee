import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  statusColor?: 'green' | 'yellow' | 'red';
  className?: string;
}

const sizeClasses = {
  sm: 'size-6',
  md: 'size-10',
  lg: 'size-14',
};

export function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  showStatus = false,
  statusColor = 'green',
  className,
}: AvatarProps) {
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn('rounded-full border-2 border-primary p-0.5', sizeClasses[size])}>
        {src ? (
          <div
            className="h-full w-full rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url('${src}')` }}
            aria-label={alt}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-xs font-bold">
              {alt?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
      </div>
      {showStatus && (
        <div
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
            statusColors[statusColor]
          )}
        />
      )}
    </div>
  );
}
