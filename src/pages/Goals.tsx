import { AppLayout } from '@/components/layout/AppLayout';
import { Icon } from '@/components/ui/Icon';
import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

export default function Goals() {
    const runs = useAppStore((s) => s.runs);
    const goals = useAppStore((s) => s.goals);

    // Mock data calculations for the demo (to be replaced with real logic)
    const stats = useMemo(() => {
        const currentMonthDistance = runs.reduce((acc, run) => acc + run.distanceKm, 0); // Simplified total
        const targetDistance = 150; // Mock target
        const progressPercentage = Math.min((currentMonthDistance / targetDistance) * 100, 100);

        return {
            monthlyProgress: Math.round(progressPercentage),
            activeDistance: currentMonthDistance.toFixed(1),
            remainingDays: 12 // Mock
        };
    }, [runs]);

    return (
        <AppLayout hideTopNav={true}>
            <div className="min-h-screen bg-background text-white pb-24 relative overflow-hidden">

                {/* Custom Nav for Goals */}
                <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background-dark/80 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <Icon name="analytics" className="text-primary" />
                        <span className="font-bold tracking-tight text-lg">Central de Metas</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <Icon name="notifications" />
                        </button>
                        <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <Icon name="settings" />
                        </button>
                    </div>
                </nav>

                <main className="px-6">
                    {/* Hero Section: 3D Visualization */}
                    <div className="relative flex flex-col items-center justify-center py-12 overflow-visible">
                        {/* Atmospheric Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

                        {/* Central 3D Sphere Vessel - Reduced size for mobile */}
                        <div className="relative w-56 h-56 mb-8 transform scale-90 sm:scale-100">
                            {/* Glass Outer Sphere */}
                            <div className="absolute inset-0 rounded-full border border-white/20 sphere-glow bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[2px] z-10 overflow-hidden">
                                {/* Liquid Fill */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 liquid-fill opacity-80 flex items-start justify-center pt-4 transition-all duration-1000 ease-in-out"
                                    style={{ height: `${stats.monthlyProgress}%` }}
                                >
                                    <div className="w-full h-4 bg-white/30 blur-sm -mt-2"></div>
                                </div>
                            </div>

                            {/* Refraction Detail */}
                            <div className="absolute top-4 left-10 w-12 h-6 bg-white/20 rounded-full blur-md z-20 -rotate-45"></div>

                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-1">Progresso Mensal</span>
                                <h1 className="text-5xl font-bold tracking-tighter">{stats.monthlyProgress}%</h1>
                            </div>

                            {/* Orbital Chrome Bars - Adjusted positions */}
                            <div className="absolute -left-8 bottom-0 flex items-end gap-2 h-32">
                                <div className="w-2.5 h-20 rounded-full chrome-bar animate-pulse"></div>
                                <div className="w-2.5 h-28 rounded-full chrome-bar"></div>
                                <div className="w-2.5 h-24 rounded-full chrome-bar"></div>
                            </div>
                            <div className="absolute -right-8 bottom-0 flex items-end gap-2 h-32">
                                <div className="w-2.5 h-16 rounded-full chrome-bar"></div>
                                <div className="w-2.5 h-32 rounded-full chrome-bar"></div>
                                <div className="w-2.5 h-20 rounded-full chrome-bar animate-pulse"></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-primary font-medium tracking-wide">Meta de Corrida Mensal</p>
                            <p className="text-white/40 text-sm mt-1">{stats.remainingDays} dias restantes para atingir 150km</p>
                        </div>
                    </div>

                    {/* Weekly Performance Chart */}
                    <div className="glass-card rounded-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Desempenho Semanal</h3>
                                <p className="text-white/40 text-sm">Distância ativa rastreada</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{stats.activeDistance}km</p>
                                <p className="text-[#0bda73] text-sm flex items-center justify-end">
                                    <Icon name="trending_up" className="text-sm mr-1" />+15%
                                </p>
                            </div>
                        </div>

                        {/* Chart Bars */}
                        <div className="grid grid-cols-7 gap-3 items-end h-32 px-2">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => {
                                // Mock heights for demo
                                const heights = ['70%', '40%', '85%', '20%', '55%', '95%', '15%'];
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-full bg-white/5 rounded-t-lg relative group h-20">
                                            <div
                                                className="absolute bottom-0 w-full bg-primary rounded-t-lg shadow-[0_-4px_10px_rgba(140,48,232,0.4)] transition-all duration-1000"
                                                style={{ height: heights[i] }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-white/40 font-bold uppercase">{day}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Active Goals Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight">Metas Ativas</h2>
                            <button className="text-primary text-sm font-semibold">Ver Todas</button>
                        </div>

                        {/* Goal Card 1 */}
                        <div className="glass-card rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="28" cy="28" fill="transparent" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                                    <circle className="drop-shadow-[0_0_5px_#8c30e8]" cx="28" cy="28" fill="transparent" r="24" stroke="#8c30e8" strokeDasharray="150" strokeDashoffset="40" strokeWidth="4"></circle>
                                </svg>
                                <div className="absolute text-primary">
                                    <Icon name="route" className="text-xl" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base">Prep. Meia Maratona</h4>
                                <p className="text-white/40 text-xs">15.2 / 21.1 km completados</p>
                            </div>
                            <div className="text-right">
                                <Icon name="chevron_right" className="text-white/20 group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        {/* Goal Card 2 */}
                        <div className="glass-card rounded-xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="28" cy="28" fill="transparent" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                                    <circle className="drop-shadow-[0_0_5px_#8c30e8]" cx="28" cy="28" fill="transparent" r="24" stroke="#8c30e8" strokeDasharray="150" strokeDashoffset="110" strokeWidth="4"></circle>
                                </svg>
                                <div className="absolute text-primary">
                                    <Icon name="landscape" className="text-xl" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base">Rei da Elevação</h4>
                                <p className="text-white/40 text-xs">450 / 600 m ganho vertical</p>
                            </div>
                            <div className="text-right">
                                <Icon name="chevron_right" className="text-white/20 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-10 mb-6">
                        <button className="w-full py-4 rounded-xl bg-primary text-white font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(140,48,232,0.4)] border border-white/10 overflow-hidden relative active:scale-95 transition-transform">
                            <Icon name="add_circle" />
                            Nova Meta
                            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>

                </main>
            </div>
        </AppLayout>
    );
}
