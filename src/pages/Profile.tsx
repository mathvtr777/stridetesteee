import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { TrophyVaultCarousel } from '@/components/profile/TrophyVaultCarousel';
import { ProfileStatsGrid } from '@/components/profile/ProfileStatsGrid';
import { Icon } from '@/components/ui/Icon';

export default function Profile() {
  return (
    <AppLayout hideTopNav={true}>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Elements */}
        <div className="fixed top-[10%] -left-20 w-64 h-64 bg-primary bg-3d-shape rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[20%] -right-20 w-80 h-80 bg-purple-900 bg-3d-shape rotate-45 pointer-events-none"></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8c30e8 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        {/* Custom Header */}
        <header className="relative z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
          <Icon name="menu" className="text-white/60" />
          <div className="text-[10px] tracking-[0.4em] font-black text-white/40 uppercase">Profile Settings</div>
          <Icon name="settings" className="text-white/60" />
        </header>

        <ProfileHeader />

        <ProfileStatsGrid />

        <TrophyVaultCarousel />

        {/* Spacer for bottom nav */}
        <div className="h-32"></div>
      </div>
    </AppLayout>
  );
}