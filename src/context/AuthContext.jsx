import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

const SESSION_KEY = 'vinyl_shop_session';

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadFavorites() {
      try {
        const ids = await api.getFavorites(user.id);
        if (!isCancelled) setFavorites(ids);
      } catch (error) {
        console.warn('Не удалось загрузить избранное:', error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadFavorites();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  async function register({ name, email, password }) {
    try {
      const created = await api.register({ name, email, password });
      setUser({ id: created.id, name: created.name, email: created.email });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function login({ email, password }) {
    try {
      const logged = await api.login({ email, password });
      setUser({ id: logged.id, name: logged.name, email: logged.email });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function logout() {
    setUser(null);
    setFavorites([]);
  }

  async function updateName(name) {
    const trimmed = name.trim();
    if (!trimmed || !user) return { ok: false };

    try {
      await api.updateUser(user.id, { name: trimmed });
      setUser((prev) => ({ ...prev, name: trimmed }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function toggleFavorite(recordId) {
    if (!user) return;

    const isFav = favorites.includes(recordId);

    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== recordId) : [...prev, recordId]
    );

    try {
      if (isFav) {
        await api.removeFavorite(user.id, recordId);
      } else {
        await api.addFavorite(user.id, recordId);
      }
    } catch (error) {
      setFavorites((prev) =>
        isFav ? [...prev, recordId] : prev.filter((id) => id !== recordId)
      );
      console.warn('Не удалось обновить избранное:', error);
    }
  }

  const value = {
    user,
    favorites,
    isLoading,
    register,
    login,
    logout,
    updateName,
    toggleFavorite,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}