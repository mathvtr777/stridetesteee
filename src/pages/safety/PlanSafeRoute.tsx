import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanSafeRoute() {
    const navigate = useNavigate();
    const [distance, setDistance] = useState(5.0);
    const [avoidRedZones, setAvoidRedZones] = useState(true);
    const [avoidDarkStreets, setAvoidDarkStreets] = useState(false);
    const [preferBusyStreets, setPreferBusyStreets] = useState(true);
    const [selectedRoute, setSelectedRoute] = useState<number | null>(0);

    // Mock routes calculated based on filters
    const mockRoutes = [
        { id: 0, name: "Caminho Guardião", safeScore: 98, risk: "BAIXO", dist: "8.2km", time: "48m", color: "text-emerald-500", desc: "Iluminado • Movimentado" },
        { id: 1, name: "Rota Direta", safeScore: 82, risk: "MÉDIO", dist: "7.4km", time: "41m", color: "text-amber-500", desc: "Curta • Misto" },
        { id: 2, name: "Volta Panorâmica", safeScore: 75, risk: "MÉDIO", dist: "9.1km", time: "55m", color: "text-amber-500", desc: "Parques • Silencioso" },
    ];

    return (
        <div className="relative mx-auto flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center size-10 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors">
                    <Icon name="arrow_back_ios_new" />
                </button>
                <h1 className="text-xl font-bold tracking-tight">Planejar Rota Segura</h1>
                <button className="flex items-center justify-center size-10 rounded-full bg-white/5 text-white">
                    <Icon name="settings_input_component" />
                </button>
            </header>

            <main className="pb-32 overflow-y-auto no-scrollbar">
                {/* Goal Selection */}
                <section className="mt-6 px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Seleção de Meta</h3>
                        <span className="text-xs font-medium uppercase tracking-widest text-primary">Circuito ou Ponto</span>
                    </div>

                    {/* Distance Slider Card */}
                    <div className="bg-secondary/20 rounded-xl p-5 mb-4 border border-white/5 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                    <Icon name="route" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-400">Distância Alvo</p>
                                    <p className="text-2xl font-bold text-white">{distance.toFixed(1)} <span className="text-sm font-normal text-slate-500">km</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded text-slate-400 uppercase tracking-tighter">Est. {Math.round(distance * 6)}-{Math.round(distance * 7)} min</span>
                            </div>
                        </div>
                        <div className="relative px-2 py-2">
                            <input
                                type="range"
                                min="2"
                                max="15"
                                step="0.5"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase">
                                <span>2 km</span>
                                <span>15 km</span>
                            </div>
                        </div>
                    </div>

                    {/* Destination Search */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <Icon name="search" />
                        </div>
                        <input className="w-full h-14 bg-secondary/10 border border-white/5 rounded-xl pl-12 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium" placeholder="Buscar destino específico..." type="text" />
                    </div>
                </section>

                {/* Safety Preferences */}
                <section className="mt-8 px-4">
                    <h3 className="text-lg font-bold mb-4">Filtros de Segurança</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {/* Toggle 1 */}
                        <div className="flex items-center justify-between p-4 bg-secondary/10 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                                    <Icon name="block" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Evitar Zonas de Risco</p>
                                    <p className="text-xs text-slate-500">Pular áreas com incidentes</p>
                                </div>
                            </div>
                            <button onClick={() => setAvoidRedZones(!avoidRedZones)} className={`w-12 h-6 rounded-full relative transition-colors ${avoidRedZones ? 'bg-primary' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${avoidRedZones ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>

                        {/* Toggle 2 */}
                        <div className="flex items-center justify-between p-4 bg-secondary/10 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                    <Icon name="lightbulb" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Evitar Ruas Escuras</p>
                                    <p className="text-xs text-slate-500">Priorizar boa iluminação</p>
                                </div>
                            </div>
                            <button onClick={() => setAvoidDarkStreets(!avoidDarkStreets)} className={`w-12 h-6 rounded-full relative transition-colors ${avoidDarkStreets ? 'bg-primary' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${avoidDarkStreets ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>

                        {/* Toggle 3 */}
                        <div className="flex items-center justify-between p-4 bg-secondary/10 border border-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                                    <Icon name="groups" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Preferir Ruas Movimentadas</p>
                                    <p className="text-xs text-slate-500">Maior atividade de pedestres</p>
                                </div>
                            </div>
                            <button onClick={() => setPreferBusyStreets(!preferBusyStreets)} className={`w-12 h-6 rounded-full relative transition-colors ${preferBusyStreets ? 'bg-primary' : 'bg-slate-700'}`}>
                                <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${preferBusyStreets ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Route Comparison Carousel */}
                <section className="mt-8">
                    <div className="px-4 flex items-end justify-between mb-4">
                        <h3 className="text-lg font-bold leading-none">Rotas Calculadas</h3>
                        <span className="text-xs text-slate-500">3 opções encontradas</span>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-4 pb-6 no-scrollbar snap-x snap-mandatory">
                        {mockRoutes.map((route) => (
                            <div
                                key={route.id}
                                onClick={() => setSelectedRoute(route.id)}
                                className={`flex-none w-72 bg-secondary/10 rounded-2xl overflow-hidden snap-center relative transition-all cursor-pointer ${selectedRoute === route.id ? 'border-2 border-primary opacity-100' : 'border border-white/5 opacity-70'}`}
                            >
                                <div className="h-32 bg-slate-800 relative">
                                    {/* Placeholder Map Image */}
                                    <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                                        <Icon name="map" className="text-white/20 text-4xl" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                                    {route.id === 0 && <div className="absolute top-3 left-3 bg-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider text-white">Recomendado</div>}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white">{route.name}</h4>
                                            <p className="text-xs text-slate-500">{route.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg leading-none ${route.safeScore > 90 ? 'text-primary' : 'text-slate-300'}`}>{route.safeScore}%</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Segurança</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Dist</p>
                                            <p className="text-sm font-bold text-white">{route.dist}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Tempo</p>
                                            <p className="text-sm font-bold text-white">{route.time}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Risco</p>
                                            <span className={`text-[10px] font-bold ${route.color}`}>{route.risk}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom CTA Fixed */}
            <footer className="fixed bottom-0 inset-x-0 bg-background-dark/90 backdrop-blur-md p-6 border-t border-white/10 w-full max-w-[480px] mx-auto">
                <button
                    onClick={() => navigate('/run')} // Assuming start run on this route
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-[0_8px_25px_rgba(140,48,232,0.4)] flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                >
                    <Icon name="play_circle" className="text-3xl" />
                    INICIAR NESTA ROTA
                </button>
            </footer>
        </div>
    );
}
