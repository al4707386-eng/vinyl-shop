import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function RecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, favorites, toggleFavorite } = useAuth();

  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const data = await api.getRecord(id);
        if (!isCancelled) {
          setRecord(data);
        }
      } catch (error) {
        if (!isCancelled) setRecord(null);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (isLoading) return <Loader text="Загружаем пластинку…" />;

  if (!record) {
    return (
      <EmptyState
        icon="💿"
        title="Пластинка не найдена"
        description="Возможно, она была продана или ссылка устарела."
        action={
          <Button onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </Button>
        }
      />
    );
  }

  // Определяем, какую картинку показывать
  const imageUrl = record.cover?.startsWith('http') 
    ? record.cover 
    : `/covers/${record.id}.jpg`;

  const isFavorite = favorites.includes(record.id);

  async function handleBuy() {
    if (!user) {
      navigate('/login', { state: { from: `/catalog/${record.id}` } });
      return;
    }

    try {
      await api.createOrder({
        userId: user.id,
        items: [record.title],
        total: record.price,
      });
      setIsOrderOpen(true);
    } catch (error) {
      alert('Не удалось оформить заказ: ' + error.message);
    }
  }

  return (
    <div className="page">
      <button className="back-link" type="button" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="record-detail">
        <div className="record-detail__cover">
          <div className="record-detail__main-image">
            <img
              src={imageUrl}
              alt={`${record.artist} — ${record.title}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="record-detail__info">
          <p className="record-detail__genre">{record.genre}</p>
          <h1 className="record-detail__title">{record.title}</h1>
          <p className="record-detail__artist">
            {record.artist}, {record.year}
          </p>

          <p className="record-detail__description">{record.description}</p>

          <dl className="specs">
            <div className="specs__row"><dt>Лейбл</dt><dd>{record.label}</dd></div>
            <div className="specs__row"><dt>Страна</dt><dd>{record.country}</dd></div>
            <div className="specs__row"><dt>Год</dt><dd>{record.year}</dd></div>
            <div className="specs__row">
              <dt>Наличие</dt>
              <dd>{record.inStock ? 'В наличии' : 'Нет в наличии'}</dd>
            </div>
          </dl>

          <h2 className="record-detail__subtitle">Треклист</h2>
          <ol className="tracklist">
            {(record.tracks || []).map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ol>

          <div className="record-detail__buy">
            <span className="record-detail__price">{record.price} ₽</span>
            <Button onClick={handleBuy} disabled={!record.inStock}>
              {record.inStock ? 'Купить' : 'Нет в наличии'}
            </Button>
            <Button
              variant={isFavorite ? 'primary' : 'ghost'}
              onClick={() => toggleFavorite(record.id)}
            >
              {isFavorite ? '♥ В избранном' : '♡ В избранное'}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOrderOpen}
        title="Заказ оформлен"
        onClose={() => setIsOrderOpen(false)}
      >
        <p>
          Спасибо! Пластинка «{record.title}» добавлена в ваши заказы.
          Посмотреть историю можно в личном кабинете.
        </p>
        <div className="modal__actions">
          <Button variant="ghost" onClick={() => setIsOrderOpen(false)}>
            Остаться
          </Button>
          <Button
            onClick={() => {
              setIsOrderOpen(false);
              navigate('/profile/orders');
            }}
          >
            Мои заказы
          </Button>
        </div>
      </Modal>

      <p className="record-detail__hint">
        Не уверены в выборе? <Link to="/catalog">Вернитесь в каталог</Link> и
        сравните издания.
      </p>
    </div>
  );
}