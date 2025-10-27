/* eslint-disable no-irregular-whitespace */
import React, { useState, useEffect } from 'react';
import { useMembresiasList } from '../../hooks/useMembresiasList';
import { usePagos } from '../../hooks/usePagos';
import { usePlanes } from '../../hooks/usePlanes';
import { membresiaService } from '../../services/membresiaService';

// --- CONSTANTES Y HELPERS ---

// Días antes del vencimiento para habilitar el botón de renovación
const DIAS_ANTES_VENCIMIENTO = 32;

// Función para formatear a Bolivianos (Bs)
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

// --- SUB-COMPONENTE MODAL (Integrado) ---

// Modal de renovación eliminado - ahora usamos modales separados para confirmación y pago// --- COMPONENTE PRINCIPAL ---

export default function Renovaciones() {
  const {
    membresias: apiMembresias,
    loading,
    error,
    fetchMembresias,
  } = useMembresiasList();
  const { registrarPago } = usePagos();
  const { planes } = usePlanes();

  const [filterType, setFilterType] = useState('proximos'); // Estados para el Recordatorio

  const [sendingReminderId, setSendingReminderId] = useState<string | null>(
    null
  );
  const [reminderSuccessMessage, setReminderSuccessMessage] = useState<
    string | null
  >(null);

  // Estados para renovación y pago
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMembresia, setSelectedMembresia] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({
    monto: 0,
    descripcion: '',
    membresiaId: '',
    planId: '',
  });
  const [cardData, setCardData] = useState({
    numero: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: '',
  });

  // Función para mapear membresía de API al formato del componente
  const mapMembresiaToRenovacion = (membresia) => {
    const fechaFin = new Date(membresia.fechaFin);
    const hoy = new Date();
    const diasRestantes = Math.ceil(
      (fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );

    let estado;
    if (membresia.estado === 'PendienteRenovacion') {
      estado = diasRestantes <= 15 ? 'urgente' : 'proximo';
    } else if (membresia.estado === 'Activa') {
      estado = diasRestantes <= 15 ? 'urgente' : 'proximo';
    } else {
      estado = 'vencido';
    }

    return {
      id: membresia.id,
      nombre: membresia.usuarioNombre || 'Usuario desconocido',
      codigo: `MEM-${membresia.id.slice(-6)}`,
      profesion: membresia.planNombre, // Usamos planNombre como profesión por simplicidad
      fechaVencimiento: fechaFin.toLocaleDateString('es-ES'),
      diasRestantes: diasRestantes,
      cuotaAnual: membresia.monto || 500, // Valor por defecto si no hay monto
      estado: estado,
      avatar: (membresia.usuarioNombre?.charAt(0) || 'U').toUpperCase(),
      usuarioId: membresia.usuarioId,
    };
  };

  const renovaciones = apiMembresias.map(mapMembresiaToRenovacion);

  const handleSendReminder = async (renovacion) => {
    setSendingReminderId(renovacion.id);
    setReminderSuccessMessage(null);
    try {
      // SIMULACIÓN DE LLAMADA AL BACKEND
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const message = `📧 Recordatorio enviado a ${renovacion.nombre} (${renovacion.codigo}).`;
      setReminderSuccessMessage(message);
    } catch (err) {
      setReminderSuccessMessage(
        '❌ Error al enviar el recordatorio. Intente nuevamente.'
      );
    } finally {
      setSendingReminderId(null); // Limpiar el mensaje de éxito después de 4 segundos
      setTimeout(() => {
        setReminderSuccessMessage(null);
      }, 4000);
    }
  };

  // Función para iniciar el proceso de renovación
  const handleRenew = (membresiaData) => {
    setSelectedMembresia(membresiaData);
    setPaymentData({
      monto: membresiaData.cuotaAnual,
      descripcion: `Renovación de membresía - ${membresiaData.nombre}`,
      membresiaId: membresiaData.id,
      planId: '', // Se determinará basado en el plan actual
    });
    setShowRenewModal(true);
  };

  // Función para confirmar la renovación y proceder al pago
  const handleConfirmRenewal = () => {
    setShowRenewModal(false);
    setShowPaymentModal(true);
  };

  // Función para procesar el pago y renovar la membresía
  const handlePayment = async () => {
    if (!selectedMembresia) return;

    try {
      // Primero registrar el pago
      const pagoRequest = {
        usuarioId: selectedMembresia.usuarioId,
        membresiaId: selectedMembresia.id,
        monto: paymentData.monto,
        metodoPago: 'Tarjeta',
      };

      await registrarPago(pagoRequest);

      // Luego renovar la membresía
      await membresiaService.renovar(selectedMembresia.id);

      // Recargar datos y cerrar modales
      await fetchMembresias();
      setShowPaymentModal(false);
      setSelectedMembresia(null);
      setCardData({
        numero: '',
        fechaExpiracion: '',
        cvv: '',
        nombreTitular: '',
      });

      // Mostrar mensaje de éxito
      setReminderSuccessMessage('✅ Renovación completada exitosamente');
      setTimeout(() => setReminderSuccessMessage(null), 4000);
    } catch (error) {
      console.error('Error en el proceso de renovación:', error);
      setReminderSuccessMessage(
        '❌ Error al procesar la renovación. Intente nuevamente.'
      );
      setTimeout(() => setReminderSuccessMessage(null), 4000);
    }
  };

  useEffect(() => {
    fetchMembresias();
  }, [fetchMembresias]);

  const filteredRenovaciones = renovaciones.filter((r) => {
    if (filterType === 'todos') return r.estado !== 'pagado';
    if (filterType === 'urgente') return r.estado === 'urgente';
    if (filterType === 'proximos') return r.estado === 'proximo';
    if (filterType === 'vencidos') return r.estado === 'vencido';
    return r.estado === 'proximo'; // Filtro por defecto
  });

  const getEstadoBadge = (estado) => {
    const styles = {
      urgente: 'bg-red-50 text-red-700 border border-red-200',
      proximo: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      vencido: 'bg-gray-100 text-gray-600 border border-gray-200',
      pagado: 'bg-green-50 text-green-700 border border-green-200',
    };
    return styles[estado] || '';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      urgente: 'Urgente',
      proximo: 'Próximo',
      vencido: 'Vencido',
      pagado: 'Pagado',
    };
    return labels[estado] || '';
  };

  const totalUrgente = renovaciones.filter(
    (r) => r.estado === 'urgente'
  ).length;
  const totalProximo = renovaciones.filter(
    (r) => r.estado === 'proximo'
  ).length;
  const totalVencido = renovaciones.filter(
    (r) => r.estado === 'vencido'
  ).length;
  const totalEsperado = renovaciones
    .filter((r) => r.estado !== 'vencido')
    .reduce((acc, r) => acc + r.cuotaAnual, 0);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-48'>
               {' '}
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3'></div>
               {' '}
        <p className='text-lg text-gray-700'>
          Cargando datos de renovaciones...
        </p>
             {' '}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
           {' '}
      <div>
               {' '}
        <h2 className='font-bold text-3xl mb-1 text-black'>Renovaciones</h2>   
           {' '}
        <p className='text-gray-500 text-sm font-light'>
          Gestión de renovaciones y vencimientos de membresías
        </p>
                     {' '}
      </div>
                 {' '}
      {error && (
        <div className='p-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg'>
                    ⚠️ Advertencia de Conexión: {error}       {' '}
        </div>
      )}
            {/* Mensaje de éxito del recordatorio */}     {' '}
      {reminderSuccessMessage && (
        <div className='p-3 text-sm text-green-600 border border-green-200 bg-green-50 rounded-lg transition-opacity duration-300'>
                      {reminderSuccessMessage}       {' '}
        </div>
      )}
            {/* Tarjetas de Resumen */}     {' '}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                {/* ... (Contenido de las tarjetas de resumen) ... */}       {' '}
        <div className='bg-white p-5 rounded-lg border border-gray-200'>
                   {' '}
          <div className='text-center'>
                       {' '}
            <div className='text-3xl font-bold text-red-600'>
              {totalUrgente}
            </div>
                       {' '}
            <div className='text-xs text-gray-500 mt-1 uppercase tracking-wide'>
              Urgentes
            </div>
                       {' '}
            <div className='text-xs text-gray-400 mt-1'>{'<'} 15 días</div>     
               {' '}
          </div>
                   {' '}
        </div>
               {' '}
        <div className='bg-white p-5 rounded-lg border border-gray-200'>
                   {' '}
          <div className='text-center'>
                       {' '}
            <div className='text-3xl font-bold text-yellow-600'>
              {totalProximo}
            </div>
                       {' '}
            <div className='text-xs text-gray-500 mt-1 uppercase tracking-wide'>
              Próximos
            </div>
                       {' '}
            <div className='text-xs text-gray-400 mt-1'>15-60 días</div>       
             {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className='bg-white p-5 rounded-lg border border-gray-200'>
                   {' '}
          <div className='text-center'>
                       {' '}
            <div className='text-3xl font-bold text-gray-600'>
              {totalVencido}
            </div>
                       {' '}
            <div className='text-xs text-gray-500 mt-1 uppercase tracking-wide'>
              Vencidos
            </div>
                       {' '}
            <div className='text-xs text-gray-400 mt-1'>Sin renovar</div>       
             {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className='bg-black text-white p-5 rounded-lg'>
                   {' '}
          <div className='text-center'>
                       {' '}
            <div className='text-3xl font-bold'>
              {formatBolivianos(totalEsperado)}
            </div>
                       {' '}
            <div className='text-xs text-gray-300 mt-1 uppercase tracking-wide'>
              Esperado
            </div>
                       {' '}
            <div className='text-xs text-gray-400 mt-1'>
              {totalUrgente + totalProximo} Renovaciones
            </div>
                     {' '}
          </div>
                 {' '}
        </div>
             {' '}
      </div>
                  {/* Tabla y Filtros */}     {' '}
      <div className='bg-white p-6 rounded-lg border border-gray-200'>
               {' '}
        <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
                   {' '}
          <h3 className='font-bold text-lg text-black'>
            Lista de Renovaciones
          </h3>
                             {' '}
          <div className='flex items-center space-x-2'>
                       {' '}
            <button
              onClick={() => setFilterType('todos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'todos'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
                            Todos            {' '}
            </button>
                       {' '}
            <button
              onClick={() => setFilterType('urgente')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'urgente'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
                            Urgentes ({totalUrgente})            {' '}
            </button>
                       {' '}
            <button
              onClick={() => setFilterType('proximos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'proximos'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
                            Próximos ({totalProximo})            {' '}
            </button>
                       {' '}
            <button
              onClick={() => setFilterType('vencidos')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filterType === 'vencidos'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
                            Vencidos ({totalVencido})            {' '}
            </button>
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className='overflow-x-auto'>
                   {' '}
          <table className='w-full'>
                       {' '}
            <thead className='bg-gray-50 border-b border-gray-200'>
                           {' '}
              <tr>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Socio
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Código
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Profesión
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Vencimiento
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Días Restantes
                </th>
                               {' '}
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Cuota
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
              {filteredRenovaciones.map((renovacion) => (
                <tr
                  key={renovacion.id}
                  className='hover:bg-gray-50 transition duration-150'
                >
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='flex items-center'>
                                            {/* Iniciales de color Beige */}   
                                       {' '}
                      <div className='w-10 h-10 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full flex items-center justify-center mr-3 font-bold text-xs shrink-0'>
                                                {renovacion.avatar}             
                               {' '}
                      </div>
                                           {' '}
                      <div className='text-sm font-semibold text-black'>
                        {renovacion.nombre}
                      </div>
                                         {' '}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='text-sm text-gray-900 font-medium'>
                      {renovacion.codigo}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='text-sm text-gray-600'>
                      {renovacion.profesion}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='text-sm text-gray-900'>
                      {renovacion.fechaVencimiento}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div
                      className={`text-sm font-semibold ${
                        renovacion.diasRestantes < 0
                          ? 'text-gray-500'
                          : renovacion.diasRestantes <= 15
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                                           {' '}
                      {renovacion.diasRestantes < 0
                        ? `Vencido hace ${Math.abs(
                            renovacion.diasRestantes
                          )} días`
                        : `${renovacion.diasRestantes} días`}
                                         {' '}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='text-sm font-semibold text-black'>
                      {formatBolivianos(renovacion.cuotaAnual)}
                    </div>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                        renovacion.estado
                      )}`}
                    >
                                            {getEstadoLabel(renovacion.estado)} 
                                       {' '}
                    </span>
                                     {' '}
                  </td>
                                   {' '}
                  <td className='px-6 py-4'>
                                       {' '}
                    <div className='flex items-center space-x-2'>
                                           {' '}
                      {/* Botón Renovar/Reactivar: Solo mostrar si está vencido o dentro del período definido */}
                      {(renovacion.diasRestantes < 0 ||
                        renovacion.diasRestantes <= DIAS_ANTES_VENCIMIENTO) && (
                        <button
                          onClick={() => handleRenew(renovacion)}
                          className='px-4 py-1.5 text-xs font-medium bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition duration-200'
                        >
                          {renovacion.estado === 'vencido'
                            ? 'Reactivar'
                            : 'Renovar'}
                        </button>
                      )}
                                                                 {' '}
                      {/* Botón de Recordatorio (sin cambios) */}               
                           {' '}
                      <button
                        onClick={() => handleSendReminder(renovacion)}
                        disabled={sendingReminderId === renovacion.id}
                        className='p-2 bg-white text-blue-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-wait'
                        title='Enviar recordatorio'
                      >
                                               {' '}
                        {sendingReminderId === renovacion.id ? (
                          // Spinner de carga
                          <svg
                            className='animate-spin h-4 w-4'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                                                         {' '}
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                                                         {' '}
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                                                       {' '}
                          </svg>
                        ) : (
                          // Ícono de Correo
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='lucide lucide-mail'
                          >
                                                         {' '}
                            <rect width='20' height='16' x='2' y='4' rx='2' /> 
                                                       {' '}
                            <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                                                       {' '}
                          </svg>
                        )}
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
        {filteredRenovaciones.length === 0 && (
          <div className='text-center py-12'>
                        <div className='text-gray-400 text-4xl mb-2'>📋</div>   
                   {' '}
            <p className='text-gray-500 text-sm'>
              No hay renovaciones en esta categoría
            </p>
                     {' '}
          </div>
        )}
             {' '}
      </div>
      {/* Modal de Confirmación de Renovación */}
      {showRenewModal && selectedMembresia && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-md'>
            <div className='p-6 border-b border-gray-100'>
              <h3 className='text-xl font-bold text-black'>
                Confirmar Renovación
              </h3>
            </div>
            <div className='p-6 space-y-4'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm font-semibold text-gray-700'>
                  Socio:{' '}
                  <span className='font-bold text-black'>
                    {selectedMembresia.nombre}
                  </span>
                </p>
                <p className='text-sm text-gray-600'>
                  Código: {selectedMembresia.codigo}
                </p>
                <p className='text-sm text-gray-600'>
                  Vencimiento Actual: {selectedMembresia.fechaVencimiento}
                </p>
              </div>
              <div className='text-center p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-gray-700'>Monto a Pagar:</p>
                <p className='text-2xl font-bold text-black'>
                  {formatBolivianos(paymentData.monto)}
                </p>
              </div>
              <p className='text-sm text-gray-600 text-center'>
                Al confirmar, procederá al pago con tarjeta de crédito/débito.
              </p>
            </div>
            <div className='flex justify-end space-x-3 p-6 pt-0'>
              <button
                onClick={() => setShowRenewModal(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRenewal}
                className='px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800'
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Pago con Tarjeta */}
      {showPaymentModal && selectedMembresia && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-md'>
            <div className='p-6 border-b border-gray-100'>
              <h3 className='text-xl font-bold text-black'>Pago con Tarjeta</h3>
            </div>
            <div className='p-6 space-y-4'>
              <div className='p-3 bg-gray-50 rounded-lg'>
                <p className='text-sm font-semibold text-gray-700'>
                  Renovación para:{' '}
                  <span className='font-bold text-black'>
                    {selectedMembresia.nombre}
                  </span>
                </p>
                <p className='text-sm text-gray-600'>
                  Monto: {formatBolivianos(paymentData.monto)}
                </p>
              </div>

              <div className='space-y-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Número de Tarjeta
                  </label>
                  <input
                    type='text'
                    placeholder='1234 5678 9012 3456'
                    value={cardData.numero}
                    onChange={(e) =>
                      setCardData({ ...cardData, numero: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black'
                    maxLength={19}
                  />
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Fecha Exp.
                    </label>
                    <input
                      type='text'
                      placeholder='MM/YY'
                      value={cardData.fechaExpiracion}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          fechaExpiracion: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black'
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      CVV
                    </label>
                    <input
                      type='text'
                      placeholder='123'
                      value={cardData.cvv}
                      onChange={(e) =>
                        setCardData({ ...cardData, cvv: e.target.value })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black'
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Nombre del Titular
                  </label>
                  <input
                    type='text'
                    placeholder='Como aparece en la tarjeta'
                    value={cardData.nombreTitular}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        nombreTitular: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black'
                  />
                </div>
              </div>
            </div>
            <div className='flex justify-end space-x-3 p-6 pt-0'>
              <button
                onClick={() => setShowPaymentModal(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                className='px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800'
              >
                Procesar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
