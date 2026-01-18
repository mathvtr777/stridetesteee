import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export function ProfileHeader() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  // Fetch real user data on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.full_name) {
        setProfile({
          ...profile,
          name: user.user_metadata.full_name,
          // Use avatar if we had one, otherwise keep default or empty
        });
      }
    });
  }, []);

  // Default avatar if none
  const avatarUrl = profile.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
      <h1 className="mt-6 text-3xl font-black text-slant-premium text-white">{profile.name || 'Convidado'}</h1>
      <p className="text-primary text-[11px] font-bold tracking-[0.2em] mt-1">NOVO CORREDOR • NÍVEL 1</p>
    </div>
  );
}