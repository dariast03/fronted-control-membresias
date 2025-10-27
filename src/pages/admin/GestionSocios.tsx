/* eslint-disable no-irregular-whitespace */
'use client';

import { useState } from 'react';
import { Eye, Pencil, Trash2, Grid, List } from 'lucide-react';
import { useSocios } from '../../hooks/useSocios';

// URL de la API (como referencia, no se usa en este ejemplo de frontend)
const API_URL = 'https://localhost:7249/api/Docente';

// --- Main App Component (GestionSocios) ---
export default function GestionSocios() {
  const {
    socios,
    loading,
    error,
    actualizarSocio,
    actualizarEstadoSocio,
    eliminarSocio,
  } = useSocios();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [viewMode, setViewMode] = useState('grid'); // Estados del Modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [modalType, setModalType] = useState<string | null>(null); // 'view', 'edit', 'confirm_delete'

  // Función para mapear socio de API al formato del componente
  const mapSocioToDisplay = (socio) => ({
    ...socio,
    CI: socio.cedulaIdentidad,
    Nombre: socio.nombres || 'Sin nombre',
    Apellido: socio.apellidos || 'Sin apellido',
    Correo: socio.email || 'Sin email',
    Estado: socio.estadoSocio,
    Fecha_registro: new Date(socio.fechaRegistro).toLocaleDateString('es-ES'),
    avatar:
      `${socio.nombres?.charAt(0) || ''}${
        socio.apellidos?.charAt(0) || ''
      }`.toUpperCase() || 'SN',
  });

  const getEstadoBadge = (estado) => {
    const styles = {
      // Colores basados en la imagen proporcionada (verde, rojo, amarillo/naranja).
      Activo: 'bg-green-100 text-green-700 border border-green-200', // 🟢 VERDE
      Expirado: 'bg-red-100 text-red-700 border border-red-200', // 🔴 ROJO
      Pendiente: 'bg-yellow-100 text-yellow-700 border border-yellow-200', // 🟡 AMARILLO
    };
    return styles[estado] || '';
  };

  const filteredSocios = socios.map(mapSocioToDisplay).filter((socio) => {
    const term = searchTerm.toLowerCase(); // Buscamos por CI, Nombre, Apellido y Profesion
    const matchesSearch =
      socio.CI.toLowerCase().includes(term) ||
      socio.Nombre.toLowerCase().includes(term) ||
      socio.Apellido.toLowerCase().includes(term) ||
      socio.Profesion.toLowerCase().includes(term);
    const matchesFilter =
      filterEstado === 'todos' || socio.Estado === filterEstado;
    return matchesSearch && matchesFilter;
  }); // Función para descargar detalles

  const handleDownloadDetails = (socio) => {
    const details = `
--- Detalles del Socio: ${socio.Nombre} ${socio.Apellido} ---
Cédula de Identidad (CI): ${socio.CI}
Estado: ${socio.Estado}
Profesión: ${socio.Profesion}
Correo: ${socio.Correo}
Teléfono: ${socio.telefono}
Fecha de Registro: ${socio.Fecha_registro}
Fecha de Vencimiento: ${socio.Fecha_vencimiento}
        `.trim();

    const blob = new Blob([details], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detalle_socio_${socio.CI}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }; // --- CRUD Handlers ---

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSocio(null);
    setModalType(null);
  };

  const handleViewDetails = (socio) => {
    setSelectedSocio(socio);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEdit = (socio) => {
    setSelectedSocio(socio);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (socio) => {
    setSelectedSocio(socio);
    setModalType('confirm_delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async (id) => {
    try {
      await eliminarSocio(id);
      handleCloseModal();
      alert('Socio eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar socio');
    }
  };

  const handleSaveEdit = async (updatedSocio) => {
    try {
      // Solo actualizar campos permitidos según la API
      await actualizarSocio({
        id: updatedSocio.id,
        cedulaIdentidad: updatedSocio.CI,
        profesion: updatedSocio.Profesion,
        estadoSocio: updatedSocio.Estado,
      });
      handleCloseModal();
      alert('Socio actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar socio');
    }
  }; // --- Nested Modal Components --- // 💡 Mantener el modal con fondo blanco (bg-white) y fondo oscuro para el overlay (bg-gray-900 bg-opacity-75)

  const Modal = ({ children }) => {
    if (!isModalOpen || !selectedSocio) return null;

    return (
      <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50'>
               {' '}
        <div className='bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all overflow-hidden'>
                    <div className='p-6'>{children}</div>       {' '}
        </div>
               {' '}
      </div>
    );
  }; // **COMPONENTE DE EDICIÓN**

  const SocioEditForm = ({ socio, onSave, onClose }) => {
    const [formData, setFormData] = useState(socio);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const inputClass =
      'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-black';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

    return (
      <form onSubmit={handleSubmit} className='space-y-4'>
               {' '}
        <h3 className='text-xl font-bold text-black border-b pb-3 mb-4'>
                    Editar Socio: {socio.Nombre} {socio.Apellido}       {' '}
        </h3>
               {' '}
        <div>
                   {' '}
          <label className={labelClass}>Cédula de Identidad (CI)</label>       
           {' '}
          <input
            type='text'
            name='CI'
            value={formData.CI}
            onChange={handleChange}
            className={inputClass}
            required
          />
                   {' '}
        </div>
               {' '}
        <div className='grid grid-cols-2 gap-4'>
                   {' '}
          <div>
                        <label className={labelClass}>Nombre</label>           {' '}
            <input
              type='text'
              name='Nombre'
              value={formData.Nombre}
              onChange={handleChange}
              className={inputClass}
              required
            />
                     {' '}
          </div>
                       {' '}
          <div>
                        <label className={labelClass}>Apellido</label>         
             {' '}
            <input
              type='text'
              name='Apellido'
              value={formData.Apellido}
              onChange={handleChange}
              className={inputClass}
              required
            />
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div>
                    <label className={labelClass}>Profesión</label>         {' '}
          <input
            type='text'
            name='Profesion'
            value={formData.profesion}
            onChange={handleChange}
            className={inputClass}
            required
          />
                 {' '}
        </div>
                       {' '}
        <div>
                            <label className={labelClass}>Correo</label>       
                   {' '}
          <input
            type='email'
            name='Correo'
            value={formData.Correo}
            onChange={handleChange}
            className={inputClass}
            required
          />
                         {' '}
        </div>
                       {' '}
        <div>
                            <label className={labelClass}>Teléfono</label>     
                     {' '}
          <input
            type='text'
            name='Telefono'
            value={formData.telefono}
            onChange={handleChange}
            className={inputClass}
            required
          />
                         {' '}
        </div>
                       {' '}
        <div>
                            <label className={labelClass}>Estado</label>       
                   {' '}
          <select
            name='Estado'
            value={formData.Estado}
            onChange={handleChange}
            className={inputClass}
          >
                                <option value='Activo'>Activo</option>         
                      <option value='Expirado'>Expirado</option>               
                <option value='Pendiente'>Pendiente</option>                 {' '}
          </select>
                         {' '}
        </div>
                       {' '}
        <div className='flex justify-end space-x-3 pt-4'>
                           {' '}
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
                                Cancelar                  {' '}
          </button>
                           {' '}
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
          >
                                Guardar Cambios                  {' '}
          </button>
                         {' '}
        </div>
                     {' '}
      </form>
    );
  }; // **COMPONENTE DE VISUALIZACIÓN DE DETALLES**

  const SocioDetailsView = ({ socio, onClose }) => {
    console.log('🚀 ~ SocioDetailsView ~ socio:', socio);
    const detailItemClass =
      'flex justify-between items-center py-2 border-b border-gray-100';
    const detailLabelClass = 'text-sm text-gray-500 font-medium';
    const detailValueClass = 'text-sm text-gray-800 font-semibold';

    return (
      <div className='space-y-4'>
               {' '}
        <div className='flex items-center space-x-4 border-b pb-4'>
                    {/* AVATAR BEIGE GRANDE */}         {' '}
          <div className='w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0'>
                        {socio.avatar}         {' '}
          </div>
                   {' '}
          <div>
                       {' '}
            <h3 className='text-2xl font-bold text-black'>
                            {socio.Nombre} {socio.Apellido}           {' '}
            </h3>
                       {' '}
            <p className='text-md text-gray-500'>{socio.Profesion}</p>         {' '}
          </div>
                 {' '}
        </div>
                {/* Sección de Datos Personales */}       {' '}
        <div className='pt-2'>
                   {' '}
          <h4 className='text-lg font-semibold mb-2'>
            Datos Personales y Contacto
          </h4>
                   {' '}
          <div className={detailItemClass}>
                       {' '}
            <span className={detailLabelClass}>Cédula de Identidad (CI):</span> 
                      <span className={detailValueClass}>{socio.CI}</span>     
               {' '}
          </div>
                   {' '}
          <div className={detailItemClass}>
                        <span className={detailLabelClass}>Correo:</span>       
                <span className={detailValueClass}>{socio.Correo}</span>       
             {' '}
          </div>
                   {' '}
          <div className={detailItemClass}>
                        <span className={detailLabelClass}>Teléfono:</span>     
                  <span className={detailValueClass}>{socio.telefono}</span>   
                 {' '}
          </div>
                 {' '}
        </div>
                {/* Sección de Afiliación */}       {' '}
        <div className='pt-2'>
                   {' '}
          <h4 className='text-lg font-semibold mb-2'>
            Información de Afiliación
          </h4>
                   {' '}
          <div className={detailItemClass}>
                       {' '}
            <span className={detailLabelClass}>Fecha de Registro:</span>       
                <span className={detailValueClass}>{socio.Fecha_registro}</span>
                     {' '}
          </div>
                   {' '}
          <div className={detailItemClass}>
                       {' '}
            <span className={detailLabelClass}>Fecha de Vencimiento:</span>     
                 {' '}
            <span className={detailValueClass}>
              {new Date(socio.fechaVencimiento).toLocaleDateString()}
            </span>
                     {' '}
          </div>
                   {' '}
          <div className={detailItemClass}>
                        <span className={detailLabelClass}>Estado:</span>       
               {' '}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                socio.Estado
              )}`}
            >
                            {socio.Estado}           {' '}
            </span>
                     {' '}
          </div>
                 {' '}
        </div>
               {' '}
        <div className='flex justify-end space-x-3 pt-4'>
                   {' '}
          <button
            onClick={() => handleDownloadDetails(socio)}
            className='px-4 py-2 text-sm font-medium text-black bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center'
          >
                       {' '}
            <svg
              className='w-4 h-4 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
                           {' '}
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
              />
                         {' '}
            </svg>
                        Descargar Detalle          {' '}
          </button>
                   {' '}
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors'
          >
                        Cerrar          {' '}
          </button>
                 {' '}
        </div>
             {' '}
      </div>
    );
  };

  const ConfirmDeleteModal = ({ socio, onConfirm, onClose }) => (
    <div className='text-center'>
           {' '}
      <div className='text-red-500 mx-auto mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-red-100'>
               {' '}
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
                   {' '}
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
                 {' '}
        </svg>
             {' '}
      </div>
           {' '}
      <h3 className='text-xl font-bold text-black mb-2'>
        Confirmar Eliminación
      </h3>
           {' '}
      <p className='text-gray-600 mb-6'>
                ¿Estás seguro de que deseas eliminar permanentemente al socio **
        {socio.Nombre} {socio.Apellido}** ({socio.CI})?         Esta acción no
        se puede deshacer.      {' '}
      </p>
           {' '}
      <div className='flex justify-center space-x-3'>
               {' '}
        <button
          onClick={onClose}
          className='px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors'
        >
                    Cancelar        {' '}
        </button>
               {' '}
        <button
          onClick={() => onConfirm(socio.id)}
          className='px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors'
        >
                    Eliminar        {' '}
        </button>
             {' '}
      </div>
         {' '}
    </div>
  ); // --- Main Render ---

  return (
    <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6'>
           {' '}
      <div className='flex items-center justify-between'>
               {' '}
        <div>
                   {' '}
          <h2 className='font-extrabold text-3xl mb-1 text-black'>
            Gestión de Socios
          </h2>
                   {' '}
          <p className='text-gray-500 text-sm font-light'>
            Administra y consulta la información de todos los socios
          </p>
                 {' '}
        </div>
               {' '}
        <div className='flex items-center space-x-2'>
                   {' '}
          {/* 1. Botón de Vista de Cuadrícula - Fondo Blanco / Icono Negro */} 
                 {' '}
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-200 border 
              ${
              viewMode === 'grid'
                ? 'bg-white text-black border-black shadow-md' // Activo
                : 'bg-white text-black border-gray-300 hover:bg-gray-100' // Inactivo
            }`}
            title='Vista de tarjetas'
          >
                        <Grid className='w-5 h-5' />         {' '}
          </button>
                   {' '}
          {/* 1. Botón de Vista de Tabla - Fondo Blanco / Icono Negro */}       
           {' '}
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all duration-200 border
              ${
              viewMode === 'table'
                ? 'bg-white text-black border-black shadow-md' // Activo
                : 'bg-white text-black border-gray-300 hover:bg-gray-100' // Inactivo
            }`}
            title='Vista de tabla'
          >
                        <List className='w-5 h-5' />         {' '}
          </button>
                 {' '}
        </div>
             {' '}
      </div>
           {' '}
      {loading ? (
        <div className='bg-white rounded-xl border border-gray-200 text-center py-20 mt-6'>
                    <div className='text-gray-400 text-5xl mb-3'>⏳</div>       
            <p className='text-gray-500 text-lg'>Cargando socios...</p>       {' '}
        </div>
      ) : error ? (
        <div className='bg-white rounded-xl border border-red-200 text-center py-20 mt-6'>
                    <div className='text-red-400 text-5xl mb-3'>❌</div>       
           {' '}
          <p className='text-red-600 text-lg'>
            Error al cargar socios: {error}
          </p>
                 {' '}
        </div>
      ) : (
        <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
                 {' '}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                     {' '}
            <div className='md:col-span-2'>
                         {' '}
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Buscar Socio
              </label>
                         {' '}
              <input
                type='text'
                placeholder='Buscar por CI, nombre o profesión...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Buscador blanco
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 bg-white text-black'
              />
                       {' '}
            </div>
                     {' '}
            <div>
                         {' '}
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Filtrar por Estado
              </label>
                         {' '}
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)} // Select blanco
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white appearance-none transition duration-150 text-black'
              >
                             {' '}
                <option value='todos' className='text-black'>
                                  Todos los estados              {' '}
                </option>
                             {' '}
                <option value='Activo' className='text-black'>
                                  Activo              {' '}
                </option>
                             {' '}
                <option value='Expirado' className='text-black'>
                                  Expirado              {' '}
                </option>
                             {' '}
                <option value='Pendiente' className='text-black'>
                                  Pendiente              {' '}
                </option>
                           {' '}
              </select>
                       {' '}
            </div>
                   {' '}
          </div>
                 {' '}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100'>
                     {' '}
            <div className='text-center p-2'>
                         {' '}
              <div className='text-2xl font-extrabold text-black'>
                {socios.length}
              </div>
                         {' '}
              <div className='text-xs text-gray-500 mt-1'>Total de Socios</div> 
                     {' '}
            </div>
                     {' '}
            <div className='text-center p-2'>
                         {' '}
              <div className='text-2xl font-extrabold text-black'>
                             {' '}
                {socios.filter((s) => s.estadoSocio === 'Activo').length}       
                   {' '}
              </div>
                         {' '}
              <div className='text-xs text-gray-500 mt-1'>Activos</div>         
               {' '}
            </div>
                     {' '}
            <div className='text-center p-2'>
                         {' '}
              <div className='text-2xl font-extrabold text-black'>
                             {' '}
                {socios.filter((s) => s.estadoSocio === 'Expirado').length}     
                     {' '}
              </div>
                         {' '}
              <div className='text-xs text-gray-500 mt-1'>Expirados</div>       
               {' '}
            </div>
                     {' '}
            <div className='text-center p-2'>
                         {' '}
              <div className='text-2xl font-extrabold text-black'>
                             {' '}
                {socios.filter((s) => s.estadoSocio === 'Pendiente').length}   
                       {' '}
              </div>
                         {' '}
              <div className='text-xs text-gray-500 mt-1'>Pendientes</div>     
                 {' '}
            </div>
                   {' '}
          </div>
               {' '}
        </div>
      )}
      {filteredSocios.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-200 text-center py-20 mt-6'>
                    <div className='text-gray-400 text-5xl mb-3'>🔍</div>       
           {' '}
          <p className='text-gray-500 text-lg'>
            No se encontraron socios con los criterios de búsqueda.
          </p>
                 {' '}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                   {' '}
          {filteredSocios.map((socio) => (
            <div
              key={socio.id}
              className='bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-black transition-all duration-300 overflow-hidden shadow-sm'
            >
                           {' '}
              <div className='p-6'>
                               {' '}
                <div className='flex items-start justify-between mb-4'>
                                    {/* AVATAR BEIGE MEDIANO */}               
                   {' '}
                  <div className='w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0'>
                                        {socio.avatar}                 {' '}
                  </div>
                                   {' '}
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                      socio.Estado
                    )}`}
                  >
                                        {socio.Estado}                 {' '}
                  </span>
                                 {' '}
                </div>
                               {' '}
                <h3 className='font-bold text-lg text-black mb-1 truncate'>
                                    {socio.Nombre} {socio.Apellido}             
                   {' '}
                </h3>
                               {' '}
                <p className='text-sm text-gray-500 mb-3'>{socio.Profesion}</p> 
                             {' '}
                <div className='pt-4 border-t border-gray-100'>
                                   {' '}
                  <div className='flex items-center justify-between text-xs'>
                                       {' '}
                    <span className='text-gray-500'>CI</span>                   {' '}
                    <span className='font-medium text-gray-700'>
                      {socio.CI}
                    </span>
                                     {' '}
                  </div>
                                   {' '}
                  <div className='flex items-center justify-between text-xs mt-1'>
                                       {' '}
                    <span className='text-gray-500'>Vencimiento</span>         
                             {' '}
                    <span className='font-medium text-gray-700'>
                      {socio.Fecha_vencimiento}
                    </span>
                                     {' '}
                  </div>
                                 {' '}
                </div>
                             {' '}
              </div>
                            {/* Actions for Grid View */}             {' '}
              <div className='px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center space-x-2'>
                               {' '}
                {/* Botón VER DETALLES: Fondo Gris Claro / Icono Negro */}     
                         {' '}
                <button
                  onClick={() => handleViewDetails(socio)}
                  className='p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors'
                  title='Ver detalles completos'
                >
                                    <Eye className='w-5 h-5 text-black' />     
                           {' '}
                </button>
                                               {' '}
                {/* Botón EDITAR: Fondo Gris Claro / Icono Negro */}           
                   {' '}
                <button
                  onClick={() => handleEdit(socio)}
                  className='p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors'
                  title='Editar'
                >
                                    <Pencil className='w-5 h-5 text-black' />   
                             {' '}
                </button>
                                               {' '}
                {/* Botón ELIMINAR: Fondo Gris Claro / Icono Negro (con hover rojo) */}
                               {' '}
                <button
                  onClick={() => handleDelete(socio)}
                  className='p-2 bg-gray-200 hover:bg-red-200 rounded-lg transition-colors'
                  title='Eliminar'
                >
                                   {' '}
                  <Trash2 className='w-5 h-5 text-black hover:text-red-700' /> 
                               {' '}
                </button>
                             {' '}
              </div>
                         {' '}
            </div>
          ))}
                 {' '}
        </div>
      ) : (
        /* Table View */
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-6'>
                   {' '}
          <div className='overflow-x-auto'>
                       {' '}
            <table className='min-w-full divide-y divide-gray-200'>
                           {' '}
              <thead className='bg-gray-50'>
                               {' '}
                <tr>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Socio                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        CI / Profesión                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Contacto                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Registro                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Vencimiento                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Estado                  {' '}
                  </th>
                                   {' '}
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                        Acciones                  {' '}
                  </th>
                                 {' '}
                </tr>
                             {' '}
              </thead>
                           {' '}
              <tbody className='bg-white divide-y divide-gray-100'>
                               {' '}
                {filteredSocios.map((socio) => (
                  <tr
                    key={socio.id}
                    className='hover:bg-gray-50 transition duration-150'
                  >
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                           {' '}
                      <div className='flex items-center'>
                                                {/* AVATAR BEIGE PEQUEÑO */}   
                                           {' '}
                        <div className='w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mr-3 font-bold text-xs flex-shrink-0'>
                                                    {socio.avatar}             
                                   {' '}
                        </div>
                                               {' '}
                        <div>
                                                   {' '}
                          <div className='text-sm font-semibold text-black'>
                                                        {socio.Nombre}{' '}
                            {socio.Apellido}                         {' '}
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
                      <div className='text-sm text-gray-900 font-medium'>
                        {socio.CI}
                      </div>
                                           {' '}
                      <div className='text-xs text-gray-500'>
                        {socio.Profesion}
                      </div>
                                         {' '}
                    </td>
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                           {' '}
                      <div className='text-sm text-gray-900 truncate max-w-[150px]'>
                        {socio.Correo}
                      </div>
                                           {' '}
                      <div className='text-xs text-gray-500'>
                        {socio.telefono}
                      </div>
                                         {' '}
                    </td>
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                           {' '}
                      <div className='text-sm text-gray-900'>
                        {socio.Fecha_registro}
                      </div>
                                         {' '}
                    </td>
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                           {' '}
                      <div className='text-sm text-gray-900'>
                        {socio.Fecha_vencimiento}
                      </div>
                                         {' '}
                    </td>
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                           {' '}
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                          socio.Estado
                        )}`}
                      >
                                                {socio.Estado}                 
                           {' '}
                      </span>
                                         {' '}
                    </td>
                                       {' '}
                    <td className='px-6 py-4 whitespace-nowrap'>
                                            {/* Actions for Table View */}     
                                     {' '}
                      <div className='flex items-center space-x-1'>
                                                                       {' '}
                        {/* Botón VER DETALLES: Fondo Gris Claro / Icono Negro */}
                                               {' '}
                        <button
                          onClick={() => handleViewDetails(socio)}
                          className='p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200'
                          title='Ver detalles'
                        >
                                                   {' '}
                          <Eye className='w-4 h-4 text-black' />               
                                 {' '}
                        </button>
                                                                       {' '}
                        {/* Botón EDITAR: Fondo Gris Claro / Icono Negro */}   
                                           {' '}
                        <button
                          onClick={() => handleEdit(socio)}
                          className='p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200'
                          title='Editar'
                        >
                                                   {' '}
                          <Pencil className='w-4 h-4 text-black' />             
                                   {' '}
                        </button>
                                                                       {' '}
                        {/* Botón ELIMINAR: Fondo Gris Claro / Icono Negro (con hover rojo) */}
                                               {' '}
                        <button
                          onClick={() => handleDelete(socio)}
                          className='p-2 bg-gray-200 hover:bg-red-200 rounded-lg transition duration-200'
                          title='Eliminar'
                        >
                                                   {' '}
                          <Trash2 className='w-4 h-4 text-black hover:text-red-700' />
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
        </div>
      )}
                  {/* Conditional Modal Render */}     {' '}
      <Modal>
                {/* 1. Ver Detalles */}       {' '}
        {modalType === 'view' && selectedSocio && (
          <SocioDetailsView socio={selectedSocio} onClose={handleCloseModal} />
        )}
                {/* 2. Editar */}       {' '}
        {modalType === 'edit' && selectedSocio && (
          <SocioEditForm
            socio={selectedSocio}
            onSave={handleSaveEdit}
            onClose={handleCloseModal}
          />
        )}
                {/* 3. Eliminar */}       {' '}
        {modalType === 'confirm_delete' && selectedSocio && (
          <ConfirmDeleteModal
            socio={selectedSocio}
            onConfirm={confirmDelete}
            onClose={handleCloseModal}
          />
        )}
             {' '}
      </Modal>
         {' '}
    </div>
  );
}
