import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  hideTopNav?: boolean;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideTopNav = false, hideBottomNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-display safe-x" style={{ paddingTop: 'var(--sat)', paddingBottom: 'var(--sab)' }}>
      {!hideTopNav && <TopNav />}
      {/* Increased padding-bottom to pb-40 (10rem) to ensure content clears the BottomNav on all mobile screens. */}
      <main className="flex flex-col gap-6 pb-40 pt-4">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}