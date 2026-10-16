import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import RecordCard from '../components/RecordCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';

export default function Catalog() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('Все');
  const [sort, setSort] = useState('popular');

  const { favorites, toggleFavorite } = useAuth();

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const data = await api.getRecords();
        if (!isCancelled) setRecords(data);
      } catch (error) {
        console.warn('Не удалось загрузить каталог:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  const genres = ['Все', ...Array.from(new Set(records.map((r) => r.genre).filter(Boolean)))];

  const normalizedQuery = query.trim().toLowerCase();

  const visibleRecords = records
    .filter((record) => (genre === 'Все' ? true : record.genre === genre))
    .filter((record) => {
      if (!normalizedQuery) return true;
      return (
        record.title.toLowerCase().includes(normalizedQuery) ||
        record.artist.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'year-desc') return (b.year || 0) - (a.year || 0);
      if (sort === 'year-asc') return (a.year || 0) - (b.year || 0);
      return 0;
    });

  function resetFilters() {
    setQuery('');
    setGenre('Все');
    setSort('popular');
  }

  return (
    <div className="page">
      <header className="page__head">
        <h1 className="page__title">Каталог пластинок</h1>
        <p className="page__subtitle">
          Найдено позиций: {isLoading ? '…' : visibleRecords.length}
        </p>
      </header>

      <div className="filters">
        <SearchBar
          value={query}
          onSearch={setQuery}
          placeholder="Название альбома или исполнитель…"
        />

        <select
          className="select"
          value={genre}
          onChange={(event) => setGenre(event.target.value)}
        >
          {genres.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="popular">По популярности</option>
          <option value="price-asc">Сначала дешёвые</option>
          <option value="price-desc">Сначала дорогие</option>
          <option value="year-desc">Сначала новые</option>
          <option value="year-asc">Сначала старые</option>
        </select>
      </div>

      {isLoading && <Loader text="Загружаем каталог…" />}

      {!isLoading && visibleRecords.length === 0 && (
        <EmptyState
          icon="🔎"
          title="Ничего не найдено"
          description="Попробуйте изменить запрос или сбросить фильтры."
          action={<Button onClick={resetFilters}>Сбросить фильтры</Button>}
        />
      )}

      {!isLoading && visibleRecords.length > 0 && (
        <div className="records-grid">
          {visibleRecords.map((record, index) => (
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
    </div>
  );
}