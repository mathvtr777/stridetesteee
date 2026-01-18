import { Icon } from '@/components/ui/Icon';
import { Link } from 'react-router-dom';

// Simplified mock data to match the design's "Trophy Vault" look
const trophies = [
  {
    id: 1,
    name: 'Ultra Marathon Finisher',
    subtext: '2024',
    icon: 'military_tech',
    styleClass: 'medal-3d-gold',
    rotate: '',
    iconColor: 'text-black/80',
  },
  {
    id: 2,
    name: 'Top 1% Global Pace',
    subtext: 'MONTH',
    icon: 'workspace_premium',
    styleClass: 'medal-3d-purple',
    rotate: 'rotate-12',
    iconColor: 'text-white/90',
  },
  {
    id: 3,
    name: 'Streak Master 365 Days',
    subtext: 'NEW',
    icon: 'trophy',
    styleClass: 'medal-3d-gold',
    rotate: '-rotate-6',
    iconColor: 'text-black/80',
  },
];

export function TrophyVaultCarousel() {
  return (
    <div className="relative z-10 mt-8 px-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slant-premium text-white">Trophy Vault</h2>
        <Link to="/achievements" className="text-primary text-[10px] font-bold tracking-widest uppercase">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
        {trophies.map((trophy) => (
          <div key={trophy.id} className="flex-shrink-0 w-36 h-48 glass-panel-deep rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
            <div className={`${trophy.styleClass} w-20 h-20 rounded-full mb-4 flex items-center justify-center floating-shadow ${trophy.rotate}`}>
              <Icon name={trophy.icon} className={`text-4xl ${trophy.iconColor} font-bold`} />
            </div>
            <span className="text-[10px] font-black text-white/80 tracking-tighter text-center uppercase leading-tight italic" dangerouslySetInnerHTML={{ __html: trophy.name.replace(/ /g, '<br/>') }}></span>
            <div className="absolute top-0 right-0 p-2">
              <span className="text-[8px] font-black text-white/20">{trophy.subtext}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}