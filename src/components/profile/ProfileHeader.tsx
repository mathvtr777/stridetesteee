import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';

export function ProfileHeader() {
  const profile = useAppStore((s) => s.profile);

  // Mock data for enhanced profile view
  const avatarUrl = profile.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBbHDQGB__C_17bO-hn5E0CA3nHX456EidL3NspK3ZNXHqhzyajUXUevCyooq0l2_RO4wGq65KZwAx0ujDLGs4AMzYUrO1ljQRGlcFCoTVniLThVpIXnx-kFFgqeiydoIzDMAIXnEaL6VXBzT6w69Wz3WNlSbFQhZxN2sGTuck29s48hT44HI77ZXRqn5c_rCx_NVJXtWl_qXZFZlYEez7myD6IzEYxwmw5nDV4GzHUzNlpDfdsxDa6ZPRa3aJVdT0LtrxgpuuqR0c";

  return (
    <div className="relative z-10 flex flex-col items-center pt-4 pb-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-full neon-ring p-1 bg-black overflow-hidden">
          <Avatar
            src={avatarUrl}
            alt={profile.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-primary p-1.5 rounded-full border-2 border-black shadow-lg">
          <Icon name="edit" className="text-[14px] text-white" />
        </div>
      </div>
      <h1 className="mt-6 text-3xl font-black text-slant-premium text-white">{profile.name}</h1>
      <p className="text-primary text-[11px] font-bold tracking-[0.2em] mt-1">ELITE RUNNER • LEVEL 42</p>
    </div>
  );
}