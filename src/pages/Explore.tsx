import { AppLayout } from '@/components/layout/AppLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Icon } from '@/components/ui/Icon';

export default function Explore() {
  return (
    <AppLayout>
      <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <GlassCard className="p-8 flex flex-col items-center gap-4">
          <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="explore" className="text-primary text-3xl" />
          </div>
          <h2 className="text-xl font-bold">Explore Routes</h2>
          <p className="text-muted-foreground text-center text-sm">
            Discover popular running routes near you and from the community.
          </p>
          <p className="text-xs text-muted-foreground">Coming soon</p>
        </GlassCard>
      </section>
    </AppLayout>
  );
}
