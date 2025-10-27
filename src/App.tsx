import type React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
//import AdminDashboard from './pages/admin/AdminDashboard';
import SocioPage from './pages/socio/SocioPage';
import LandingPage from './pages/LandingPage';
import RegistroPage from './pages/registro/RegistroPage';
import { useAuth } from './hooks/useAuth';

// Componente para proteger las rutas basado en el rol del usuario
const ProtectedRoute = ({
  roleRequired,
  children,
}: {
  roleRequired: string;
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const role = user?.rol || '';
  return role === roleRequired ? <>{children}</> : <Navigate to='/login' />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegistroPage />} />

        <Route
          path='/socio'
          element={
            <ProtectedRoute roleRequired='Socio'>
              <SocioPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/admin'
          element={
            <ProtectedRoute roleRequired='Admin'>
              CREAR COMPONEWNTE ADMIN DASHBOARD
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}
