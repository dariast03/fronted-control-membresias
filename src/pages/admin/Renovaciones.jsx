import React, { useState, useEffect } from 'react';

// --- CONSTANTES Y HELPERS ---

// URL de la API simulada
const API_BASE_URL = 'https://localhost:7249/api/Docente/renovaciones'; 
const generateRandomId = () => Math.floor(Math.random() * 1000000) + 1000;

// Datos de MOCK
const MOCK_RENOVACIONES_DATA = [
  {
    id: 1,
    nombre: 'Elena Sánchez Torres',
    codigo: 'COL-2023-006',
    profesion: 'Ingeniera Civil',
    fechaVencimiento: '18/12/2025',
    diasRestantes: 54,
    cuotaAnual: 500.00,
    estado: 'proximo',
    avatar: 'ES'
  },
  {
    id: 2,
    nombre: 'Pedro Martínez Ruiz',
    codigo: 'COL-2023-007',
    profesion: 'Arquitecto',
    fechaVencimiento: '05/11/2025',
    diasRestantes: 11,
    cuotaAnual: 500.00,
    estado: 'urgente',
    avatar: 'PM'
  },
  {
    id: 3,
    nombre: 'Laura Gómez Díaz',
    codigo: 'COL-2023-008',
    profesion: 'Ingeniera Industrial',
    fechaVencimiento: '22/11/2025',
    diasRestantes: 28,
    cuotaAnual: 500.00,
    estado: 'proximo',
    avatar: 'LG'
  },
  {
    id: 4,
    nombre: 'Carlos Rodríguez Martín',
    codigo: 'COL-2023-003',
    profesion: 'Ingeniero Industrial',
    fechaVencimiento: '10/03/2025',
    diasRestantes: -229,
    cuotaAnual: 500.00,
    estado: 'vencido',
    avatar: 'CR'
  },
  {
    id: 5,
    nombre: 'Ana López Fernández',
    codigo: 'COL-2023-009',
    profesion: 'Arquitecta',
    fechaVencimiento: '15/12/2025',
    diasRestantes: 51,
    cuotaAnual: 500.00,
    estado: 'proximo',
    avatar: 'AL'
  }
];

// Función para formatear a Bolivianos (Bs)
const formatBolivianos = (amount) => {
    return amount.toLocaleString('es-BO', { 
        style: 'currency', 
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).replace('BOB', 'Bs').trim();
};

// --- SUB-COMPONENTE MODAL (Integrado) ---

const RenovacionModal = ({ isOpen, onClose, renovacion, onRenovacionExitosa }) => {
    const [metodoPago, setMetodoPago] = useState('Transferencia');
    const [planCuota, setPlanCuota] = useState('Anual');
    const [montoPagar, setMontoPagar] = useState(renovacion?.cuotaAnual || 0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (renovacion) {
            const baseCuota = renovacion.cuotaAnual;
            if (planCuota === 'Anual') {
                setMontoPagar(baseCuota);
            } else if (planCuota === 'Semestral') {
                setMontoPagar(baseCuota / 2 + 50); 
            } else {
                setMontoPagar(baseCuota); 
            }
        }
    }, [renovacion, planCuota]);

    if (!isOpen || !renovacion) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // SIMULACIÓN DE LLAMADA AL BACKEND (.NET) para registrar la transacción
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const transaccionData = {
                socioId: renovacion.id,
                monto: montoPagar,
                plan: planCuota,
                metodo: metodoPago,
                referencia: `TRANS-${generateRandomId()}`,
            };

            setSuccess(true);

            setTimeout(() => {
                onRenovacionExitosa(renovacion.id, transaccionData);
            }, 1000);

        } catch (err) {
            setError('Error al procesar la renovación. Intente de nuevo.');
            setLoading(false);
        }
    };

    const currentAction = renovacion.estado === 'vencido' ? 'Reactivación' : 'Renovación';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-black">{currentAction} de Membresía</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Información del Socio */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">Socio: <span className="font-bold text-black">{renovacion.nombre}</span></p>
                        <p className="text-xs text-gray-500">Vencimiento Anterior: {renovacion.fechaVencimiento}</p>
                    </div>

                    {/* Opciones de Plan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Plan de Cuota</label>
                        <select
                            value={planCuota}
                            onChange={(e) => setPlanCuota(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                            disabled={loading}
                        >
                            <option value="Anual">Anual ({formatBolivianos(renovacion.cuotaAnual)})</option>
                            <option value="Semestral">Semestral ({formatBolivianos(renovacion.cuotaAnual / 2 + 50)})</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Seleccionar el plan define el monto a pagar.</p>
                    </div>
                    
                    {/* Opciones de Método de Pago */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                        <select
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
                            disabled={loading}
                        >
                            <option value="Transferencia">Transferencia Bancaria</option>
                            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="Efectivo">Efectivo (en oficina)</option>
                        </select>
                    </div>

                    {/* Monto Final */}
                    <div className="text-center p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-700">Monto Final a Pagar:</p>
                        <p className="text-3xl font-bold text-black">{formatBolivianos(montoPagar)}</p>
                    </div>

                    {/* Mensajes de Estado */}
                    {error && (
                        <div className="p-3 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-green-600 border border-green-200 bg-green-50 rounded-lg">
                            ✅ ¡{currentAction} exitosa! Registrando en el historial.
                        </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 text-sm font-medium rounded-lg text-white transition ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                            }`}
                            disabled={loading || success}
                        >
                            {loading ? 'Procesando...' : `${currentAction} y Pagar`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---

export default function Renovaciones() {
  const [renovaciones, setRenovaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('proximos');
  
  // Estados para el Modal de Renovación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRenovacion, setSelectedRenovacion] = useState(null);

  // Estados para el Recordatorio 
  const [sendingReminderId, setSendingReminderId] = useState(null);
  const [reminderSuccessMessage, setReminderSuccessMessage] = useState(null);

  // Función para simular la conexión al backend
  const fetchRenovaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRenovaciones(MOCK_RENOVACIONES_DATA);
    } catch (err) {
      setError('No se pudo conectar al servidor de renovaciones. Usando datos de ejemplo.');
      setRenovaciones(MOCK_RENOVACIONES_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Función para simular el envío de recordatorio
  const handleSendReminder = async (renovacion) => {
    setSendingReminderId(renovacion.id);
    setReminderSuccessMessage(null);
    
    try {
        // SIMULACIÓN DE LLAMADA AL BACKEND
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        
        const message = `📧 Recordatorio enviado a ${renovacion.nombre} (${renovacion.codigo}).`;
        setReminderSuccessMessage(message);

    } catch (err) {
        setReminderSuccessMessage('❌ Error al enviar el recordatorio. Intente nuevamente.');
    } finally {
        setSendingReminderId(null);
        // Limpiar el mensaje de éxito después de 4 segundos
        setTimeout(() => {
            setReminderSuccessMessage(null);
        }, 4000);
    }
  };


  useEffect(() => {
    fetchRenovaciones();
  }, []);
  
  // Manejadores del Modal
  const openRenovacionModal = (renovacion) => {
    setSelectedRenovacion(renovacion);
    setIsModalOpen(true);
  };

  const closeRenovacionModal = () => {
    setIsModalOpen(false);
    setSelectedRenovacion(null);
  };

  // Lógica después de una renovación exitosa
  const handleRenovacionExitosa = (id, transaccionData) => {
    setRenovaciones(prev => 
      // Filtramos la renovación exitosa de la lista de pendientes
      prev.filter(r => r.id !== id) 
    );
    // Cerramos el modal
    setTimeout(() => {
        closeRenovacionModal();
    }, 500);
  };

  const filteredRenovaciones = renovaciones.filter(r => {
    if (filterType === 'todos') return r.estado !== 'pagado'; 
    if (filterType === 'urgente') return r.estado === 'urgente';
    if (filterType === 'proximos') return r.estado === 'proximo';
    if (filterType === 'vencidos') return r.estado === 'vencido';
    return r.estado === 'proximo'; // Filtro por defecto
  });

  const getEstadoBadge = (estado) => {
    const styles = {
      'urgente': 'bg-red-50 text-red-700 border border-red-200',
      'proximo': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'vencido': 'bg-gray-100 text-gray-600 border border-gray-200',
      'pagado': 'bg-green-50 text-green-700 border border-green-200'
    };
    return styles[estado] || '';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      'urgente': 'Urgente',
      'proximo': 'Próximo',
      'vencido': 'Vencido',
      'pagado': 'Pagado'
    };
    return labels[estado] || '';
  };

  const totalUrgente = renovaciones.filter(r => r.estado === 'urgente').length;
  const totalProximo = renovaciones.filter(r => r.estado === 'proximo').length;
  const totalVencido = renovaciones.filter(r => r.estado === 'vencido').length;
  
  const totalEsperado = renovaciones
    .filter(r => r.estado !== 'vencido')
    .reduce((acc, r) => acc + r.cuotaAnual, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
        <p className="text-lg text-gray-700">Cargando datos de renovaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-3xl mb-1 text-black">Renovaciones</h2>
        <p className="text-gray-500 text-sm font-light">Gestión de renovaciones y vencimientos de membresías</p>
        
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
          ⚠️ Advertencia de Conexión: {error}
        </div>
      )}

      {/* Mensaje de éxito del recordatorio */}
      {reminderSuccessMessage && (
         <div className="p-3 text-sm text-green-600 border border-green-200 bg-green-50 rounded-lg transition-opacity duration-300">
            {reminderSuccessMessage}
        </div>
      )}

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ... (Contenido de las tarjetas de resumen) ... */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{totalUrgente}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Urgentes</div>
            <div className="text-xs text-gray-400 mt-1">{'<'} 15 días</div>
          </div>
          </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{totalProximo}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Próximos</div>
            <div className="text-xs text-gray-400 mt-1">15-60 días</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{totalVencido}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Vencidos</div>
            <div className="text-xs text-gray-400 mt-1">Sin renovar</div>
          </div>
        </div>

        <div className="bg-black text-white p-5 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatBolivianos(totalEsperado)}</div>
            <div className="text-xs text-gray-300 mt-1 uppercase tracking-wide">Esperado</div>
            <div className="text-xs text-gray-400 mt-1">{totalUrgente + totalProximo} Renovaciones</div>
          </div>
        </div>
      </div>
      
      {/* Tabla y Filtros */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="font-bold text-lg text-black">Lista de Renovaciones</h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'todos'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('urgente')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'urgente'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Urgentes ({totalUrgente})
            </button>
            <button
              onClick={() => setFilterType('proximos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'proximos'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Próximos ({totalProximo})
            </button>
            <button
              onClick={() => setFilterType('vencidos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'vencidos'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Vencidos ({totalVencido})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Socio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profesión</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vencimiento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Días Restantes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cuota</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRenovaciones.map((renovacion) => (
                <tr key={renovacion.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {/* Iniciales de color Beige */}
                      <div className="w-10 h-10 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full flex items-center justify-center mr-3 font-bold text-xs flex-shrink-0">
                        {renovacion.avatar}
                      </div>
                      <div className="text-sm font-semibold text-black">{renovacion.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-medium">{renovacion.codigo}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{renovacion.profesion}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{renovacion.fechaVencimiento}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-semibold ${
                      renovacion.diasRestantes < 0 ? 'text-gray-500' :
                      renovacion.diasRestantes <= 15 ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {renovacion.diasRestantes < 0 ? `Vencido hace ${Math.abs(renovacion.diasRestantes)} días` : `${renovacion.diasRestantes} días`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-black">{formatBolivianos(renovacion.cuotaAnual)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(renovacion.estado)}`}>
                      {getEstadoLabel(renovacion.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {/* Botón Renovar/Reactivar: FONDO GRIS CLARO, Texto Negro, SIN BORDE */}
                      <button 
                        onClick={() => openRenovacionModal(renovacion)}
                        // Clases modificadas: bg-gray-200, text-black, eliminada la clase 'border'
                        className="px-4 py-1.5 text-xs font-medium bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-200">
                        {renovacion.estado === 'vencido' ? 'Reactivar' : 'Renovar'}
                      </button>
                      
                      {/* Botón de Recordatorio (sin cambios) */}
                      <button 
                        onClick={() => handleSendReminder(renovacion)}
                        disabled={sendingReminderId === renovacion.id}
                        className="p-2 bg-white text-blue-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-wait" 
                        title="Enviar recordatorio"
                      >
                        {sendingReminderId === renovacion.id ? (
                            // Spinner de carga
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            // Ícono de Correo
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        )}
                      </button>
                  </div>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRenovaciones.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-2">📋</div>
            <p className="text-gray-500 text-sm">No hay renovaciones en esta categoría</p>
          </div>
        )}
      </div>
      
      {/* Integración del Modal */}
      <RenovacionModal
        isOpen={isModalOpen}
        onClose={closeRenovacionModal}
        renovacion={selectedRenovacion}
        onRenovacionExitosa={handleRenovacionExitosa}
      />
    </div>
  );
}