import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Avatar } from '@/components/ui/Avatar';
import { Run } from '@/lib/db';
import { useNavigate } from 'react-router-dom';

interface ActivityCardProps {
  run: Run;
}

export function ActivityCard({ run }: ActivityCardProps) {
  const navigate = useNavigate();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const runTypeVariant = run.type || 'tempo';

  // Generate a mock map URL or use placeholder
  const mapImage = run.type === 'trail' 
    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUUSYfid6x2g-8qje3a2hYSqorp3Iq8PWxgW74jScFZBJIzDczdLh_2eYcucYvL-vbesDBiY7WVd0hAQy0Arx9mH-aSVpB-rEyozxJe5E-sjhXPvpamVM6aoxKdpt5gn89ksOQwAFlhw8h6v5AKO9GfIbP3ZO6yzKljBSXC4H8TvsrZavFzdGuBkZMLSpTkzKaGerLXsa3tDUGmFgjAlokvkMeil_okjR43VmBppcSihV81Eza6Lmd-WxzlRy_OyebjkzeyWkvu00'
    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB44HG8K_khjYWPlN9yiU_So0eEtWSiRlYpQUGWjhEImggoK4jKCG_X0yJXpO1_Wt7ou2kA2PGFhI0rUeNnraanfpb9dWIzARYWPjj87Al3KuKpUxiEGohOrJ-oDPhmkG0emI_Cv38ehMLJn5wtDTFb4IKCm2n8aCaUjpoiz9xep5KFIH1e2K3ccLtcJbpyJulKgKXI1OU--Clvs-vd6EiExiZbL_YlrkElreortOrL0DMgc63xXr9_WT5TMAcfsqhyX2ahmLZpUg';

  return (
    <GlassCard 
      hover 
      className="group flex flex-col overflow-hidden"
      onClick={() => navigate(`/history/${run.id}`)}
    >
      {/* Map preview */}
      <div className="relative h-44 w-full bg-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url('${mapImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <Badge variant={runTypeVariant as 'tempo' | 'trail'}>
            {run.type || 'Tempo'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold leading-tight">
              {run.notes || 'Morning Run'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(run.startedAt)} • {run.location || 'Local area'}
            </p>
          </div>
          <div className="flex -space-x-2">
            <Avatar
              size="sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHWmgt8GDrTrEoUmfF4bVA4ZdgpQz1z6NWtgpeuldLohLq_AwY-ttZGjLyjRs0ocG-0w6HOrA8pHmLxxgH8QXjAyvReVN32cSy_t_TiP_U4RWG2bZm0GnrFLvedGhrNwJBU38g4tWeb_eX_JIp6oTdj9FQNYbCeMF4a0vrzqWW4tzu-8Ch-pBF4yrmnxB32kZ-0oOsqzKALlgLC9NVHDzGm8dim5ZLn86uEN40rsURAog3ShItewD2q_jpLQVh8cjKbdvYZCiLp_s"
              alt="Friend 1"
            />
            <Avatar
              size="sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA49JnVNEYrlbOBLLnMEgX_jXD8Qm-DXQyHNzfqW0wXPLFrd22SeaxR5XDuZC3bc64O1SrDVULdsP-P5wW48X4NfXODeK_eoUlkwY3ERb05X_uNTnAunFvccWpzbGdF8Enwy2Ct-AwP5JwB2aha_TT1TPE2pob_zCnAOMOPMCIzj167P1rUMXXNMlQz7DzGWcb4tHLCS2V6FAqQ0O3mIrG34NIk55mYgqALk2kukPWcMcyblXEAUWqz41qztGm1P8mvs2iyJOD-Kv0"
              alt="Friend 2"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Distance</p>
            <p className="font-bold text-sm">
              {run.distanceKm.toFixed(2)} <span className="text-[10px] text-muted-foreground">km</span>
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Avg Pace</p>
            <p className="font-bold text-sm">
              {run.avgPace} <span className="text-[10px] text-muted-foreground">/km</span>
            </p>
          </div>
          <button 
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-4 py-2 hover:bg-primary/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="thumb_up" className="text-primary text-lg" />
            <span className="text-xs font-bold">12</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
