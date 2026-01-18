import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: 'grid_view', label: 'Início', filled: true },
  { path: '/explore', icon: 'explore', label: 'Explorar' },
  { path: '/safety', icon: 'shield', label: 'Segurança' },
  { path: '/goals', icon: 'analytics', label: 'Metas' },
  { path: '/training', icon: 'fitness_center', label: 'Treino' },
  { path: '/profile', icon: 'person', label: 'Perfil' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass px-8 pb-8 pt-4 safe-bottom">
      <nav className="mx-auto flex max-w-md items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon name={item.icon} filled={isActive} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* iOS home indicator */}
      <div className="mt-4 flex justify-center">
        <div className="h-1 w-32 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
