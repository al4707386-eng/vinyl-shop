import { Link } from 'react-router-dom';

export default function RecordCard({ record, isFavorite, onToggleFavorite, index = 0 }) {
  // Проверяем, есть ли локальная картинка для этой пластинки
  const localCoverUrl = `/covers/${record.id}.jpg`;
  
  // Если ссылка в базе начинается на http - берем её, иначе - локальную
  const imageUrl = record.cover?.startsWith('http') ? record.cover : localCoverUrl;

  return (
    <article
      className="record-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link to={`/catalog/${record.id}`} className="record-card__link">
        <div
          className="record-cover record-cover--image"
          style={{ '--cover-color': record.color }}
        >
          <img
            className="record-cover__image"
            src={imageUrl}
            alt={`${record.artist} — ${record.title}`}
            loading="lazy"
          />
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
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </article>
  );
}