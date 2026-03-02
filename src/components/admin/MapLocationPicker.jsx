import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon (webpack/vite strips the default asset paths)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom brand-colored marker
const brandIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Nominatim free geocoding search (OpenStreetMap).
 * Rate-limited to 1 req/sec — we debounce on the caller side.
 */
async function searchPlaces(query) {
  if (!query || query.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * Reverse geocode lat/lng → place name.
 */
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Internal: click handler on map ────────────────────────────
function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

// ─── Internal: fly to position when it changes ─────────────────
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

/**
 * Map-based location picker with search.
 *
 * @param {number|string} latitude
 * @param {number|string} longitude
 * @param {Function}      onChange  - ({ latitude, longitude, placeName }) => void
 * @param {string}        [className]
 */
export default function MapLocationPicker({
  latitude,
  longitude,
  onChange,
  className = '',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;
  const hasPosition = lat != null && lng != null && !isNaN(lat) && !isNaN(lng);

  // Default center: world view or current position
  const center = hasPosition ? [lat, lng] : [20, 0];
  const zoom = hasPosition ? 14 : 2;

  // Close results dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  const handleSearchInput = useCallback((value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchPlaces(value);
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  // Select a search result
  const handleSelectResult = useCallback((result) => {
    const newLat = parseFloat(result.lat);
    const newLng = parseFloat(result.lon);
    const name = result.display_name;
    setPlaceName(name);
    setQuery(name.split(',').slice(0, 2).join(','));
    setShowResults(false);
    onChange?.({ latitude: newLat, longitude: newLng, placeName: name });
  }, [onChange]);

  // Click on map
  const handleMapClick = useCallback(async (latlng) => {
    const newLat = parseFloat(latlng.lat.toFixed(6));
    const newLng = parseFloat(latlng.lng.toFixed(6));
    onChange?.({ latitude: newLat, longitude: newLng, placeName: '' });

    // Reverse geocode to get place name
    const data = await reverseGeocode(newLat, newLng);
    if (data?.display_name) {
      setPlaceName(data.display_name);
      setQuery(data.display_name.split(',').slice(0, 2).join(','));
      onChange?.({ latitude: newLat, longitude: newLng, placeName: data.display_name });
    }
  }, [onChange]);

  // Clear location
  const handleClear = () => {
    setQuery('');
    setPlaceName('');
    setResults([]);
    onChange?.({ latitude: '', longitude: '', placeName: '' });
  };

  return (
    <div className={`space-y-3 ${className}`} ref={containerRef}>
      {/* Search bar */}
      <div className="relative">
        <label className="block text-sm font-bold text-ink dark:text-white mb-1.5">
          Location <span className="text-ink-light dark:text-white/40 font-normal">(search or click on map)</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => handleSearchInput(e.target.value)}
            placeholder="Search place... e.g. Eiffel Tower, Paris"
            className="w-full pl-10 pr-10 py-3 bg-canvas dark:bg-d-surface border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm font-medium text-ink dark:text-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
          />
          {searching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand animate-spin" />}
          {!searching && query && (
            <button type="button" onClick={handleClear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute z-[1000] mt-1.5 w-full bg-white dark:bg-d-card border border-gray-200 dark:border-white/[0.08] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden max-h-60 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={`${r.place_id}-${i}`}
                type="button"
                onClick={() => handleSelectResult(r)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-canvas dark:hover:bg-d-surface transition-colors cursor-pointer border-b border-gray-50 dark:border-white/[0.04] last:border-0"
              >
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-white truncate">
                    {r.display_name?.split(',').slice(0, 2).join(',')}
                  </p>
                  <p className="text-xs text-ink-light dark:text-white/40 truncate mt-0.5">
                    {r.display_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.08] shadow-sm" style={{ height: 280 }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handleMapClick} />
          {hasPosition && (
            <>
              <Marker position={[lat, lng]} icon={brandIcon} />
              <FlyTo position={[lat, lng]} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Coordinate display */}
      {hasPosition && (
        <div className="flex items-center justify-between bg-canvas dark:bg-d-surface rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <span className="text-xs font-mono text-ink dark:text-white">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </span>
          </div>
          {placeName && (
            <span className="text-xs text-ink-light dark:text-white/50 truncate max-w-[50%] text-right">
              {placeName.split(',').slice(0, 3).join(',')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
