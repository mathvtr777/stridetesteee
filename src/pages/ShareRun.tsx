import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRun, Run } from '@/lib/db';
import { Icon } from '@/components/ui/Icon';
import html2canvas from 'html2canvas';
import { useMap } from '@/hooks/useMap';
import maplibregl from 'maplibre-gl';

export default function ShareRun() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [run, setRun] = useState<Run | null>(null);
    const [loading, setLoading] = useState(true);
    const captureRef = useRef<HTMLDivElement>(null);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { map, isMapReady, updateRoute } = useMap(mapContainerRef, {
        initialZoom: 14 // Better zoom for route overview
    });

    useEffect(() => {
        const fetchRun = async () => {
            if (id) {
                try {
                    const runData = await getRun(id);
                    if (runData) {
                        setRun(runData);
                    } else {
                        console.error('Run not found');
                    }
                } catch (error) {
                    console.error('Error fetching run:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRun();
    }, [id]);

    useEffect(() => {
        if (run && run.points && isMapReady && map) {
            // Draw route
            updateRoute(run.points);

            // Fit bounds
            if (run.points.length > 0) {
                const bounds = new maplibregl.LngLatBounds();
                run.points.forEach(p => bounds.extend([p.lng, p.lat]));
                map.fitBounds(bounds, {
                    padding: 50,
                    animate: false
                });
            }
        }
    }, [run, isMapReady, map, updateRoute]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Run on Stride',
                    text: `I just ran ${run?.distanceKm.toFixed(2)}km in ${formatDuration(run?.durationSec || 0)}! Check out my run.`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback or copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleSaveToPhotos = async () => {
        if (captureRef.current) {
            try {
                const canvas = await html2canvas(captureRef.current, {
                    backgroundColor: '#0a0a0b', // Ensure background color is captured
                    scale: 2, // High resolution
                    useCORS: true, // For cross-origin images (though we mostly have local assets)
                });

                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `stride-run-${id}.png`;
                link.click();
            } catch (error) {
                console.error('Error saving image:', error);
            }
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Loading...</div>;
    }

    if (!run) {
        return <div className="min-h-screen bg-background-dark flex items-center justify-center text-white">Run not found</div>;
    }

    return (
        <div className="min-h-[100dvh] bg-background-dark font-display text-white flex flex-col items-center justify-center p-4">
            {/* Capture Area */}
            <div
                ref={captureRef}
                className="relative w-full max-w-[430px] bg-background-dark overflow-hidden flex flex-col justify-between shadow-2xl rounded-lg"
                style={{ aspectRatio: '9/16', minHeight: '800px' }}
            >
                <div className="absolute inset-0 z-0">
                    <div ref={mapContainerRef} className="w-full h-full scale-110 map-neon-glow" style={{
                        filter: 'grayscale(1) invert(1) brightness(0.7) sepia(1) hue-rotate(240deg) saturate(8)',
                    }} />
                    <div className="absolute inset-0 z-0 bg-background-dark/40 pointer-events-none"></div>

                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="dust-particle top-[30%] left-[20%] opacity-60"></div>
                        <div className="dust-particle top-[45%] left-[70%] opacity-40"></div>
                        <div className="dust-particle top-[60%] left-[30%] opacity-80"></div>
                        <div className="dust-particle top-[25%] left-[80%] opacity-30"></div>
                        <div className="dust-particle top-[75%] left-[55%] opacity-50"></div>
                        <div className="dust-particle top-[40%] left-[10%] opacity-40"></div>
                    </div>
                </div>

                <header className="relative z-10 p-6 flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-full glass-premium">
                        <span className="material-symbols-outlined text-white text-xl">close</span>
                    </button>
                    <div className="text-[10px] tracking-[0.5em] font-black text-white/60 uppercase">Elite Run Pro</div>
                    <button className="size-10 flex items-center justify-center rounded-full glass-premium opacity-50 pointer-events-none">
                        <span className="material-symbols-outlined text-white text-xl">ios_share</span>
                    </button>
                </header>

                <main className="relative z-10 flex flex-col items-center px-6 flex-grow justify-center">
                    <div className="mt-2 mb-8 text-center transform -skew-x-6">
                        <p className="text-primary text-[10px] font-black tracking-[0.5em] mb-3 uppercase drop-shadow-lg">New Milestone achieved</p>
                        <h1 className="text-6xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            <span className="block text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">PERSONAL</span>
                            <span className="block text-outline-purple drop-shadow-[0_0_10px_rgba(140,48,232,0.5)]">BEST</span>
                        </h1>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-[-40px] bg-primary/20 blur-[100px] rounded-full"></div>
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="w-52 h-52 medal-chrome rounded-full flex items-center justify-center p-1.5 shadow-[0_0_60px_rgba(140,48,232,0.6)]">
                                <div className="w-full h-full rounded-full bg-gradient-to-tr from-black/40 to-transparent flex items-center justify-center border border-white/30">
                                    <div className="w-44 h-44 rounded-full border-[6px] border-[#ffd700]/30 flex items-center justify-center shadow-inner">
                                        <span className="material-symbols-outlined text-[100px] gold-text-shimmer" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>military_tech</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <div className="absolute top-10 left-10 size-1 bg-primary blur-[1px] rounded-full opacity-60"></div>
                                <div className="absolute bottom-10 right-10 size-1.5 bg-primary blur-[1px] rounded-full opacity-80"></div>
                                <div className="absolute top-1/2 -right-4 size-1 bg-white blur-[1px] rounded-full opacity-40"></div>
                            </div>
                            <div className="absolute -bottom-2 holographic-badge px-6 py-2 rounded-lg transform -rotate-2">
                                <span className="text-[11px] font-black tracking-widest uppercase text-white drop-shadow-md">PLATINUM TIER</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full mt-12 grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center py-5 rounded-2xl glass-premium">
                            <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase mb-1.5">Distance</span>
                            <span className="text-2xl font-bold tracking-tight">{run.distanceKm.toFixed(2)}</span>
                            <span className="text-[9px] text-primary font-black mt-1">KM</span>
                        </div>
                        <div className="flex flex-col items-center py-5 rounded-2xl glass-premium ring-2 ring-primary/40 relative -top-2">
                            <span className="text-[9px] font-bold text-primary tracking-widest uppercase mb-1.5">Time</span>
                            <span className="text-2xl font-black tracking-tight text-white drop-shadow-[0_0_8px_rgba(140,48,232,0.4)]">{formatDuration(run.durationSec)}</span>
                            <span className="text-[9px] text-primary font-black mt-1">MIN</span>
                        </div>
                        <div className="flex flex-col items-center py-5 rounded-2xl glass-premium">
                            <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase mb-1.5">Pace</span>
                            <span className="text-2xl font-bold tracking-tight">{run.avgPace.split('/')[0]}</span>
                            <span className="text-[9px] text-primary font-black mt-1">/KM</span>
                        </div>
                    </div>
                </main>

                <footer className="relative z-10 p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-center mt-0 mb-4">
                        <div className="holographic-badge px-4 py-1.5 rounded-full flex items-center gap-2 border-white/10">
                            <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            <p className="text-[9px] text-white/80 tracking-[0.15em] uppercase font-black">Verified by Elite Run</p>
                        </div>
                    </div>

                    <div className="w-full flex justify-center pb-3">
                        <div className="w-32 h-1.5 bg-white/10 rounded-full"></div>
                    </div>
                </footer>
            </div>

            {/* Action Buttons (Outside capture area) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-20 bg-background-dark/80 backdrop-blur-md flex flex-col gap-3">
                <button
                    onClick={handleShare}
                    className="w-full h-16 bg-gradient-to-r from-primary to-[#b366ff] rounded-2xl flex items-center justify-center gap-3 shadow-[0_15px_35px_rgba(140,48,232,0.5)] border-t border-white/20 active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-white">camera_alt</span>
                    <span className="text-white font-black tracking-wider uppercase text-sm">Share Story</span>
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveToPhotos}
                        className="w-full h-14 glass-premium rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white/80">download</span>
                        <span className="text-white/80 font-bold tracking-wide text-sm">Save to Photos</span>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full h-14 glass-premium rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined text-white/80">home</span>
                        <span className="text-white/80 font-bold tracking-wide text-sm">Home</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
