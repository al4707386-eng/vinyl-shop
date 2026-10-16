export default function SearchBar({ value, onSearch, placeholder = 'Поиск…' }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        🔍
      </span>
      <input
        className="search-bar__input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onSearch(event.target.value)}
      />
      {value && (
        <button
          className="search-bar__clear"
          type="button"
          onClick={() => onSearch('')}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </div>
  );
}