import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [agreement, setAgreement] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Клиентская валидация: пустые поля, формат email, совпадение паролей, галочка
  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Введите имя';
    if (!form.email.trim()) {
      nextErrors.email = 'Введите email';
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = 'Email выглядит некорректно';
    }
    if (!form.password) {
      nextErrors.password = 'Введите пароль';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Минимум 6 символов';
    }
    if (!form.confirm) {
      nextErrors.confirm = 'Повторите пароль';
    } else if (form.password !== form.confirm) {
      nextErrors.confirm = 'Пароли не совпадают';
    }
    // Проверка обязательной галочки согласия
    if (!agreement) {
      nextErrors.agreement = 'Необходимо согласие на обработку персональных данных';
    }

    return nextErrors;
  }
  
async function handleSubmit(event) {
  event.preventDefault();

  const nextErrors = validate();
  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) return;

  const result = await register(form);
  if (!result.ok) {
    setErrors({ form: result.error });
    return;
  }

  navigate('/profile');
}

  return (
    <div className="page page--narrow">
      <h1 className="page__title">Регистрация</h1>
      <p className="page__subtitle">
        Создайте аккаунт, чтобы оформлять заказы и вести избранное
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="form__error form__error--banner">{errors.form}</p>
        )}

        <label className="field">
          <span className="field__label">Имя</span>
          <input
            className={`field__input ${errors.name ? 'field__input--error' : ''}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Как к вам обращаться"
          />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>

        <label className="field">
          <span className="field__label">Email</span>
          <input
            className={`field__input ${errors.email ? 'field__input--error' : ''}`}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>

        <label className="field">
          <span className="field__label">Пароль</span>
          <input
            className={`field__input ${errors.password ? 'field__input--error' : ''}`}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Минимум 6 символов"
          />
          {errors.password && (
            <span className="field__error">{errors.password}</span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Повторите пароль</span>
          <input
            className={`field__input ${errors.confirm ? 'field__input--error' : ''}`}
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Ещё раз"
          />
          {errors.confirm && (
            <span className="field__error">{errors.confirm}</span>
          )}
        </label>

        {/* Чекбокс согласия с обработкой персональных данных */}
        <label className="checkbox">
          <input
            type="checkbox"
            className="checkbox__input"
            checked={agreement}
            onChange={(event) => setAgreement(event.target.checked)}
          />
          <span className="checkbox__box" aria-hidden="true" />
          <span className="checkbox__text">
            Я согласен(-на) с{' '}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="checkbox__link"
            >
              политикой обработки персональных данных
            </Link>
          </span>
        </label>
        {errors.agreement && (
          <span className="field__error">{errors.agreement}</span>
        )}

        <Button type="submit" className="btn--block">
          Зарегистрироваться
        </Button>

        <p className="form__footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}