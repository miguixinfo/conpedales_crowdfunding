import { useLatestStages } from '../../hooks/useStages';
import { adaptStagesForCards } from '../../services/adapters';
import StageCard from '../common/StageCard';
import Loading from '../common/Loading';
import './LatestStages.css';

export default function LatestStages() {
  const { stages, loading } = useLatestStages(3);

  if (loading) return <Loading />;

  const adaptedStages = adaptStagesForCards(stages);

  return (
    <section className="latest-stages">
      <div className="container">
        <div className="latest-header">
          <div>
            <h2>Últimas etapas</h2>
            <p>Síguenos día a día en esta aventura</p>
          </div>
        </div>
        
        <div className="latest-grid">
          {adaptedStages.map(stage => (
            <StageCard 
              key={stage.id} 
              stage={stage} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}