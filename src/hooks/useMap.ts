import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface RunPoint {
  lat: number;
  lng: number;
}

interface UseMapOptions {
  initialCenter?: [number, number] | null; // Permitir null para o centro inicial
  initialZoom?: number;
}

export function useMap(containerRef: React.RefObject<HTMLDivElement>, options: UseMapOptions = {}) {
  const { initialCenter = null, initialZoom = 15 } = options; // Definir initialCenter como null por padrão

  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
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
              'background-color': '#000000',
              'background-opacity': 0.3,
            },
          },
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      // Se initialCenter for null, o mapa será inicializado sem um centro específico,
      // e será centralizado na primeira posição válida do usuário.
      center: initialCenter || [0, 0], // Usar [0,0] como fallback temporário se não houver initialCenter
      zoom: initialCenter ? initialZoom : 1, // Zoom baixo se não houver centro inicial
      attributionControl: false,
      // @ts-ignore
      preserveDrawingBuffer: true, // Enable screenshot capture
    });

    map.on('load', () => {
      // Add route source
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      // Add route layer with purple glow
      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#8c30e8',
          'line-width': 8,
          'line-blur': 4,
          'line-opacity': 0.5,
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#a855f7',
          'line-width': 4,
        },
      });

      setIsMapReady(true);
    });

    // Disable map interactions during run for performance
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    // Add listener to disable following when user drags the map
    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef, initialCenter, initialZoom]);

  // Função que apenas atualiza o marcador, sem mover o mapa
  const updateUserPosition = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !isMapReady) return;

    // Debug: Log coordinates
    console.log('📍 GPS Position:', { lat, lng, url: `https://www.google.com/maps?q=${lat},${lng}` });

    // Update or create marker
    if (!markerRef.current) {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #8c30e8, #a855f7);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 20px rgba(140, 48, 232, 0.6);
        "></div>
      `;
      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [isMapReady]);

  const updateRoute = useCallback((points: RunPoint[]) => {
    if (!mapRef.current || !isMapReady) return;

    const source = mapRef.current.getSource('route') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: points.map((p) => [p.lng, p.lat]),
        },
      });
    }
  }, [isMapReady]);

  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const recenter = useCallback(() => {
    if (markerRef.current && mapRef.current) {
      const lngLat = markerRef.current.getLngLat();
      mapRef.current.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 16,
        duration: 500,
      });
      setIsFollowing(true);
    }
  }, []);

  return {
    map: mapRef.current,
    isMapReady,
    isFollowing,
    setIsFollowing,
    updateUserPosition,
    updateRoute,
    zoomIn,
    zoomOut,
    recenter,
  };
}