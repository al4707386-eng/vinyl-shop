import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';

export default function ProfileInfo() {
  const { user, favorites, updateName, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  
async function handleSave(event) {
  event.preventDefault();
  if (!name.trim()) return;

  const result = await updateName(name);
  if (result.ok) {
    setIsEditing(false);
  } else {
    alert('Не удалось сохранить имя: ' + (result.error || 'неизвестная ошибка'));
  }
}
  return (
    <div className="card">
      <h2 className="card__title">Данные аккаунта</h2>

      {isEditing ? (
        <form className="form form--inline" onSubmit={handleSave}>
          <label className="field">
            <span className="field__label">Имя</span>
            <input
              className="field__input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ваше имя"
            />
          </label>
          <div className="form__actions">
            <Button type="submit">Сохранить</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setName(user.name);
                setIsEditing(false);
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <>
          <dl className="specs">
            <div className="specs__row">
              <dt>Имя</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="specs__row">
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="specs__row">
              <dt>В избранном</dt>
              <dd>{favorites.length} пластинок</dd>
            </div>
          </dl>

          <div className="form__actions">
            <Button onClick={() => setIsEditing(true)}>Изменить имя</Button>
            <Button variant="danger" onClick={logout}>
              Выйти из аккаунта
            </Button>
          </div>
        </>
      )}
    </div>
  );
}