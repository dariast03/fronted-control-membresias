/* eslint-disable no-irregular-whitespace */
import { useState, useEffect } from 'react';
import { usePagos } from '../../hooks/usePagos';

export default function ControlPagos() {
  const { pagos: apiPagos, loading, error, fetchPagos } = usePagos();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  // Función para mapear pago de API al formato del componente
  const mapPagoToDisplay = (pago) => ({
    ...pago,
    socio: pago.usuarioNombre || 'Usuario desconocido',
    codigo: `PAGO-${pago.id.slice(-6)}`,
    referencia: `REF-${pago.id.slice(-8)}`,
    fecha: new Date(pago.fechaPago).toLocaleDateString('es-ES'),
    concepto: 'Pago de Membresía',
    metodoPago: 'Transferencia', // Valor por defecto ya que la API no lo proporciona
    estado: pago.estado.toLowerCase(),
    avatar: (pago.usuarioNombre?.charAt(0) || 'U').toUpperCase(),
  });

  const pagos = apiPagos.map(mapPagoToDisplay);

  const filteredPagos = pagos.filter((pago) => {
    const matchesSearch =
      pago.socio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.referencia.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getEstadoBadge = (estado) => {
    const styles = {
      confirmado: 'bg-green-100 text-green-800 border border-green-200',
      pendiente: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      cancelado: 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[estado] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      confirmado: 'Confirmado',
      pendiente: 'Pendiente',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  };

  const formatBolivianos = (amount) => {
    return amount
      .toLocaleString('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace('BOB', 'Bs')
      .trim();
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
----------------------------------------------

Este documento sirve como prueba de pago.
`; // 2. Crear un Blob (objeto de archivo) con el tipo MIME para MS Word

    const blob = new Blob([receiptContent], {
      type: 'application/msword;charset=utf-8',
    }); // 3. Crear una URL temporal y un enlace

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; // Se usa la extensión .doc (Microsoft Word)
    a.download = `Recibo_${pago.referencia}.doc`; // 4. Disparar la descarga

    document.body.appendChild(a);
    a.click(); // 5. Limpiar la URL temporal y el elemento 'a'

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalGeneral = pagos.reduce((acc, p) => acc + p.monto, 0);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-48'>
               {' '}
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3'></div>
               {' '}
        <p className='text-lg text-gray-700'>Cargando datos de pagos...</p>     {' '}
      </div>
    );
  }

  return (
    <div className='space-y-6 p-4 md:p-8 bg-gray-100 min-h-screen'>
           {' '}
      <div className='flex justify-between items-center'>
               {' '}
        <div>
                   {' '}
          <h2 className='font-bold text-3xl mb-1 text-black'>
            Historial de Pagos Realizados
          </h2>
                   {' '}
          <p className='text-gray-500 text-sm font-light'>
            Registro de todas las cuotas pagadas.
          </p>
                 {' '}
        </div>
             {' '}
      </div>
                 {' '}
      {error && (
        <div className='p-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg'>
                    ⚠️ Error: {error}       {' '}
        </div>
      )}
            {/* Panel Superior: Solo se muestra el Total */}     {' '}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
               {' '}
        <div className='bg-black text-white p-5 rounded-xl shadow-xl col-span-1 md:col-start-4'>
                   {' '}
          <div className='text-center'>
                       {' '}
            <div className='text-3xl font-bold'>
              {formatBolivianos(totalGeneral)}
            </div>
                       {' '}
            <div className='text-xs text-gray-300 mt-1 uppercase tracking-wide'>
              Total Registrado
            </div>
                       {' '}
            <div className='text-xs text-gray-400 mt-1'>
              {pagos.length} pagos registrados
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
             {' '}
      </div>
           {' '}
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-lg'>
               {' '}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                   {' '}
          <div className='md:col-span-2'>
                       {' '}
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Buscar Pago
            </label>
                       {' '}
            <input
              type='text'
              placeholder='Buscar por socio, código o referencia...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 bg-white text-black'
            />
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className='overflow-x-auto'>
                   {' '}
          <table className='min-w-full'>
                       {' '}
            <thead className='bg-gray-50 border-b border-gray-200'>
                           {' '}
              <tr>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Referencia
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Socio
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Concepto
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Fecha
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Método
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Monto
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Estado
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Acciones
                </th>
                               {' '}
              </tr>
                           {' '}
            </thead>
                       {' '}
            <tbody className='divide-y divide-gray-100'>
                           {' '}
              {filteredPagos.map((pago) => (
                <tr
                  key={pago.id}
                  className='hover:bg-gray-50 transition duration-150'
                >
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='text-sm font-semibold text-black'>
                      {pago.referencia}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='flex items-center'>
                                           {' '}
                      {/* AVATAR CON FONDO BEIGE Y TEXTO MARRÓN OSCURO */}     
                                     {' '}
                      <div className='w-10 h-10 bg-yellow-100 text-yellow-900 rounded-full flex items-center justify-center mr-3 font-bold text-xs shrink-0'>
                                                {pago.avatar}                   
                         {' '}
                      </div>
                                           {' '}
                      <div>
                                               {' '}
                        <div className='text-sm font-semibold text-black'>
                          {pago.socio}
                        </div>
                                               {' '}
                        <div className='text-xs text-gray-500'>
                          {pago.codigo}
                        </div>
                                             {' '}
                      </div>
                                         {' '}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='text-sm text-gray-900'>{pago.concepto}</div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='text-sm text-gray-900'>{pago.fecha}</div>   
                                   {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='text-sm text-gray-600'>
                      {pago.metodoPago}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='text-sm font-bold text-black'>
                      {formatBolivianos(pago.monto)}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                        pago.estado
                      )}`}
                    >
                                            {getEstadoLabel(pago.estado)}       
                                 {' '}
                    </span>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4 whitespace-nowrap'>
                                       {' '}
                    <div className='flex items-center space-x-2'>
                                           {' '}
                      {/* Botón de descarga actualizado */}                     {' '}
                      <button
                        onClick={() => handleDownloadReceipt(pago)} // CLASES ACTUALIZADAS PARA FONDO BLANCO Y BORDE GRIS
                        className='p-2 bg-white border border-gray-300 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-black'
                        title='Descargar recibo (DOC)'
                      >
                                               {' '}
                        {/* ÍCONO SVG CON COLOR ACTUALIZADO A AZUL MARINO */}   
                                           {' '}
                        <svg
                          className='w-5 h-5 text-blue-900'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                                                   {' '}
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                                                 {' '}
                        </svg>
                                             {' '}
                      </button>
                                       {' '}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                </tr>
              ))}
                         {' '}
            </tbody>
                     {' '}
          </table>
                 {' '}
        </div>
               {' '}
        {filteredPagos.length === 0 && (
          <div className='text-center py-12'>
                        <div className='text-gray-400 text-4xl mb-2'>💳</div>   
                   {' '}
            <p className='text-gray-500 text-sm'>
              No se encontraron pagos con los criterios de búsqueda
            </p>
                     {' '}
          </div>
        )}
             {' '}
      </div>
         {' '}
    </div>
  );
}
