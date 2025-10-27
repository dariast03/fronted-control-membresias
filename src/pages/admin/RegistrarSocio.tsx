import React, { useState, useEffect } from 'react';
import {
  useRegistroSocio,
  type RegistroSocioData,
} from '../../hooks/useRegistroSocio';

export default function RegistrarSocio() {
  const { planes, loading, error, fetchPlanes, registrarSocio } =
    useRegistroSocio();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistroSocioData>({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    profesion: '',
    direccion: '',
    telefono: '',
    membresiaPlanId: '',
  });

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    // Validación básica
    if (
      !formData.nombres ||
      !formData.apellidos ||
      !formData.email ||
      !formData.password ||
      !formData.profesion ||
      !formData.direccion ||
      !formData.telefono ||
      !formData.membresiaPlanId
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      await registrarSocio(formData);
      setSuccessMessage(
        `✅ Socio ${formData.nombres} ${formData.apellidos} registrado exitosamente.`
      );

      // Resetear el formulario
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        profesion: '',
        direccion: '',
        telefono: '',
        membresiaPlanId: '',
      });
    } catch (err) {
      // El error ya se maneja en el hook
    }
  };

  const inputStyle =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 transition duration-150';

  return (
    <div className='w-full h-full py-8 bg-gray-100 min-h-screen font-sans'>
      <div className='mx-auto px-4 md:px-8 max-w-4xl space-y-6'>
        {/* Título de la Sección */}
        <div>
          <h2 className='font-bold text-3xl mb-1 text-black'>
            Registrar Nuevo Socio
          </h2>
          <p className='text-gray-500 text-sm font-light'>
            Complete los datos del nuevo socio para registrarlo en el sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Mensajes de feedback */}
          {successMessage && (
            <div className='p-4 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300 transition duration-300 shadow-sm'>
              {successMessage}
            </div>
          )}
          {error && (
            <div className='p-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300 transition duration-300 shadow-sm'>
              {error}
            </div>
          )}

          {/* Sección: Datos Personales */}
          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <h3 className='font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100'>
              Datos Personales
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Nombre */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Nombre *
                </label>
                <input
                  type='text'
                  name='nombres'
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder='Ej: Juan'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
              {/* Apellidos */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Apellidos *
                </label>
                <input
                  type='text'
                  name='apellidos'
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder='Ej: Pérez García'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
              {/* Email */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='ejemplo@email.com'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
              {/* Password */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Contraseña *
                </label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Contraseña segura'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos Profesionales */}
          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <h3 className='font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100'>
              Datos Profesionales y de Contacto
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              {/* Profesión */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Profesión *
                </label>
                <select
                  name='profesion'
                  value={formData.profesion}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                  disabled={loading}
                >
                  <option value=''>Seleccione una profesión</option>
                  <option value='Ingeniero Civil'>Ingeniero Civil</option>
                  <option value='Arquitecto'>Arquitecto</option>
                  <option value='Ingeniero Industrial'>
                    Ingeniero Industrial
                  </option>
                  <option value='Otro'>Otro</option>
                </select>
              </div>
              {/* Teléfono */}
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Teléfono *
                </label>
                <input
                  type='tel'
                  name='telefono'
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder='+591 XXXXXXXX'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
              {/* Dirección */}
              <div className='md:col-span-2'>
                <label className='block text-xs font-medium text-gray-700 mb-1'>
                  Dirección *
                </label>
                <input
                  type='text'
                  name='direccion'
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder='Calle, número, zona, ciudad'
                  required
                  className={inputStyle}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Sección: Plan de Membresía */}
          <div className='bg-white p-6 rounded-xl shadow-lg border border-gray-200'>
            <h3 className='font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100'>
              Plan de Membresía
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-xs font-medium text-gray-700 mb-3'>
                  Seleccione un Plan *
                </label>
                {planes.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    {loading
                      ? 'Cargando planes...'
                      : 'No hay planes disponibles'}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {planes.map((plan) => (
                      <div
                        key={plan.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.membresiaPlanId === plan.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            membresiaPlanId: plan.id,
                          }))
                        }
                      >
                        <div className='flex items-center space-x-3'>
                          <input
                            type='radio'
                            name='membresiaPlanId'
                            value={plan.id}
                            checked={formData.membresiaPlanId === plan.id}
                            onChange={handleChange}
                            className='text-black focus:ring-black'
                            disabled={loading}
                          />
                          <div>
                            <h4 className='font-semibold text-black'>
                              {plan.nombre}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              Bs. {plan.precio} - {plan.duracionMeses} meses
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              className={`px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 shadow-sm ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition duration-200 shadow-sm flex items-center justify-center ${
                loading
                  ? 'bg-gray-500 cursor-wait'
                  : 'bg-black hover:bg-gray-800'
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Registrando...
                </>
              ) : (
                'Registrar Socio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
