import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import RecordCard from '../components/RecordCard.jsx';
import Loader from '../components/Loader.jsx';

export default function Home() {
  const { user, favorites, toggleFavorite } = useAuth();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const data = await api.getRecords();
        if (!isCancelled) setRecords(data.slice(0, 4)); // первые 4 на главной
      } catch (error) {
        console.warn('Не удалось загрузить пластинки:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__tag">Более 12 редких изданий в наличии</span>
          <h1 className="hero__title">
            Винил, который <em>звучит</em> правильно
          </h1>
          <p className="hero__text">
            От классики прогрессив-рока до современного джаза. Оригинальные
            пресс-издания, бережная упаковка и доставка по всей стране.
          </p>
          <div className="hero__actions">
            <Link to="/catalog" className="btn btn--primary">
              Перейти в каталог
            </Link>
            {!user && (
              <Link to="/register" className="btn btn--ghost">
                Создать аккаунт
              </Link>
            )}
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__disc" />
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Хиты продаж</h2>
          <Link to="/catalog" className="section__link">
            Смотреть всё →
          </Link>
        </div>

        {isLoading ? (
          <Loader text="Загружаем пластинки…" />
        ) : (
          <div className="records-grid">
            {records.map((record, index) => (
              <RecordCard
                key={record.id}
                record={record}
                index={index}
                isFavorite={favorites.includes(record.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section__title">Почему у нас</h2>
        <div className="features">
          <article className="feature-card">
            <span className="feature-card__icon">🎚️</span>
            <h3>Только оригинал</h3>
            <p>
              Работаем с проверенными поставщиками и указываем состояние каждой
              пластинки.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-card__icon">📦</span>
            <h3>Надёжная упаковка</h3>
            <p>
              Жёсткие конверты и дополнительная защита углов — пластинка приедет
              целой.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-card__icon">💬</span>
            <h3>Поможем с выбором</h3>
            <p>
              Подберём издание под ваш проигрыватель и вкус. Пишите — ответим.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}