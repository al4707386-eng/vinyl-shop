import { Link } from 'react-router-dom';

export default function RecordCard({ record, isFavorite, onToggleFavorite, index = 0 }) {
  function handleImageError(event) {
    event.currentTarget.style.display = 'none';
    event.currentTarget.parentElement.classList.remove('record-cover--image');
  }

  return (
    <article
      className="record-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to={`/catalog/${record.id}`} className="record-card__link">
        <div
          className={`record-cover ${record.cover ? 'record-cover--image' : ''}`}
          style={{ '--cover-color': record.color }}
        >
{record.cover && (
  <img
    className="record-cover__image"
    src={`http://localhost:3000${record.cover}`}
    alt={`${record.artist} — ${record.title}`}
    loading="lazy"
    onError={handleImageError}
  />
)}

          <span className="record-cover__disc" aria-hidden="true" />
          <span className="record-cover__artist">{record.artist}</span>
          <span className="record-cover__title">{record.title}</span>
        </div>
      </Link>

      <div className="record-card__body">
        <h3 className="record-card__title">
          <Link to={`/catalog/${record.id}`}>{record.title}</Link>
        </h3>
        <p className="record-card__artist">
          {record.artist} · {record.year}
        </p>
        <p className="record-card__genre">{record.genre}</p>

        <div className="record-card__footer">
          <span className="record-card__price">{record.price}</span>

          <button
            className={`icon-btn ${isFavorite ? 'icon-btn--active' : ''}`}
            type="button"
            onClick={() => onToggleFavorite(record.id)}
            aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        {!record.inStock && <span className="badge badge--muted">Нет в наличии</span>}
      </div>
    </article>
  );
}