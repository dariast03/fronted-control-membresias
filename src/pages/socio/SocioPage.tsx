'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useMembresias } from '../../hooks/useMembresias';
import { useAuth } from '../../hooks/useAuth';
import { usePagos } from '../../hooks/usePagos';
import { usePlanes } from '../../hooks/usePlanes';

export default function SocioPage() {
  const navigate = useNavigate();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    usuarioId: '',
    membresiaId: '',
    monto: 0,
    metodoPago: 'tarjeta',
  });
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const { membresia, loading, error, renovarMembresia, fetchMembresia } =
    useMembresias();
  const { user, logout } = useAuth();
  const { registrarPago } = usePagos();
  const { planes } = usePlanes();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRenew = async () => {
    if (!membresia || !user) return;
    const planActual = planes.find((p) => p.nombre === membresia.planNombre);
    const precio = planActual?.precio || membresia.monto;
    try {
      await renovarMembresia(membresia.id);
      setPaymentData({
        usuarioId: user.id,
        membresiaId: membresia.id,
        monto: precio,
        metodoPago: 'tarjeta',
      });
      setShowRenewModal(false);
      setShowPaymentModal(true);
    } catch (err) {
      alert('Error al renovar membresía');
    }
  };

  const handlePayment = async (metodo: string) => {
    if (metodo === 'tarjeta') {
      if (
        !cardData.number ||
        !cardData.name ||
        !cardData.expiry ||
        !cardData.cvv
      ) {
        alert('Completa todos los datos de la tarjeta');
        return;
      }
    }
    try {
      await registrarPago({ ...paymentData, metodoPago: metodo });
      await fetchMembresia();
      setShowPaymentModal(false);
      alert('Pago registrado exitosamente. Membresía renovada.');
    } catch (err) {
      alert('Error en el pago');
    }
  };

  const isExpired = true;

  return (
    <div className='min-h-screen bg-background'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-2 font-bold text-lg'>
              <a
                href='#inicio'
                className='flex items-center gap-2 font-bold text-lg'
              >
                <img
                  src={logo}
                  alt='Logo'
                  className='h-12 w-12 object-contain rounded-full'
                />
                Panel de Socio
              </a>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <p className='text-sm font-semibold'>Bienvenido</p>
                <p className='text-sm text-muted-foreground'>
                  {user?.nombres || 'Socio'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                    clipRule='evenodd'
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Dashboard de Socio</h1>
          <p className='text-muted-foreground'>
            Gestiona tu membresía y accede a tus beneficios
          </p>
        </div>

        {loading && <p>Cargando membresía...</p>}
        {error && <p className='text-red-500'>{error}</p>}

        {membresia && (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow'>
              <div className='flex items-start justify-between mb-4'>
                <div className='w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    membresia.estado === 'Activa'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {membresia.estado}
                </span>
              </div>
              <h3 className='text-lg font-bold mb-2'>Estado de Membresía</h3>
              <p className='text-muted-foreground text-sm'>
                {isExpired
                  ? 'Tu membresía ha expirado'
                  : 'Tu membresía está activa'}
              </p>
              {isExpired && (
                <button
                  onClick={() => setShowRenewModal(true)}
                  className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  Renovar Membresía
                </button>
              )}
            </div>

            <div className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold mb-2'>Fecha de Fin</h3>
              <p className='text-2xl font-bold text-blue-600 mb-1'>
                {new Date(membresia.fechaFin).toLocaleDateString()}
              </p>
              <p className='text-muted-foreground text-sm'>
                {isExpired
                  ? 'Expirada'
                  : `Faltan ${Math.ceil(
                      (new Date(membresia.fechaFin).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} días`}
              </p>
            </div>

            <div className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow'>
              <div className='w-12 h-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center mb-4'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                  <path
                    fillRule='evenodd'
                    d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-bold mb-2'>Plan</h3>
              <p className='text-2xl font-bold text-green-600 mb-1'>
                {membresia.planNombre}
              </p>
              <p className='text-muted-foreground text-sm'>
                Monto: $
                {planes.find((p) => p.nombre === membresia.planNombre)
                  ?.precio || membresia.monto}
              </p>
            </div>
          </div>
        )}

        <div className='mt-8 bg-card border border-border rounded-xl p-6'>
          <h2 className='text-xl font-bold mb-4'>Información Personal</h2>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-semibold text-muted-foreground mb-2'>
                Nombre Completo
              </label>
              <p className='text-lg'>
                {user?.nombres} {user?.apellidos}
              </p>
            </div>
            <div>
              <label className='block text-sm font-semibold text-muted-foreground mb-2'>
                Email
              </label>
              <p className='text-lg'>{user?.email}</p>
            </div>
            <div>
              <label className='block text-sm font-semibold text-muted-foreground mb-2'>
                Estado
              </label>
              <p className='text-lg'>{user?.rol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Renovación */}
      {showRenewModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-card rounded-xl shadow-xl max-w-md w-full p-6'>
            <h3 className='text-xl font-bold mb-4'>Renovar Membresía</h3>
            <p className='text-muted-foreground mb-6'>
              ¿Estás seguro de que quieres renovar tu membresía? Se enviará una
              solicitud de renovación.
            </p>
            <div className='flex gap-4'>
              <button
                onClick={handleRenew}
                className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'
              >
                Continuar al Pago
              </button>
              <button
                onClick={() => setShowRenewModal(false)}
                className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-card rounded-xl shadow-xl max-w-md w-full p-6'>
            <h3 className='text-xl font-bold mb-4'>Procesar Pago</h3>
            <p className='text-muted-foreground mb-6'>
              Monto a pagar: ${paymentData.monto}
            </p>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Método de Pago
                </label>
                <select
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      metodoPago: e.target.value,
                    }))
                  }
                  value={paymentData.metodoPago}
                >
                  <option value='tarjeta'>Tarjeta</option>
                  <option value='transferencia'>Transferencia</option>
                </select>
              </div>
              {paymentData.metodoPago === 'tarjeta' && (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Número de Tarjeta
                    </label>
                    <input
                      type='text'
                      placeholder='1234 5678 9012 3456'
                      value={cardData.number}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          number: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-2'>
                      Nombre en la Tarjeta
                    </label>
                    <input
                      type='text'
                      placeholder='Juan Pérez'
                      value={cardData.name}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Fecha de Vencimiento
                      </label>
                      <input
                        type='text'
                        placeholder='MM/AA'
                        value={cardData.expiry}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            expiry: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        CVV
                      </label>
                      <input
                        type='text'
                        placeholder='123'
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className='flex gap-4'>
                <button
                  onClick={() => handlePayment(paymentData.metodoPago)}
                  className='flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700'
                >
                  Pagar
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400'
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
