import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMap } from '@/hooks/useMap';
import { Icon } from '@/components/ui/Icon';
import { GlassCard } from '@/components/ui/GlassCard';
import { generateId, saveRun } from '@/lib/db';
import { cn } from '@/lib/utils';
import { calculateTotalDistance } from '@/lib/geoUtils';
import { toast } from 'sonner'; // Importando Sonner

// Definindo um limite de precisão para a atualização do mapa (em metros)
const MAP_UPDATE_MAX_ACCURACY = 20;

export default function LiveRun() {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const {
    isRunning,
    isPaused,
    currentRunPoints,
    currentDistance,
    currentDuration,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
    addRunPoint,
    updateCurrentMetrics,
    resetCurrentRun,
    addRun,
  } = useAppStore();

  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [mockBpm] = useState(() => Math.floor(Math.random() * 30) + 140);
  const [hasInitialMapCentered, setHasInitialMapCentered] = useState(false); // Novo estado

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedDurationRef = useRef<number>(0);

  // Geolocation
  const { currentPosition, error: geoError, startTracking, stopTracking } = useGeolocation({
    onPoint: (point) => {
      if (isRunning && !isPaused) {
        addRunPoint(point);
      }
    },
    minDistance: 5,
    maxAccuracy: 50, // Usando 50m para o primeiro ponto estável e registro de rota
  });

  // Map
  const { map, isMapReady, isFollowing, updateUserPosition, updateRoute, zoomIn, zoomOut, recenter } = useMap(
    mapContainerRef as React.RefObject<HTMLDivElement>,
    {
      // Passar null para initialCenter para que o mapa não comece em um local fixo
      initialCenter: null,
    }
  );

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format pace
  const formatPace = (kmDistance: number, seconds: number) => {
    if (kmDistance < 0.01 || seconds === 0) return "--'--\"";
    const paceSeconds = seconds / kmDistance;
    const mins = Math.floor(paceSeconds / 60);
    const secs = Math.floor(paceSeconds % 60);
    return `${mins}'${secs.toString().padStart(2, '0')}"/km`;
  };

  // Initialize run
  useEffect(() => {
    if (!isRunning) {
      startRun();
      startTracking();
      startTimeRef.current = Date.now();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle Geolocation Errors with Toast
  useEffect(() => {
    if (geoError) {
      const isWaitingForFix = geoError.includes('Waiting for better GPS signal');

      if (isWaitingForFix) {
        toast.warning(geoError, {
          duration: 5000,
          id: 'geo-warning',
        });
        toast.dismiss('geo-error'); // Dismiss any previous fatal error
      } else {
        // Fatal errors (Permission Denied, Timeout, Unavailable)
        toast.error(geoError, {
          duration: 5000,
          id: 'geo-error',
        });
        toast.dismiss('geo-warning'); // Dismiss any previous warning
      }
    } else {
      // Clear all toasts if tracking is successful
      toast.dismiss('geo-error');
      toast.dismiss('geo-warning');
    }
  }, [geoError]);

  // Timer and Metric Update Loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 - pausedDurationRef.current;

        // Calculate distance based on all recorded points
        const distance = calculateTotalDistance(currentRunPoints);

        updateCurrentMetrics(distance, elapsed);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, currentRunPoints, updateCurrentMetrics]); // Dependency on currentRunPoints ensures distance calculation uses latest points

  // Update map with position AND control recentering
  useEffect(() => {
    if (currentPosition && isMapReady && map) {
      const { latitude, longitude, accuracy } = currentPosition.coords;

      // 1. Always update the marker position if we have a reading
      updateUserPosition(latitude, longitude);

      // 2. Only recenter/follow if the accuracy is good AND we are in following mode
      if (accuracy <= MAP_UPDATE_MAX_ACCURACY && isFollowing) {
        map.easeTo({
          center: [longitude, latitude],
          zoom: 16, // Definir um zoom inicial razoável
          duration: 500,
        });
        // Marcar que o mapa foi centralizado na posição inicial
        if (!hasInitialMapCentered) {
          setHasInitialMapCentered(true);
        }
      } else if (accuracy > MAP_UPDATE_MAX_ACCURACY && !hasInitialMapCentered) {
        // Se a precisão for ruim e o mapa ainda não foi centralizado,
        // podemos mostrar um zoom mais amplo ou uma mensagem de espera.
        // Por enquanto, não fazemos nada para evitar saltos.
      }
    }
  }, [currentPosition, isMapReady, updateUserPosition, isFollowing, map, hasInitialMapCentered]);

  // Update route on map
  useEffect(() => {
    if (currentRunPoints.length > 0 && isMapReady) {
      updateRoute(currentRunPoints);
    }
  }, [currentRunPoints, isMapReady, updateRoute]);

  // Handle pause/resume
  const handlePauseResume = () => {
    if (isPaused) {
      resumeRun();
    } else {
      pauseRun();
      // When pausing, record the duration elapsed so far
      pausedDurationRef.current = currentDuration;
    }
  };

  // Handle finish run
  const handleFinish = async () => {
    stopTracking();
    stopRun();

    const run = {
      id: generateId(),
      startedAt: startTimeRef.current,
      finishedAt: Date.now(),
      durationSec: Math.floor(currentDuration),
      distanceKm: currentDistance,
      avgPace: formatPace(currentDistance, currentDuration).replace('/km', ''),
      points: currentRunPoints,
      type: 'tempo' as const,
    };

    await saveRun(run);
    addRun(run);
    resetCurrentRun();
    navigate(`/share/${run.id}`);
  };

  // Lock screen handler
  const handleLock = () => {
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), 3000);
  };

  if (isLocked) {
    return (
      <div
        className="fixed inset-0 bg-background flex items-center justify-center z-50"
        onClick={() => setIsLocked(false)}
      >
        <div className="text-center">
          <Icon name="lock" className="text-primary text-5xl mb-4" />
          <p className="text-muted-foreground">Tap to unlock</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      {/* Map */}
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/80 via-transparent to-background/90" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 safe-top">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium">Live Tracking</span>
          </div>
          {currentPosition && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg glass text-xs",
              currentPosition.coords.accuracy <= 10 && "text-success",
              currentPosition.coords.accuracy > 10 && currentPosition.coords.accuracy <= 30 && "text-warning",
              currentPosition.coords.accuracy > 30 && "text-destructive"
            )}>
              <Icon name="gps_fixed" className="text-xs" />
              <span>±{currentPosition.coords.accuracy.toFixed(0)}m</span>
            </div>
          )}
        </div>
        <button
          className="flex size-10 items-center justify-center rounded-xl glass hover:bg-white/5"
          onClick={() => setShowFinishConfirm(true)}
        >
          <Icon name="settings" className="text-muted-foreground" />
        </button>
      </header>

      {/* Stats Cards */}
      <div className="absolute top-20 left-4 right-4 z-10 space-y-3">
        {/* Main distance card */}
        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 size-32 bg-primary/20 rounded-full blur-3xl" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Distance</p>
          <p className="text-4xl font-bold tracking-tighter text-glow mt-1">
            {currentDistance.toFixed(2)}<span className="text-lg text-muted-foreground ml-1">km</span>
          </p>
        </GlassCard>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="speed" className="text-primary text-sm" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Pace</span>
            </div>
            <p className="text-xl font-bold">{formatPace(currentDistance, currentDuration)}</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="timer" className="text-primary text-sm" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Duration</span>
            </div>
            <p className="text-xl font-bold">{formatDuration(currentDuration)}</p>
          </GlassCard>
        </div>

        {/* Heart rate */}
        <GlassCard className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="favorite" className="text-red-500 text-xl" />
            <div>
              <p className="text-xl font-bold">{mockBpm}<span className="text-sm text-muted-foreground ml-1">bpm</span></p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="size-10 rounded-xl glass flex items-center justify-center hover:bg-white/5">
              <Icon name="music_note" className="text-muted-foreground" />
            </button>
            <button className="size-10 rounded-xl glass flex items-center justify-center hover:bg-white/5">
              <Icon name="layers" className="text-muted-foreground" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 safe-bottom">
        {/* Pause/Resume Button */}
        <button
          onClick={handlePauseResume}
          className={cn(
            'w-full flex items-center justify-center gap-3 rounded-2xl p-5 mb-4 transition-all',
            isPaused
              ? 'btn-gradient'
              : 'glass border-primary/30'
          )}
        >
          <Icon name={isPaused ? 'play_circle' : 'pause_circle'} className="text-3xl" />
          <span className="text-lg font-bold">{isPaused ? 'RESUME RUN' : 'PAUSE RUN'}</span>
        </button>

        {/* Lock hint */}
        <button
          onClick={handleLock}
          className="w-full flex items-center justify-center gap-2 py-2 text-muted-foreground"
        >
          <Icon name="lock" className="text-sm" />
          <span className="text-xs">Hold to Lock Screen</span>
        </button>

        {/* Zoom controls */}
        <div className="absolute bottom-32 right-6 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className="size-10 rounded-xl glass flex items-center justify-center hover:bg-white/5"
          >
            <Icon name="add" className="text-foreground" />
          </button>
          <button
            onClick={zoomOut}
            className="size-10 rounded-xl glass flex items-center justify-center hover:bg-white/5"
          >
            <Icon name="remove" className="text-foreground" />
          </button>
          <button
            onClick={recenter}
            className="size-10 rounded-xl glass flex items-center justify-center hover:bg-white/5"
          >
            <Icon name="navigation" className="text-primary" />
          </button>
        </div>
      </div>

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
          <GlassCard className="w-full max-w-sm p-6 space-y-4">
            <h3 className="text-xl font-bold text-center">End Run?</h3>
            <p className="text-muted-foreground text-center text-sm">
              You've run {currentDistance.toFixed(2)}km in {formatDuration(currentDuration)}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 py-3 rounded-xl glass font-medium hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl btn-gradient font-bold"
              >
                Finish
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}