import { useHighlightPhotos } from '../../hooks/usePhotos';
import { useStages } from '../../hooks/useStages';
import { adaptPhotosForCards } from '../../services/adapters';
import Loading from '../common/Loading';
import './PhotoGallery.css';

export default function PhotoGallery() {
  const { photos, loading: photosLoading } = useHighlightPhotos();
  const { stages, loading: stagesLoading } = useStages();

  if (photosLoading || stagesLoading) return <Loading />;

  const adaptedPhotos = adaptPhotosForCards(photos, stages);

  if (adaptedPhotos.length === 0) return null;

  return (
    <section className="photo-gallery">
      <div className="container">
        <div className="gallery-header">
          <h2>Fotos del viaje</h2>
          <p>Momentos capturados en el camino</p>
        </div>
        
        <div className="gallery-grid">
          {adaptedPhotos.slice(0, 6).map(photo => (
            <div key={photo.id} className="gallery-item">
              <img 
                src={photo.url} 
                alt={photo.caption || 'Foto del viaje'} 
                className="gallery-image"
                loading="lazy"
              />
              {photo.caption && (
                <div className="gallery-caption">
                  <p>{photo.caption}</p>
                  {photo.stageName && (
                    <span className="gallery-stage">{photo.stageName}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}