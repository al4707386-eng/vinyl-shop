import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || '/profile';

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

async function handleSubmit(event) {
  event.preventDefault();

  if (!form.email.trim() || !form.password) {
    setError('Заполните email и пароль');
    return;
  }

  const result = await login(form);
  if (!result.ok) {
    setError(result.error);
    return;
  }

  setError('');
  navigate(redirectTo, { replace: true });
}

  return (
    <div className="page page--narrow">
      <h1 className="page__title">Вход</h1>
      <p className="page__subtitle">Войдите, чтобы продолжить покупки</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {error && <p className="form__error form__error--banner">{error}</p>}

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className="field__input"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label className="field">
          <span className="field__label">Пароль</span>
          <input
            className="field__input"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ваш пароль"
          />
        </label>

        <Button type="submit" className="btn--block">
          Войти
        </Button>

        <p className="form__footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}