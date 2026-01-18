import { Icon } from '@/components/ui/Icon';
import { useNavigate } from 'react-router-dom';

export function ProfileTopNav() {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-50 flex items-center bg-background/80 px-6 py-4 justify-between safe-top backdrop-blur-md">
      {/* Settings Button */}
      <button 
        className="text-white flex size-10 items-center justify-center rounded-full glass hover:bg-white/5 transition-colors"
        onClick={() => navigate('/settings')} // Assuming a settings route exists or will be created
      >
        <Icon name="settings" className="text-[24px]" />
      </button>
      
      <h2 className="text-white text-sm font-bold uppercase tracking-[0.2em] flex-1 text-center">
        Elite Profile
      </h2>
      
      {/* Share Button */}
      <button className="flex size-10 cursor-pointer items-center justify-center rounded-full glass hover:bg-white/5 transition-colors">
        <Icon name="ios_share" className="text-[22px]" />
      </button>
    </div>
  );
}