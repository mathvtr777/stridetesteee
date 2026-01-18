import { AppLayout } from '@/components/layout/AppLayout';
import { Icon } from '@/components/ui/Icon';
import { supabase, RiskReport, OccurrenceTime, RiskType } from '@/lib/supabase';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMap } from '@/hooks/useMap';

export default function SafetyMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [filterTime, setFilterTime] = useState<'now' | 'night' | null>('now');
    const [filterType, setFilterType] = useState<RiskType | null>(null);
    const [reports, setReports] = useState<RiskReport[]>([]);
    const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

    // Initialize map using our hook, but we need access to the map instance to add markers
    // easier just to reuse the hook logic or adapt it?
    // The hook provides setCenter etc but checks if map is ready.
    // The user wants markers. The current useMap hook logic might be too specific for "Sharing Run" (route layer etc).
    // Let's instantiate a fresh map for this view to have full control over markers and clusters.
    const mapInstanceRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (mapInstanceRef.current || !mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    'osm': {
                        type: 'raster',
                        tiles: [
                            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        ],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors',
                    },
                },
                layers: [
                    {
                        id: 'osm-tiles',
                        type: 'raster',
                        source: 'osm',
                        minzoom: 0,
                        maxzoom: 19,
                    },
                    {
                        id: 'dark-overlay',
                        type: 'background',
                        paint: {
                            'background-color': '#0c0c0d',
                            'background-opacity': 0.8, // Make it darker for the "Safety" vibe
                        },
                    },
                ],
            },
            center: [-74.5, 40], // Default
            zoom: 9,
        });

        mapInstanceRef.current = map;

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                map.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 });
                new maplibregl.Marker({ color: '#8c30e8' })
                    .setLngLat([pos.coords.longitude, pos.coords.latitude])
                    .addTo(map);
            });
        }

        map.on('moveend', fetchReports);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    const fetchReports = async () => {
        if (!mapInstanceRef.current) return;
        const bounds = mapInstanceRef.current.getBounds();

        // Construct query
        let query = supabase.from('risk_reports').select('*')
            .gte('lat', bounds.getSouth())
            .lte('lat', bounds.getNorth())
            .gte('lng', bounds.getWest())
            .lte('lng', bounds.getEast())
            .in('status', ['active', 'resolved']);

        const { data, error } = await query;
        if (error) {
            console.error('Error fetching reports:', error);
            return;
        }

        if (data) {
            setReports(data as RiskReport[]);
        }
    };

    // Filter markers locally after fetch to avoid spamming DB on every filter click if data is already in view
    const filteredReports = useMemo(() => {
        return reports.filter(r => {
            if (filterType && r.risk_type !== filterType) return false;
            if (filterTime === 'night') {
                return r.occurrence_time === 'night' || r.occurrence_time === 'always';
            }
            // 'now' logic: check local time. If night (6pm-6am), show night+always. Else show day+always
            if (filterTime === 'now') {
                const hour = new Date().getHours();
                const isNight = hour < 6 || hour > 18;
                if (isNight) return r.occurrence_time === 'night' || r.occurrence_time === 'always';
                else return r.occurrence_time === 'day' || r.occurrence_time === 'always';
            }
            return true;
        });
    }, [reports, filterTime, filterType]);


    // Render markers
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing
        Object.values(markersRef.current).forEach(m => m.remove());
        markersRef.current = {};

        filteredReports.forEach(report => {
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.innerHTML = `<span class="material-symbols-outlined text-primary" style="font-size: 24px; text-shadow: 0 0 10px #8c30e8;">${getRiskIcon(report.risk_type)}</span>`;
            el.style.cursor = 'pointer';

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate(`/safety/risk/${report.id}`);
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([report.lng, report.lat])
                .addTo(mapInstanceRef.current!);

            markersRef.current[report.id] = marker;
        });

    }, [filteredReports, navigate]);

    function getRiskIcon(type: string) {
        switch (type) {
            case 'theft': return 'shield';
            case 'lighting': return 'lightbulb';
            case 'road': return 'construction';
            case 'animal': return 'pets';
            case 'obstacle': return 'warning';
            default: return 'more_horiz';
        }
    }

    return (
        <AppLayout hideTopNav={true} hideBottomNav={true}>
            <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark">
                {/* Map Container */}
                <div ref={mapContainer} className="absolute inset-0 z-0" />
                <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-background-dark/40 pointer-events-none" />

                {/* Top UI */}
                <div className="relative z-20 px-4 pt-12 pb-4">
                    <div className="glass rounded-2xl p-2 flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-white/5 rounded-xl px-3 py-2">
                            <Icon name="search" className="text-primary text-xl" />
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-white/40 text-white font-light ml-2 focus:outline-none" placeholder="Onde correr com segurança?" type="text" />
                        </div>
                        <button
                            className="flex size-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => {
                                if (navigator.geolocation && mapInstanceRef.current) {
                                    navigator.geolocation.getCurrentPosition((pos) => {
                                        mapInstanceRef.current?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 15 });
                                    });
                                }
                            }}
                        >
                            <Icon name="my_location" className="text-white" />
                        </button>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
                        <button
                            onClick={() => setFilterTime('now')}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 border transition-all ${filterTime === 'now' ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'glass border-white/10'}`}
                        >
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Agora</span>
                        </button>
                        <button
                            onClick={() => setFilterTime('night')}
                            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 border transition-all ${filterTime === 'night' ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'glass border-white/10'}`}
                        >
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Noite</span>
                        </button>
                        {(['theft', 'lighting', 'road', 'animal'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterType(filterType === t ? null : t)}
                                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 border transition-all ${filterType === t ? 'bg-red-500 border-red-500' : 'glass border-white/10'}`}
                            >
                                <span className="text-white text-xs font-bold uppercase tracking-wider">{t}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom UI */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-10 space-y-6 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent pt-10">
                    {/* Severity Legend */}
                    <div className="glass inline-flex flex-col p-4 rounded-2xl max-w-[200px]">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Escala de Segurança</p>
                        <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary to-[#e830e8] mb-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white/60">Baixo Risco</span>
                            <span className="text-[10px] text-white/60">Seguro</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/safety/report')}
                            className="w-full h-16 bg-primary rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 active:scale-95 transition-transform"
                        >
                            <Icon name="emergency_share" className="text-white" />
                            <span className="text-white font-bold text-lg tracking-tight">Reportar Risco</span>
                        </button>
                        <button
                            onClick={() => navigate('/safety/plan')}
                            className="w-full h-16 bg-white rounded-2xl border-2 border-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                        >
                            <Icon name="route" className="text-primary" />
                            <span className="text-background-dark font-bold text-lg tracking-tight">Planejar Rota Segura</span>
                        </button>
                    </div>

                    {/* iOS home indicator */}
                    <div className="mt-4 flex justify-center">
                        <div className="h-1 w-32 rounded-full bg-white/10" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
