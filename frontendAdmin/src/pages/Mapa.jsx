import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useStages } from '../hooks/useStages';
import { COUNTRY_COLORS } from '../config/constants';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const EUROPE_BOUNDS = [[25, -25], [72, 45]];

function FitBounds({ points }) {
  const map = useMap();
  
  useEffect(() => {
    if (points && points.length > 0) {
      const validPoints = points.filter(p => p && typeof p[0] === 'number' && typeof p[1] === 'number');
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }
    }
  }, [points, map]);
  
  return null;
}

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1 });
    }
  }, [center, zoom, map]);
  
  return null;
}

export default function Mapa() {
  const { stages, loading } = useStages();
  const [selectedStage, setSelectedStage] = useState(null);
  const [showRoute, setShowRoute] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [filterCountry, setFilterCountry] = useState(null);
  const mapRef = useRef(null);

  const publishedStages = useMemo(() => {
    if (!stages || stages.length === 0) return [];
    return stages.filter(s => s.isPublished).sort((a, b) => a.dayNumber - b.dayNumber);
  }, [stages]);

  const mapPoints = useMemo(() => {
    if (publishedStages.length === 0) return [];
    
    const points = [];
    let accumulatedKm = 0;
    
    publishedStages.forEach((stage, index) => {
      accumulatedKm += stage.km;
      const isFirst = index === 0;
      const isLast = index === publishedStages.length -1;
      
      points.push({
        lat: stage.startLat,
        lng: stage.startLng,
        name: stage.startName,
        country: stage.country,
        km: isFirst ? 0: accumulatedKm - stage.km,
        type: 'start',
        dayNumber: stage.dayNumber,
        isHighlight: isFirst
      });
      
      if (isLast) {
        points.push({
          lat: stage.endLat,
          lng: stage.endLng,
          name: stage.endName,
          country: stage.country,
          km: accumulatedKm,
          type: 'end',
          dayNumber: stage.dayNumber,
          isHighlight: true
        });
      }
    });
    
    return points;
  }, [publishedStages]);

  const countries = useMemo(() => {
    return [...new Set(publishedStages.map(s => s.country))];
  }, [publishedStages]);

  const totalKm = useMemo(() => {
    return publishedStages.reduce((acc, s) => acc + s.km, 0);
  }, [publishedStages]);

  const stagesByCountry = useMemo(() => {
    const grouped = {};
    publishedStages.forEach(stage => {
      if (!grouped[stage.country]) {
        grouped[stage.country] = { stages: [], totalKm: 0 };
      }
      grouped[stage.country].stages.push(stage);
      grouped[stage.country].totalKm += stage.km;
    });
    return grouped;
  }, [publishedStages]);

  if (loading) return <Loading />;

  const getCountryColor = (country) => {
    return COUNTRY_COLORS[country] || '#666';
  };

  const getIcon = (point, index) => {
    if (index === 0) return startIcon;
    if (index === mapPoints.length - 1) return endIcon;
    return defaultIcon;
  };

  const routePositions = mapPoints
    .filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number')
    .map(p => [p.lat, p.lng]);

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    setMapCenter([stage.startLat, stage.startLng]);
    setMapZoom(10);
  };

  const centerOnRoute = () => {
    setMapCenter(null);
    setMapZoom(null);
    if (mapRef.current && mapPoints.length > 0) {
      const bounds = L.latLngBounds(mapPoints.map(p => [p.lat, p.lng]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
    }
  };

  const togglePanel = () => {
    setPanelOpen(prev => !prev);
  };

  const center = mapPoints.length > 0 ? [mapPoints[0].lat, mapPoints[0].lng] : [46, 10];

  return (
    <>
      <Navbar />
      <div className="mapa-page">
        <div className="mapa-hero">
          <div className="container">
            <h1>Mapa del viaje</h1>
            <p>Desde Toledo hasta Atenas</p>
          </div>
        </div>
        
        <div className="mapa-layout">
          <div className={`route-panel ${panelOpen ? 'open' : 'closed'}`}>
            <div className="panel-header">
              <button className="panel-toggle-btn" onClick={togglePanel}>
                {panelOpen ? '◀' : '▶'}
              </button>
              <span className="panel-title">Ruta</span>
              <label className="route-toggle">
                <input 
                  type="checkbox" 
                  checked={showRoute}
                  onChange={(e) => setShowRoute(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {panelOpen && (
              <div className="panel-body">
                <div className="country-filter">
                  <select 
                    value={filterCountry || ''} 
                    onChange={(e) => setFilterCountry(e.target.value || null)}
                  >
                    <option value="">Todos los países</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="countries-list">
                  {countries.map((country) => (
                    <div key={country} className="country-block">
                      <div 
                        className="country-title"
                        style={{ borderLeftColor: getCountryColor(country) }}
                        onClick={() => setExpandedCountry(prev => prev === country ? null : country)}
                      >
                        <span className="expand-icon">
                          {expandedCountry === country ? '▼' : '▶'}
                        </span>
                        <span className="country-name">{country}</span>
                        <span className="country-km">
                          {stagesByCountry[country]?.totalKm.toFixed(0)} km
                        </span>
                      </div>
                      
                      {expandedCountry === country && stagesByCountry[country] && (
                        <div className="country-cities">
                          {stagesByCountry[country].stages.map((stage) => (
                            <div 
                              key={stage.id} 
                              className={`city-item ${selectedStage?.id === stage.id ? 'selected' : ''}`}
                              onClick={() => handleStageClick(stage)}
                            >
                              <div 
                                className="city-marker" 
                                style={{ backgroundColor: getCountryColor(country) }}
                              >
                                {stage.dayNumber}
                              </div>
                              <div className="city-info">
                                <span className="city-name">{stage.startName} → {stage.endName}</span>
                                <span className="city-km">{stage.km.toFixed(0)} km</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="map-container">
            <div className="map-wrapper">
              <MapContainer 
                ref={mapRef}
                center={center}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                zoomControl={true}
                minZoom={4}
                maxBounds={EUROPE_BOUNDS}
                maxBoundsViscosity={1.0}
              >
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                  bounds={EUROPE_BOUNDS}
                />
                
                {mapCenter && <MapController center={mapCenter} zoom={mapZoom} />}
                <FitBounds points={routePositions} />
                
                {showRoute && routePositions.length > 1 && (
                  <Polyline 
                    positions={routePositions} 
                    color="#e74c3c" 
                    weight={4} 
                    opacity={0.8}
                    dashArray="10, 10"
                  />
                )}
                
                {mapPoints.map((point, index) => (
                  <Marker 
                    key={index} 
                    position={[point.lat, point.lng]}
                    icon={getIcon(point, index)}
                    eventHandlers={{ click: () => setSelectedStage(publishedStages[index]) }}
                  >
                    <Popup>
                      <div className="leaflet-popup">
                        <h4>{point.name}</h4>
                        <p style={{ color: getCountryColor(point.country), fontWeight: 600 }}>
                          {point.country}
                        </p>
                        <p>Etapa {point.dayNumber}</p>
                        <p>{point.km.toFixed(0)} km desde inicio</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              <div className="map-controls">
                <button className="map-btn" onClick={centerOnRoute} title="Ver toda la ruta">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </button>
                <button className="map-btn mobile-toggle" onClick={togglePanel} title="Ver ruta">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </button>
              </div>

              {selectedStage && (
                <div className="selected-point-card">
                  <button className="close-card" onClick={() => setSelectedStage(null)}>×</button>
                  <div className="card-content" style={{ borderLeftColor: getCountryColor(selectedStage.country) }}>
                    <h4>Etapa {selectedStage.dayNumber}</h4>
                    <p style={{ color: getCountryColor(selectedStage.country) }}>
                      {selectedStage.startName} → {selectedStage.endName}
                    </p>
                    <span>{selectedStage.km.toFixed(0)} km | {selectedStage.elevationGain.toFixed(0)} m desnivel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mapa-stats">
          <div className="stat-item">
            <span className="stat-icon">🌍</span>
            <span className="stat-info">
              <span className="stat-number">{countries.length}</span>
              <span className="stat-text">Países</span>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏙️</span>
            <span className="stat-info">
              <span className="stat-number">{publishedStages.length}</span>
              <span className="stat-text">Etapas</span>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🛣️</span>
            <span className="stat-info">
              <span className="stat-number">{totalKm.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
              <span className="stat-text">Km</span>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📅</span>
            <span className="stat-info">
              <span className="stat-number">~{Math.round(totalKm / 80)}</span>
              <span className="stat-text">Días</span>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}