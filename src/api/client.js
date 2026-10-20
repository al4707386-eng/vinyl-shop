const API_URL = 'https://vinyl-backend.layero.app/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Ошибка ${response.status}`);
  }

  return data;
}

export const api = {
  register: (payload) =>
    request('/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    request('/login', { method: 'POST', body: JSON.stringify(payload) }),

  updateUser: (id, payload) =>
    request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getRecords: () => request('/records'),
  getRecord: (id) => request(`/records/${id}`),

  createOrder: (payload) =>
    request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getUserOrders: (userId) => request(`/orders/user/${userId}`),

  getFavorites: (userId) => request(`/favorites/${userId}`),
  addFavorite: (userId, recordId) =>
    request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, recordId }),
    }),
  removeFavorite: (userId, recordId) =>
    request(`/favorites/${userId}/${recordId}`, { method: 'DELETE' }),
};

export function imageUrl(path) {
  if (!path) return '';
  return `http://localhost:3000${path}`;
}