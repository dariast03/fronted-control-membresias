'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useSocios } from '../../hooks/useSocios';
import { usePlanes } from '../../hooks/usePlanes';
import { usuarioService } from '../../services/usuarioService';

interface RegistrationData {
  // Paso 1: Crear Cuenta
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Paso 2: Datos Profesionales
  idNumber: string;
  profession: string;
  licenseNumber: string;
  phone: string;
  // Paso 3: Plan y Pago
  selectedPlan: string | null;
  paymentMethod: 'card' | 'transfer' | null;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export default function RegistroPage() {
  const navigate = useNavigate();
  const { planes, loading: loadingPlanes, error: errorPlanes } = usePlanes();
  const {
    registrarSocio,
    loading: loadingSocio,
    error: errorSocio,
  } = useSocios();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: '',
    profession: '',
    licenseNumber: '',
    phone: '',
    selectedPlan: null,
    paymentMethod: null,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<string>('');

  const updateField = (field: keyof RegistrationData, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors('');
  };

  const validateStep1 = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrors('Todos los campos son obligatorios');
      return false;
    }
    if (formData.password.length < 8) {
      setErrors('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (
      !formData.idNumber ||
      !formData.profession ||
      !formData.licenseNumber ||
      !formData.phone
    ) {
      setErrors('Todos los campos son obligatorios');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleCompleteLater = () => {
    alert('Puedes completar tu registro más tarde desde tu perfil');
    navigate('/login');
  };

  const handleCompletePayment = async () => {
    if (!formData.selectedPlan) {
      setErrors('Debes seleccionar un plan');
      return;
    }
    if (!formData.paymentMethod) {
      setErrors('Debes seleccionar un método de pago');
      return;
    }
    if (formData.paymentMethod === 'card') {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.expiryDate ||
        !formData.cvv
      ) {
        setErrors('Completa todos los datos de la tarjeta');
        return;
      }
    }

    try {
      // Registrar usuario
      const user = await usuarioService.registrar({
        nombres: `${formData.firstName} ${formData.lastName}`,
        apellidos: formData.lastName,
        email: formData.email,
        password: formData.password,
        rol: 'Usuario',
      });

      // Registrar socio
      await registrarSocio({
        userId: user.id,
        profesion: formData.profession,
        direccion: '', // Campo no presente, dejar vacío
        telefono: formData.phone,
        membresiaPlanId: formData.selectedPlan,
      });

      alert(
        '¡Registro completado exitosamente! Bienvenido al Colegio de Profesionales'
      );
      navigate('/login');
    } catch (err) {
      setErrors('Error al completar el registro. Intenta nuevamente.');
    }
  };

  const selectedPlanData = planes.find((p) => p.id === formData.selectedPlan);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 py-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-xl font-bold text-gray-900'>
            Colegio de Profesionales
          </h1>
        </div>
      </header>

      {/* Progress Indicator - Solo visible en pasos 2 y 3 */}
      {currentStep > 1 && (
        <div className='bg-white border-b border-gray-200 py-6'>
          <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-center gap-4'>
              {/* Paso 1 - Completado */}
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center'>
                  <Check className='w-5 h-5' />
                </div>
                <span className='text-sm font-medium text-gray-600'>
                  Cuenta Creada
                </span>
              </div>

              <div className='w-12 h-0.5 bg-gray-300'></div>

              {/* Paso 2 */}
              <div className='flex items-center gap-2'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > 2 ? <Check className='w-5 h-5' /> : '2'}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  Datos Profesionales
                </span>
              </div>

              <div className='w-12 h-0.5 bg-gray-300'></div>

              {/* Paso 3 */}
              <div className='flex items-center gap-2'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 3
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep === 3 ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  Pago
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Paso 1: Crear Cuenta */}
        {currentStep === 1 && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Crear Cuenta
              </h2>
              <p className='text-gray-600'>
                Regístrate para solicitar tu membresía
              </p>
            </div>

            {errors && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {errors}
              </div>
            )}

            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            >
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Nombre <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Apellido <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Correo Electrónico <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  placeholder='tu@email.com'
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Contraseña <span className='text-red-500'>*</span>
                </label>
                <input
                  type='password'
                  placeholder='Mínimo 8 caracteres'
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Confirmar Contraseña <span className='text-red-500'>*</span>
                </label>
                <input
                  type='password'
                  placeholder='Repite tu contraseña'
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField('confirmPassword', e.target.value)
                  }
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors'
              >
                Crear Cuenta
              </button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className='text-gray-900 font-medium hover:underline'
                >
                  Inicia sesión
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Paso 2: Datos Profesionales */}
        {currentStep === 2 && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Solicitud de Membresía
              </h2>
              <p className='text-gray-600'>
                Complete sus datos profesionales para continuar
              </p>
            </div>

            {errors && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {errors}
              </div>
            )}

            <form
              className='space-y-6'
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            >
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Cédula de Identidad <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Ej: 12345678'
                  value={formData.idNumber}
                  onChange={(e) => updateField('idNumber', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Profesión <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Ej: Ingeniero Civil'
                  value={formData.profession}
                  onChange={(e) => updateField('profession', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Número de Licencia Profesional{' '}
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Ej: IC-12345'
                  value={formData.licenseNumber}
                  onChange={(e) => updateField('licenseNumber', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Teléfono de Contacto <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  placeholder='Ej: +1 234 567 8900'
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent'
                />
              </div>

              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-sm text-gray-700'>
                  <strong>Nota:</strong> Sus datos serán verificados por nuestro
                  equipo. Recibirá una notificación una vez aprobada su
                  solicitud.
                </p>
              </div>

              <div className='flex gap-4'>
                <button
                  type='submit'
                  className='flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors'
                >
                  Continuar al Pago
                </button>
                <button
                  type='button'
                  onClick={handleCompleteLater}
                  className='flex-1 bg-white text-gray-900 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors'
                >
                  Completar Después
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Paso 3: Selección de Plan y Pago */}
        {currentStep === 3 && (
          <div className='space-y-6'>
            <div className='text-center mb-8'>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Seleccione su Plan
              </h2>
              <p className='text-gray-600'>
                Elija el plan que mejor se adapte a sus necesidades
              </p>
            </div>

            {errors && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                {errors}
              </div>
            )}

            <div className='grid lg:grid-cols-3 gap-6'>
              {/* Planes y Método de Pago */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Planes de Membresía */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>
                    Planes de Membresía
                  </h3>
                  <div className='space-y-3'>
                    {planes.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => updateField('selectedPlan', plan.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          formData.selectedPlan === plan.id
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <div className='flex items-center gap-2'>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  formData.selectedPlan === plan.id
                                    ? 'border-gray-900'
                                    : 'border-gray-300'
                                }`}
                              >
                                {formData.selectedPlan === plan.id && (
                                  <div className='w-3 h-3 rounded-full bg-gray-900'></div>
                                )}
                              </div>
                              <span className='font-semibold text-gray-900'>
                                {plan.nombre}
                              </span>
                            </div>
                            <p className='text-sm text-gray-600 ml-7'>
                              Duración: {plan.duracionMeses} meses
                            </p>
                          </div>
                          <div className='text-right'>
                            <div className='text-2xl font-bold text-gray-900'>
                              ${plan.precio}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Método de Pago */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>
                    Método de Pago
                  </h3>

                  <div className='space-y-3 mb-6'>
                    <button
                      onClick={() => updateField('paymentMethod', 'card')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === 'card'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === 'card'
                              ? 'border-gray-900'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.paymentMethod === 'card' && (
                            <div className='w-3 h-3 rounded-full bg-gray-900'></div>
                          )}
                        </div>
                        <svg
                          className='w-5 h-5 text-gray-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <rect
                            x='2'
                            y='5'
                            width='20'
                            height='14'
                            rx='2'
                            strokeWidth='2'
                          />
                          <path d='M2 10h20' strokeWidth='2' />
                        </svg>
                        <span className='font-medium text-gray-900'>
                          Tarjeta de Crédito/Débito
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => updateField('paymentMethod', 'transfer')}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.paymentMethod === 'transfer'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === 'transfer'
                              ? 'border-gray-900'
                              : 'border-gray-300'
                          }`}
                        >
                          {formData.paymentMethod === 'transfer' && (
                            <div className='w-3 h-3 rounded-full bg-gray-900'></div>
                          )}
                        </div>
                        <svg
                          className='w-5 h-5 text-gray-600'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            d='M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                            strokeWidth='2'
                          />
                        </svg>
                        <span className='font-medium text-gray-900'>
                          Transferencia Bancaria
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Formulario de Tarjeta */}
                  {formData.paymentMethod === 'card' && (
                    <div className='space-y-4 pt-4 border-t border-gray-200'>
                      <div>
                        <label className='block text-sm font-medium text-gray-900 mb-2'>
                          Número de Tarjeta
                        </label>
                        <input
                          type='text'
                          placeholder='1234 5678 9012 3456'
                          value={formData.cardNumber}
                          onChange={(e) =>
                            updateField('cardNumber', e.target.value)
                          }
                          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-900 mb-2'>
                          Nombre en la Tarjeta
                        </label>
                        <input
                          type='text'
                          placeholder='Juan Pérez'
                          value={formData.cardName}
                          onChange={(e) =>
                            updateField('cardName', e.target.value)
                          }
                          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                        />
                      </div>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-900 mb-2'>
                            Fecha de Vencimiento
                          </label>
                          <input
                            type='text'
                            placeholder='MM/AA'
                            value={formData.expiryDate}
                            onChange={(e) =>
                              updateField('expiryDate', e.target.value)
                            }
                            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-900 mb-2'>
                            CVV
                          </label>
                          <input
                            type='text'
                            placeholder='123'
                            value={formData.cvv}
                            onChange={(e) => updateField('cvv', e.target.value)}
                            className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='flex gap-4'>
                  <button
                    onClick={handleCompletePayment}
                    className='flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors'
                  >
                    Completar Pago
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className='px-6 bg-white text-gray-900 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors'
                  >
                    Volver
                  </button>
                </div>
              </div>

              {/* Resumen del Pedido */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6'>
                  <h3 className='text-xl font-bold text-gray-900 mb-6'>
                    Resumen del Pedido
                  </h3>

                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Plan Seleccionado</span>
                      <span className='font-medium text-gray-900'>
                        {selectedPlanData ? selectedPlanData.nombre : '-'}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-medium text-gray-900'>
                        ${selectedPlanData ? selectedPlanData.precio : 0}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Impuestos</span>
                      <span className='font-medium text-gray-900'>$0</span>
                    </div>
                  </div>

                  <div className='pt-4 border-t border-gray-200 mb-6'>
                    <div className='flex justify-between'>
                      <span className='text-lg font-bold text-gray-900'>
                        Total
                      </span>
                      <span className='text-2xl font-bold text-gray-900'>
                        ${selectedPlanData ? selectedPlanData.precio : 0}
                      </span>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-lg p-4'>
                    <h4 className='font-semibold text-gray-900 mb-3'>
                      Incluye:
                    </h4>
                    <ul className='space-y-2 text-sm text-gray-600'>
                      <li className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Acceso completo a la plataforma</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Certificado digital de membresía</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Soporte prioritario</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <Check className='w-4 h-4 text-green-600 flex-shrink-0 mt-0.5' />
                        <span>Acceso a eventos exclusivos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
