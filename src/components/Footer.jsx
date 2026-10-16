import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__copy">
          Vinyl<strong>Room</strong>
        </p>
        <nav className="footer__nav">
          <Link to="/">Главная</Link>
          <Link to="/catalog">Каталог</Link>
          <Link to="/login">Войти</Link>
        </nav>
      </div>
    </footer>
  );
}