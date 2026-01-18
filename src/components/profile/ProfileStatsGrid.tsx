import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export function ProfileStatsGrid() {
  const runs = useAppStore((s) => s.runs);

  const stats = useMemo(() => {
    const totalDistance = runs.reduce((sum, r) => sum + r.distanceKm, 0);
    // Calculate weekly average (mock logic for now, or simple division)
    // For simplicity, let's assume "weekly" is total / 4 for this demo if not enough data
    const weeklyAvg = totalDistance > 0 ? (totalDistance / 4) : 0;

    return {
      totalDistance: totalDistance.toFixed(1),
      weeklyAvg: weeklyAvg.toFixed(1),
    };
  }, [runs]);

  return (
    <div className="relative z-10 px-6 grid grid-cols-2 gap-4">
      <div className="glass-panel-deep p-5 rounded-3xl flex flex-col">
        <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase mb-1">Total Distance</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black italic text-white">{stats.totalDistance}</span>
          <span className="text-[10px] text-primary font-bold">KM</span>
        </div>
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[75%]"></div>
        </div>
      </div>
      <div className="glass-panel-deep p-5 rounded-3xl flex flex-col">
        <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase mb-1">Weekly Avg</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black italic text-white">{stats.weeklyAvg}</span>
          <span className="text-[10px] text-primary font-bold">KM</span>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[10px] text-green-400">
          <Icon name="trending_up" className="text-[14px]" />
          <span>12% Increase</span>
        </div>
      </div>
    </div>
  );
}