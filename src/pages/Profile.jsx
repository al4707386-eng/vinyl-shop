import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, favorites } = useAuth();

  return (
    <div className="page">
      <header className="profile-head">
        <div className="profile-head__avatar" aria-hidden="true">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="page__title">Личный кабинет</h1>
          <p className="page__subtitle">{user.email}</p>
        </div>
      </header>

      <nav className="tabs">
        <NavLink to="/profile" end className="tabs__link">
          Профиль
        </NavLink>
        <NavLink to="/profile/favorites" className="tabs__link">
          Избранное ({favorites.length})
        </NavLink>
        <NavLink to="/profile/orders" className="tabs__link">
          Мои заказы
        </NavLink>
      </nav>

      <section className="profile-content">
        <Outlet />
      </section>
    </div>
  );
}