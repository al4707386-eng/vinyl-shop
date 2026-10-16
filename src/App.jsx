import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import RecordPage from './pages/RecordPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Privacy from './pages/Privacy.jsx';
import Profile from './pages/Profile.jsx';
import ProfileInfo from './pages/ProfileInfo.jsx';
import ProfileFavorites from './pages/ProfileFavorites.jsx';
import ProfileOrders from './pages/ProfileOrders.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />

        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            {/* Динамический параметр :id */}
            <Route path="/catalog/:id" element={<RecordPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<Privacy />} /> 

            {/* Защищённый маршрут с вложенными подразделами */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileInfo />} />
              <Route path="favorites" element={<ProfileFavorites />} />
              <Route path="orders" element={<ProfileOrders />} />
            </Route>

            {/* 404 для всех остальных адресов */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;