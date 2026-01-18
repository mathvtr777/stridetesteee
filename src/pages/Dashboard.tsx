import { AppLayout } from '@/components/layout/AppLayout';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';
import { StartRunButton } from '@/components/dashboard/StartRunButton';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

export default function Dashboard() {
  return (
    <AppLayout>
      <WeeklyStats />
      <StartRunButton />
      <RecentActivities />
    </AppLayout>
  );
}
