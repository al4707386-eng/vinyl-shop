import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import RecordCard from '../components/RecordCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';

export default function ProfileFavorites() {
  const { favorites, toggleFavorite } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const data = await api.getRecords();
        if (!isCancelled) setAllRecords(data);
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

  if (isLoading) return <Loader text="Загружаем избранное…" />;

  const favoriteRecords = allRecords.filter((record) =>
    favorites.includes(record.id)
  );

  if (favoriteRecords.length === 0) {
    return (
      <EmptyState
        icon="♡"
        title="В избранном пока пусто"
        description="Нажимайте на сердечко в карточке пластинки, чтобы сохранить её здесь."
        action={
          <Link to="/catalog" className="btn btn--primary">
            Перейти в каталог
          </Link>
        }
      />
    );
  }

  return (
    <div className="records-grid">
      {favoriteRecords.map((record, index) => (
        <RecordCard
          key={record.id}
          record={record}
          index={index}
          isFavorite
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}