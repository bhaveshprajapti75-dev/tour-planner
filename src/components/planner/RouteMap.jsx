import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import usePlannerStore from '../../store/plannerStore';
import { cities, getDistance } from '../../data/mockData';

export default function RouteMap() {
  const { selectedCities } = usePlannerStore();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (selectedCities.length === 0 || !mapRef.current) return;

    // Dynamically import leaflet
    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const selectedCityData = selectedCities.map(id => cities.find(c => c.id === id)).filter(Boolean);
      const center = selectedCityData.length > 0
        ? [selectedCityData.reduce((a, c) => a + c.lat, 0) / selectedCityData.length,
        selectedCityData.reduce((a, c) => a + c.lng, 0) / selectedCityData.length]
        : [46.8, 8.2];

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView(center, 8);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Custom markers
      const points = [];
      selectedCityData.forEach((city, i) => {
        const marker = L.circleMarker([city.lat, city.lng], {
          radius: 9,
          fillColor: '#4F46E5',
          color: '#fff',
          weight: 3,
          fillOpacity: 1,
        }).addTo(map);
        marker.bindPopup(`<b>${i + 1}. ${city.name}</b>`);
        points.push([city.lat, city.lng]);
      });

      // Draw route polyline
      if (points.length > 1) {
        L.polyline(points, {
          color: '#4F46E5',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10',
          lineCap: 'round',
        }).addTo(map);
      }

      // Fit bounds
      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50] });
      }

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedCities]);

  if (selectedCities.length === 0) return null;

  // Distance summary
  const distances = [];
  for (let i = 0; i < selectedCities.length - 1; i++) {
    const from = cities.find(c => c.id === selectedCities[i]);
    const to = cities.find(c => c.id === selectedCities[i + 1]);
    const dist = getDistance(selectedCities[i], selectedCities[i + 1]);
    distances.push({ from, to, ...dist });
  }

  return (
    <div className="bg-white dark:bg-d-card rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] mb-12 shadow-xl shadow-ink/5 dark:shadow-black/20 overflow-hidden relative">
      {/* Leaflet Map */}
      <div ref={mapRef} className="w-full h-[350px] md:h-[450px]" />

      {/* Floating Route Summary Overlay inside the map container on desktop, or below on mobile */}
      <div className="md:absolute md:bottom-6 md:left-6 md:right-6 md:bg-white/80 md:dark:bg-d-card/80 md:backdrop-blur-xl md:rounded-[2rem] p-5 shadow-sm border border-transparent md:border-ink/[0.04] md:dark:border-white/[0.04] bg-white dark:bg-d-card">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Navigation className="w-5 h-5 text-brand" />
          <h4 className="font-bold text-ink dark:text-white text-base tracking-tight">Route Journey</h4>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
          {selectedCities.map((id, i) => {
            const city = cities.find(c => c.id === id);
            const dist = i < distances.length ? distances[i] : null;
            return (
              <div key={id} className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-brand/5 dark:bg-white/5 pr-4 pl-1.5 py-1.5 rounded-full border border-brand/10 dark:border-white/10 hover:bg-brand/10 transition-colors">
                  <img src={city?.image} className="w-7 h-7 rounded-full object-cover shadow-sm" alt={city?.name} />
                  <span className="font-bold text-sm text-ink dark:text-white whitespace-nowrap">{city?.name}</span>
                </div>
                {dist && (
                  <div className="flex flex-col items-center px-1 md:px-3 shrink-0 opacity-60">
                    <div className="text-[10px] font-bold text-ink dark:text-white whitespace-nowrap mb-0.5">{dist.km} km</div>
                    <div className="w-6 md:w-10 h-0.5 bg-brand/50 rounded-full" />
                    <div className="text-[10px] text-ink dark:text-white whitespace-nowrap mt-0.5">~{Math.round(dist.mins / 60)}h</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
