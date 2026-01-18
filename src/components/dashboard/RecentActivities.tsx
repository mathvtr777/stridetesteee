import { useAppStore } from '@/store/useAppStore';
import { ActivityCard } from './ActivityCard';
import { Link } from 'react-router-dom';
import { Run } from '@/lib/db';

// Demo data for initial display
const demoRuns: Run[] = [
  {
    id: 'demo-1',
    startedAt: Date.now() - 86400000, // Yesterday
    finishedAt: Date.now() - 86400000 + 1800000,
    durationSec: 1800,
    distanceKm: 5.02,
    avgPace: '4:45',
    points: [],
    type: 'tempo',
    notes: 'Morning Tempo Run',
    location: 'San Francisco',
  },
  {
    id: 'demo-2',
    startedAt: Date.now() - 432000000, // 5 days ago
    finishedAt: Date.now() - 432000000 + 5400000,
    durationSec: 5400,
    distanceKm: 12.4,
    avgPace: '7:15',
    points: [],
    type: 'trail',
    notes: 'Mountain Trail Pursuit',
    location: 'Marin Headlands',
  },
];

export function RecentActivities() {
  const runs = useAppStore((s) => s.runs);

  // Use demo data if no runs exist
  const displayRuns = runs.length > 0 ? runs.slice(-5).reverse() : demoRuns;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-ultra text-muted-foreground">
          Recent Activities
        </h2>
        <Link to="/history" className="text-xs text-primary font-medium">
          View All
        </Link>
      </div>

      {displayRuns.map((run) => (
        <ActivityCard key={run.id} run={run} />
      ))}
    </section>
  );
}
