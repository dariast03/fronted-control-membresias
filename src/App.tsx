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
import AdminDashboard from './pages/admin/AdminDashboard';

// Componente para proteger las rutas basado en el rol del usuario
const ProtectedRoute = ({
  roleRequired,
  children,
}: {
  roleRequired: string;
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  // Si está autenticado pero no tiene el rol correcto, redirigir según el rol actual
  const role = user?.rol || '';
  if (role !== roleRequired) {
    // Si es admin intentando acceder a socio, o viceversa
    if (role === 'Admin') {
      return <Navigate to='/admin' />;
    } else if (role === 'Socio') {
      return <Navigate to='/socio' />;
    } else {
      return <Navigate to='/login' />;
    }
  }

  return <>{children}</>;
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
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}
