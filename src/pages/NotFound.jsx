import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page page--narrow not-found">
      <span className="not-found__code">404</span>
      <h1 className="page__title">Страница не найдена</h1>
      <p className="page__subtitle">
        Возможно, пластинку уже продали, а страницу удалили.
      </p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          На главную
        </Link>
        <Link to="/catalog" className="btn btn--ghost">
          В каталог
        </Link>
      </div>
    </div>
  );
}