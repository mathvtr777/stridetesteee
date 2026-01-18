import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export function WeeklyStats() {
  const { runs, goals } = useAppStore();

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekRuns = runs.filter((r) => r.startedAt >= startOfWeek.getTime());
    
    const totalDistance = weekRuns.reduce((sum, r) => sum + r.distanceKm, 0);
    const totalDuration = weekRuns.reduce((sum, r) => sum + r.durationSec, 0);
    const totalElevation = 320; // Mock for now

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    return {
      distance: totalDistance || 24.5, // Mock data for demo
      time: totalDuration ? `${hours}h ${minutes}m` : '2h 15m',
      elevation: totalElevation,
      progress: ((totalDistance || 24.5) / goals.weeklyKmTarget) * 100,
    };
  }, [runs, goals]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-ultra text-muted-foreground">
          This Week
        </h2>
        <span className="text-[10px] text-primary font-bold">Goal: {goals.weeklyKmTarget}km</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Main distance card */}
        <GlassCard className="col-span-2 flex flex-col justify-between p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 size-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="flex items-center justify-between relative z-10">
            <p className="text-sm text-muted-foreground">Total Distance</p>
            <Icon name="trending_up" className="text-primary text-sm" />
          </div>
          <div className="mt-4 flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold tracking-tighter text-glow">
              {weeklyStats.distance.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">km</span>
          </div>
          <ProgressBar 
            value={weeklyStats.progress} 
            className="mt-4 relative z-10" 
          />
        </GlassCard>

        {/* Time card */}
        <GlassCard className="flex flex-col gap-1 p-4">
          <Icon name="timer" className="text-primary/80 text-lg" />
          <p className="text-xs text-muted-foreground mt-1">Time</p>
          <p className="text-xl font-bold">{weeklyStats.time}</p>
        </GlassCard>

        {/* Elevation card */}
        <GlassCard className="flex flex-col gap-1 p-4">
          <Icon name="elevation" className="text-primary/80 text-lg" />
          <p className="text-xs text-muted-foreground mt-1">Elevation</p>
          <p className="text-xl font-bold">{weeklyStats.elevation}m</p>
        </GlassCard>
      </div>
    </section>
  );
}
