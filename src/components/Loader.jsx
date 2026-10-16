export default function Loader({ text = 'Загрузка…' }) {
  return (
    <div className="loader">
      <span className="loader__spinner" aria-hidden="true" />
      <p className="loader__text">{text}</p>
    </div>
  );
}