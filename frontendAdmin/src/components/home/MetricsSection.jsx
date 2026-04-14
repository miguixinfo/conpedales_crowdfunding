import { useStats } from '../../hooks/useStats';
import { useStages } from '../../hooks/useStages';
import { adaptStatsForMetrics } from '../../services/adapters';
import Loading from '../common/Loading';
import './MetricsSection.css';

const metricIcons = {
  distance: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  road: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  calendar: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  globe: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  mountain: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  heart: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
};

export default function MetricsSection() {
  const { stats, loading: statsLoading } = useStats();
  const { stages, loading: stagesLoading } = useStages();

  if (statsLoading || stagesLoading) return <Loading />;

  const metrics = adaptStatsForMetrics(stats, stages);

  const metricsData = [
    { key: 'totalKm', value: metrics.totalKm.toLocaleString('es-ES'), label: 'KM totales', icon: metricIcons.distance },
    { key: 'totalElevation', value: metrics.totalElevation.toLocaleString('es-ES'), label: 'Desnivel (m)', icon: metricIcons.mountain },
    { key: 'totalStages', value: metrics.totalStages, label: 'Etapas', icon: metricIcons.road },
    { key: 'totalDonations', value: metrics.totalDonations, label: 'Donaciones', icon: metricIcons.heart },
    { key: 'daysOnRoad', value: '??', label: 'Días de viaje', icon: metricIcons.calendar },
    { key: 'countriesVisited', value: metrics.countriesVisited, label: 'Países', icon: metricIcons.globe },
  ];

  return (
    <section className="metrics-section">
      <div className="container">
        <div className="metrics-header">
          <h2>Métricas del viaje</h2>
          <p>El progreso de nuestra aventura en números</p>
        </div>
        
        <div className="metrics-grid">
          {metricsData.map(metric => (
            <div key={metric.key} className="metric-item">
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}