import React, { useState, useEffect } from 'react';

// Se usa la URL que proporcionaste como ejemplo para simular la conexión.
const API_BASE_URL = 'https://localhost:7249/api/Docente/pagos'; 

// Datos de MOCK ajustados: todos los pagos están en estado 'pagado'.
const MOCK_PAGOS_DATA = [
  {
    id: 1,
    socio: 'Juan Pérez García',
    codigo: 'COL-2023-001',
    referencia: 'PAG-2025-001',
    monto: 500.00,
    fecha: '15/01/2025',
    concepto: 'Cuota Anual 2025',
    metodoPago: 'Transferencia',
    estado: 'pagado', 
    avatar: 'JP'
  },
  {
    id: 2,
    socio: 'María González López',
    codigo: 'COL-2023-002',
    referencia: 'PAG-2025-002',
    monto: 500.00,
    fecha: '20/02/2025',
    concepto: 'Cuota Anual 2025',
    metodoPago: 'Domiciliación',
    estado: 'pagado',
    avatar: 'MG'
  },
  {
    id: 3,
    socio: 'Carlos Rodríguez Martín',
    codigo: 'COL-2023-003',
    referencia: 'PAG-2025-003',
    monto: 500.00,
    fecha: '10/03/2025',
    vencimiento: '10/03/2025',
    concepto: 'Cuota Anual 2025',
    metodoPago: 'Transferencia',
    estado: 'pagado', 
    avatar: 'CR'
  },
  {
    id: 4,
    socio: 'Ana Martínez Silva',
    codigo: 'COL-2023-004',
    referencia: 'PAG-2025-004',
    monto: 140.50,
    fecha: '05/04/2025',
    concepto: 'Cuota Trimestral Q2',
    metodoPago: 'Tarjeta',
    estado: 'pagado',
    avatar: 'AM'
  },
  {
    id: 5,
    socio: 'Luis Fernández Ruiz',
    codigo: 'COL-2023-005',
    referencia: 'PAG-2025-005',
    monto: 50.00,
    fecha: '12/05/2025',
    concepto: 'Cuota Mensual Mayo',
    metodoPago: 'Efectivo',
    estado: 'pagado',
    avatar: 'LF'
  },
  {
    id: 6,
    socio: 'Elena Sánchez Torres',
    codigo: 'COL-2023-006',
    referencia: 'PAG-2025-006',
    monto: 270.00,
    fecha: '18/06/2025',
    vencimiento: '01/11/2025',
    concepto: 'Cuota Semestral S2',
    metodoPago: 'Transferencia',
    estado: 'pagado', 
    avatar: 'ES'
  },
  {
    id: 7,
    socio: 'Pedro Martínez Ruiz',
    codigo: 'COL-2023-007',
    referencia: 'PAG-2025-007',
    monto: 500.00,
    fecha: '05/07/2025',
    vencimiento: '05/10/2025',
    concepto: 'Cuota Anual 2025',
    metodoPago: 'Domiciliación',
    estado: 'pagado', 
    avatar: 'PM'
  }
];

export default function ControlPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPagos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 800));
      setPagos(MOCK_PAGOS_DATA);
    } catch (err) {
      setError('No se pudo conectar al servidor de pagos. Usando datos de ejemplo.');
      setPagos(MOCK_PAGOS_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const filteredPagos = pagos.filter(pago => {
    const matchesSearch = pago.socio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.referencia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || pago.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const getEstadoBadge = (estado) => {
    const styles = {
      'pagado': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'pendiente': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      'vencido': 'bg-red-50 text-red-700 border border-red-200'
    };
    return styles[estado] || '';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      'pagado': 'Pagado',
      'pendiente': 'Pendiente',
      'vencido': 'Vencido'
    };
    return labels[estado] || '';
  };
  
  const formatBolivianos = (amount) => {
    return amount.toLocaleString('es-BO', { 
        style: 'currency', 
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).replace('BOB', 'Bs').trim();
  };

  // Función para manejar la descarga del recibo
  const handleDownloadReceipt = (pago) => {
    // 1. Formatear el contenido del recibo (como texto plano con formato)
    // Se utilizan saltos de línea y espacios para simular un documento.
    const receiptContent = `
==============================================
    RECIBO DE PAGO - COLEGIO DE INGENIEROS
==============================================
    Documento generado automáticamente
    
Referencia de Pago: ${pago.referencia}
Código de Socio: ${pago.codigo}

Socio: ${pago.socio}

----------------------------------------------
Concepto: ${pago.concepto}
Fecha de Pago: ${pago.fecha}
Monto Pagado: ${formatBolivianos(pago.monto)}
Método de Pago: ${pago.metodoPago}
Estado: ${getEstadoLabel(pago.estado)}
${pago.vencimiento ? 'Fecha de Vencimiento: ' + pago.vencimiento : ''}
----------------------------------------------

Este documento sirve como prueba de pago.
`;

    // 2. Crear un Blob (objeto de archivo) con el tipo MIME para MS Word
    const blob = new Blob([receiptContent], { type: 'application/msword;charset=utf-8' });

    // 3. Crear una URL temporal y un enlace
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Se usa la extensión .doc (Microsoft Word)
    a.download = `Recibo_${pago.referencia}.doc`; 

    // 4. Disparar la descarga
    document.body.appendChild(a);
    a.click();

    // 5. Limpiar la URL temporal y el elemento 'a'
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((acc, p) => acc + p.monto, 0);
  const totalGeneral = pagos.reduce((acc, p) => acc + p.monto, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
        <p className="text-lg text-gray-700">Cargando datos de pagos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-3xl mb-1 text-black">Historial de Pagos Realizados</h2>
          <p className="text-gray-500 text-sm font-light">Registro de todas las cuotas pagadas.</p>
        </div>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
          ⚠️ Advertencia de Conexión: {error}
        </div>
      )}

      {/* Panel Superior: Solo se muestra el Total */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="bg-black text-white p-5 rounded-xl shadow-xl col-span-1 md:col-start-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatBolivianos(totalGeneral)}</div>
            <div className="text-xs text-gray-300 mt-1 uppercase tracking-wide">Total Registrado</div>
            <div className="text-xs text-gray-400 mt-1">{pagos.length} pagos registrados</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2"> 
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Pago</label>
            <input
              type="text"
              placeholder="Buscar por socio, código o referencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 bg-white text-black"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Socio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Método</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-black">{pago.referencia}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* AVATAR CON FONDO BEIGE Y TEXTO MARRÓN OSCURO */}
                      <div className="w-10 h-10 bg-yellow-100 text-yellow-900 rounded-full flex items-center justify-center mr-3 font-bold text-xs flex-shrink-0">
                        {pago.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black">{pago.socio}</div>
                        <div className="text-xs text-gray-500">{pago.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pago.concepto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pago.fecha}</div>
                    {pago.vencimiento && (
                      <div className="text-xs text-gray-500">Vence: {pago.vencimiento}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{pago.metodoPago}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-black">{formatBolivianos(pago.monto)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(pago.estado)}`}>
                      {getEstadoLabel(pago.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Botón de descarga actualizado */}
                      <button 
                        onClick={() => handleDownloadReceipt(pago)}
                        // CLASES ACTUALIZADAS PARA FONDO BLANCO Y BORDE GRIS
                        className="p-2 bg-white border border-gray-300 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-black" 
                        title="Descargar recibo (DOC)"
                      >
                        {/* ÍCONO SVG CON COLOR ACTUALIZADO A AZUL MARINO */}
                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPagos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-2">💳</div>
            <p className="text-gray-500 text-sm">No se encontraron pagos con los criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}