'use client';

import { useState } from 'react';
// Importa los iconos de Lucide que necesitas
import {
  Menu,
  LayoutDashboard,
  Users,
  UserPlus,
  RotateCw,
  CreditCard,
  UserCheck,
  Clock,
  Euro,
  LogOut,
} from 'lucide-react';

// Importa el logo (Ruta corregida)
// Nota: Tu logo es 'logo1.jpg' en tus archivos subidos, pero en el código usas 'logo1.png'.
// Mantengo 'logo1.png' según tu último código, pero asegúrate de que el nombre del archivo sea correcto.
import logo from '../../assets/img/logo.png';

import GestionSocios from './GestionSocios';
import RegistrarSocio from './RegistrarSocio';
import Renovaciones from './Renovaciones';
import ControlPagos from './ControlPagos';
import { useDashboard } from '../../hooks/useDashboard';
import { useSocios } from '../../hooks/useSocios';

export default function AdminDashboard() {
  const username = 'Admin';
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { stats, loading, error } = useDashboard();
  const { socios } = useSocios();

  const handleLogout = () => {
    window.location.href = '/login';
  };

  // Menú actualizado con componentes de iconos Lucide
  const menuItems = [
    { id: 'dashboard', Icon: LayoutDashboard, label: 'Panel Principal' },
    { id: 'socios', Icon: Users, label: 'Gestión de Socios' },
    { id: 'registro', Icon: UserPlus, label: 'Registrar Socio' },
    { id: 'renovaciones', Icon: RotateCw, label: 'Renovaciones' },
    { id: 'pagos', Icon: CreditCard, label: 'Control de Pagos' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'socios':
        return <GestionSocios />;
      case 'registro':
        return <RegistrarSocio />;
      case 'renovaciones':
        return <Renovaciones />;
      case 'pagos':
        return <ControlPagos />;
      case 'dashboard':
      default:
        return (
          <>
            <div className='mb-6'>
              <h2 className='font-bold text-3xl mb-1 text-black'>Dashboard</h2>
              <p className='text-gray-500 text-sm font-light'>
                Resumen general del sistema
              </p>
            </div>

            {loading && <p>Cargando estadísticas...</p>}
            {error && <p className='text-red-500'>{error}</p>}

            {stats && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
                {/* Tarjeta 1: Total Socios */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 hover:border-black transition-all duration-300'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide'>
                        Total Socios
                      </p>
                      <h2 className='text-4xl font-bold text-black'>
                        {stats.totalSocios}
                      </h2>
                    </div>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <Users className='w-5 h-5 text-gray-700' />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 2: Socios Activos */}
                <div className='bg-white text-black p-6 rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide'>
                        Socios Activos
                      </p>
                      <h2 className='text-4xl font-bold text-black'>
                        {stats.sociosActivos}
                      </h2>
                    </div>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <UserCheck className='w-5 h-5 text-gray-700' />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 3: Renovaciones Pendientes */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 hover:border-black transition-all duration-300'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide'>
                        Renovaciones
                      </p>
                      <h2 className='text-4xl font-bold text-black'>
                        {stats.renovacionesPendientes}
                      </h2>
                    </div>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <Clock className='w-5 h-5 text-gray-700' />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 4: Ingresos Totales */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 hover:border-black transition-all duration-300'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide'>
                        Ingresos Totales
                      </p>
                      <h2 className='text-3xl font-bold text-black'>
                        Bs{stats.ingresosTotales.toLocaleString()}
                      </h2>
                    </div>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <Euro className='w-5 h-5 text-gray-700' />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 5: Pagos Totales */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 hover:border-black transition-all duration-300'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide'>
                        Pagos Totales
                      </p>
                      <h2 className='text-4xl font-bold text-black'>
                        {stats.pagosTotales}
                      </h2>
                    </div>
                    <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                      <CreditCard className='w-5 h-5 text-gray-700' />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Socios Recientes */}
            <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='font-bold text-lg text-black'>
                  Socios Recientes
                </h3>
              </div>

              <div className='divide-y divide-gray-100'>
                {socios.slice(0, 10).map((socio) => {
                  // Crear iniciales para el avatar
                  const iniciales =
                    `${socio.nombres?.charAt(0) || ''}${
                      socio.apellidos?.charAt(0) || ''
                    }`.toUpperCase() || 'SN';

                  return (
                    <div
                      key={socio.id}
                      className='flex items-center justify-between p-5 hover:bg-gray-50 transition duration-200'
                    >
                      <div className='flex items-center'>
                        <div className='w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mr-4 font-bold text-sm border border-amber-200'>
                          {iniciales}
                        </div>

                        <div>
                          <h4 className='text-base font-semibold text-black'>
                            {socio.nombres || 'Sin nombre'}{' '}
                            {socio.apellidos || 'Sin apellido'}
                          </h4>
                          <p className='text-sm text-gray-500'>
                            {socio.profesion || 'Sin profesión'} •{' '}
                            {socio.cedulaIdentidad || 'Sin CI'}
                          </p>
                        </div>
                      </div>

                      <div>
                        {socio.estadoSocio === 'Activo' ? (
                          <span className='px-4 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200'>
                            Activo
                          </span>
                        ) : socio.estadoSocio === 'Inactivo' ? (
                          <span className='px-4 py-1.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200'>
                            Inactivo
                          </span>
                        ) : (
                          <span className='px-4 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200'>
                            {socio.estadoSocio || 'Desconocido'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {socios.length === 0 && !loading && (
                  <div className='p-5 text-center text-gray-500'>
                    No hay socios registrados
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className='flex h-screen w-full bg-white overflow-hidden'>
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
        style={{ flexShrink: 0 }}
      >
        <div className='p-6 flex flex-col h-full'>
          {/* LOGO (Logo más grande con texto institucional) */}
          <div className='mb-6 pb-5 border-b border-gray-100 flex justify-center'>
            <div
              className={sidebarOpen ? 'flex flex-col items-center' : 'hidden'}
            >
              {/* Logo con TAMAÑO GRANDE: w-48 h-48 */}
              <img
                src={logo}
                alt='Logo'
                className='w-48 h-48 object-contain mb-2'
              />
              <div className='text-center'>
                <p className='text-xs text-gray-400 font-normal mt-0.5'>
                  Sistema de Membresías
                </p>
              </div>
            </div>
          </div>

          <nav className='flex flex-col space-y-1 flex-grow'>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center px-4 py-3 font-medium rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-black border border-gray-200'
                }`}
              >
                {/* Uso del componente Icon de Lucide */}
                <item.Icon
                  className={`w-5 h-5 mr-3 ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-500 group-hover:text-black'
                  }`}
                />
                <span className='text-sm'>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-grow flex flex-col w-full overflow-y-auto'>
        {/* Header */}
        <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
          <div className='flex items-center justify-between px-8 py-4'>
            <button
              className='p-2 rounded-lg transition duration-200 bg-white text-black hover:bg-gray-100'
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {/* Icono Lucide para alternar la barra lateral */}
              <Menu className='w-6 h-6' />
            </button>

            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <div className='font-semibold text-sm text-black'>
                  Administrador
                </div>
                <div className='text-xs text-gray-400'>{username}</div>
              </div>
              <button
                className='p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200 flex items-center justify-center'
                onClick={handleLogout}
              >
                <LogOut className='w-6 h-6' />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className='p-8 space-y-8 bg-gray-50'>{renderContent()}</div>
      </div>
    </div>
  );
}
