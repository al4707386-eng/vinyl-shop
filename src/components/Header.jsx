import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function Header() {
  const { user, logout, favorites } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setIsLogoutOpen(false);
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">
          <span className="logo__disc" aria-hidden="true" />
          <span className="logo__text">
            Vinyl<strong>Room</strong>
          </span>
        </Link>

        <button
          className="burger"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Меню"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '×' : '☰'}
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav--open' : ''}`}>
          <NavLink to="/" end className="nav__link">
            Главная
          </NavLink>
          <NavLink to="/catalog" className="nav__link">
            Каталог
          </NavLink>

          {/* Интерфейс шапки зависит от статуса авторизации */}
          {user ? (
            <>
              <NavLink to="/profile" className="nav__link">
                Кабинет
                {favorites.length > 0 && (
                  <span className="nav__counter">{favorites.length}</span>
                )}
              </NavLink>
              <div className="nav__auth">
                <span className="nav__user">Привет, {user.name}</span>
                <Button variant="ghost" onClick={() => setIsLogoutOpen(true)}>
                  Выйти
                </Button>
              </div>
            </>
          ) : (
            <div className="nav__auth">
              <NavLink to="/login" className="nav__link">
                Войти
              </NavLink>
              <NavLink to="/register" className="btn btn--primary btn--sm">
                Регистрация
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      <Modal
        isOpen={isLogoutOpen}
        title="Выход из аккаунта"
        onClose={() => setIsLogoutOpen(false)}
      >
        <p>Вы действительно хотите выйти?</p>
        <div className="modal__actions">
          <Button variant="ghost" onClick={() => setIsLogoutOpen(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </Modal>
    </header>
  );
}