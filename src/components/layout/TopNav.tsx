import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/ui/Avatar';
import { useAppStore } from '@/store/useAppStore';

export function TopNav() {
  const profile = useAppStore((s) => s.profile);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass safe-top">
      <div className="flex items-center gap-3">
        <Avatar
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBh7033BKZF6WRbw8UIM8SiJBeZ2t4N0XNtv8TipGQ0J2NBetyNy4M9NB2hpJnYvsTeMfYiJZQuD8lJvVLdgp8CaINSitFVlUH1Qo_Ux_Nuc49nmFccyJvcR4UzfxeZrDCIkwpybqJ6FJJKuLB9xiq-j4d1j9HjQ3RdFxkBzvRfzVBiGiouAMJvV-YKor-Ofx0gwvStt_Gfr5KA3a6vVi82px4X5FdYyqagqjUaj2uTZUhPJbSdE7uZN92_zk0osc-SmzK2184jHQ"
          alt={profile.name}
          showStatus
        />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Welcome back</p>
          <h1 className="text-sm font-bold tracking-tight">{profile.name}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex size-10 items-center justify-center rounded-xl glass hover:bg-white/5 transition-colors">
          <Icon name="search" className="text-muted-foreground" />
        </button>
        <button className="flex size-10 items-center justify-center rounded-xl glass hover:bg-white/5 transition-colors">
          <Icon name="notifications" className="text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
}
