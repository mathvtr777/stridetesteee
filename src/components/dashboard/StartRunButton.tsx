import { useNavigate } from 'react-router-dom';
import { GradientButton } from '@/components/ui/GradientButton';
import { Icon } from '@/components/ui/Icon';
import { useState, useEffect } from 'react';

export function StartRunButton() {
  const navigate = useNavigate();
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'ready' | 'error'>('checking');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      return;
    }

    // Try to get a position to check permissions and connectivity
    navigator.geolocation.getCurrentPosition(
      () => setGpsStatus('ready'),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('error');
        } else {
          // This covers POSITION_UNAVAILABLE and TIMEOUT errors
          setGpsStatus('error');
        }
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }, []);

  const handleStartRun = () => {
    if (gpsStatus === 'ready') {
      navigate('/run');
    } else {
      // If GPS is error, still allow navigation but inform the user
      // The LiveRun page will handle persistent errors with toasts.
      navigate('/run');
    }
  };

  return (
    <section className="py-2">
      <GradientButton onClick={handleStartRun} className="group" disabled={gpsStatus === 'checking'}>
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
            <Icon name="play_arrow" className="text-white text-3xl" />
          </div>
          <div className="text-left">
            <p className="text-lg font-bold tracking-tight">START RUN</p>
            <p className="text-xs text-white/70">
              {gpsStatus === 'ready' && 'GPS Connected • Ready to go'}
              {gpsStatus === 'checking' && 'Checking GPS...'}
              {gpsStatus === 'error' && 'GPS Unavailable • Tap to start anyway'}
            </p>
          </div>
        </div>
        <Icon 
          name="chevron_right" 
          className="text-white/50 group-hover:translate-x-1 transition-transform" 
        />
      </GradientButton>
    </section>
  );
}