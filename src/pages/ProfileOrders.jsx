import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/client.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ProfileOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        const data = await api.getUserOrders(user.id);
        if (!isCancelled) setOrders(data);
      } catch (error) {
        console.warn('Не удалось загрузить заказы:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [user.id]);

  if (isLoading) return <Loader text="Загружаем заказы…" />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="Заказов пока нет"
        description="Оформите первый заказ — он появится в этом разделе."
        action={
          <Link to="/catalog" className="btn btn--primary">
            Выбрать пластинку
          </Link>
        }
      />
    );
  }

  return (
    <ul className="orders">
      {orders.map((order) => (
        <li className="order" key={order.id}>
          <div>
            <p className="order__title">
              {Array.isArray(order.items) ? order.items.join(', ') : order.items}
            </p>
            <p className="order__meta">{order.createdAt}</p>
          </div>
          <div className="order__right">
            <span className="order__status">{order.status}</span>
            <span className="order__price">{order.total} ₽</span>
          </div>
        </li>
      ))}
    </ul>
  );
}