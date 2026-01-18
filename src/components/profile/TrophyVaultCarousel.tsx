import { Icon } from '@/components/ui/Icon';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

export function TrophyVaultCarousel() {
  const achievements = useAppStore(s => s.achievements);
  // Only show unlocked trophies
  const unlocked = achievements.filter(a => a.unlockedAt);

  return (
    <div className="relative z-10 mt-8 px-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slant-premium text-white">Troféus</h2>
        <Link to="/achievements" className="text-primary text-[10px] font-bold tracking-widest uppercase">Ver Todos</Link>
      </div>

      {unlocked.length === 0 ? (
        <div className="glass-panel-deep rounded-3xl p-8 text-center border border-white/5">
          <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="emoji_events" className="text-white/20 text-3xl" />
          </div>
          <p className="text-white/40 text-sm font-medium">Nenhum troféu conquistado ainda.</p>
          <p className="text-white/20 text-xs mt-1">Corra para desbloquear!</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
          {unlocked.map((trophy) => (
            <div key={trophy.id} className="flex-shrink-0 w-36 h-48 glass-panel-deep rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
              <div className={`medal-3d-gold w-20 h-20 rounded-full mb-4 flex items-center justify-center floating-shadow`}>
                <Icon name={trophy.icon} className={`text-4xl text-black/80 font-bold`} />
              </div>
              <span className="text-[10px] font-black text-white/80 tracking-tighter text-center uppercase leading-tight italic" dangerouslySetInnerHTML={{ __html: trophy.name.replace(/ /g, '<br/>') }}></span>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-[8px] font-black text-white/20">NEW</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}