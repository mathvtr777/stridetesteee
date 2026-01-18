import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';
import { Link } from 'react-router-dom';

// Mock data based on the desired look
const recentAchievements = [
  {
    id: 'fast-5k',
    name: 'Fastest 5K Milestone',
    description: 'Smashed your previous record by 12s',
    icon: 'speed',
    color: 'bg-primary/20 border-primary/30',
    iconColor: 'text-primary',
  },
  {
    id: '7-day-streak',
    name: '7-Day Streak',
    description: 'Consistency is key. Level up!',
    icon: 'local_fire_department',
    color: 'bg-warning/10 border-warning/20', // Using warning color for fire/gold accent
    iconColor: 'text-warning',
  },
  {
    id: 'summit-conqueror',
    name: 'Summit Conqueror',
    description: 'Total elevation gain of 500m today',
    icon: 'terrain',
    color: 'bg-primary/20 border-primary/30',
    iconColor: 'text-primary',
  },
];

export function RecentAchievementsList() {
  return (
    <section className="px-6 pt-6 pb-12">
      <h3 className="text-white text-lg font-bold tracking-tight mb-4">Recent Achievements</h3>
      
      <div className="flex flex-col gap-3">
        {recentAchievements.map((item) => (
          <GlassCard key={item.id} className="flex items-center p-4 rounded-2xl gap-4 card-hover">
            <div className={`size-14 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.color}`}>
              <Icon name={item.icon} className={`${item.iconColor} text-[28px]`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold tracking-tight">{item.name}</p>
              <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
            </div>
            <Link to={`/achievements/${item.id}`} className="text-white/20">
              <Icon name="chevron_right" />
            </Link>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}