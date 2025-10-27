'use client';

import type React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { usuarioService } from '../../services/usuarioService';

const API_BASE_URL = 'https://localhost:7249';
const REGISTER_ENDPOINT = '/api/Auth/Register';
const API_REGISTER_URL = API_BASE_URL + REGISTER_ENDPOINT;

interface RegisterModalProps {
  show: boolean;
  handleClose: () => void;
}

const RegisterModal = ({ show, handleClose }: RegisterModalProps) => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('Usuario');
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (
      nombres.trim() === '' ||
      apellidos.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      setRegisterError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await usuarioService.registrar({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        email: email.trim(),
        password: password.trim(),
        rol: rol,
      });
      alert(`¡Registro exitoso para ${nombres}! Ya puedes iniciar sesión.`);
      setNombres('');
      setApellidos('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      handleClose();
    } catch (error) {
      setRegisterError('Error al registrar. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
      <div className='bg-card rounded-xl shadow-xl max-w-md w-full'>
        <div className='bg-primary text-primary-foreground px-6 py-4 rounded-t-xl flex justify-between items-center'>
          <h3 className='text-xl font-bold flex items-center gap-2'>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
            </svg>
            Formulario de Registro
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className='text-primary-foreground hover:opacity-80 transition-opacity'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='p-6'>
          {registerError && (
            <div className='mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3'>
              <svg
                className='w-5 h-5 text-destructive flex-shrink-0 mt-0.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <div className='text-sm text-destructive'>{registerError}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className='space-y-4'>
            <div>
              <label
                htmlFor='nombres'
                className='block text-sm font-semibold mb-2'
              >
                Nombres
              </label>
              <input
                type='text'
                id='nombres'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                placeholder='Ingresa tus nombres'
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor='apellidos'
                className='block text-sm font-semibold mb-2'
              >
                Apellidos
              </label>
              <input
                type='text'
                id='apellidos'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                placeholder='Ingresa tus apellidos'
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-semibold mb-2'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                placeholder='Ingresa tu email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-semibold mb-2'
              >
                Contraseña
              </label>
              <input
                type='password'
                id='password'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                placeholder='Crea una contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-semibold mb-2'
              >
                Confirmar Contraseña
              </label>
              <input
                type='password'
                id='confirmPassword'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                placeholder='Repite la contraseña'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor='rol' className='block text-sm font-semibold mb-2'>
                Rol
              </label>
              <select
                id='rol'
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring'
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                disabled={loading}
              >
                <option value='Usuario'>Usuario</option>
                <option value='Admin'>Admin</option>
              </select>
            </div>
            <button
              type='submit'
              className='w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className='animate-spin h-5 w-5'
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
                <>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
                  </svg>
                  Registrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      console.log('🚀 ~ handleLogin ~ user:', user);
      // Navegar basado en rol
      if (user?.rol === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/socio');
      }
    } catch (err) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <a href='/' className='flex items-center gap-2 font-bold text-lg'>
              <img
                src={logo}
                alt='Logo'
                className='h-12 w-12 object-contain rounded-full'
              />
              Colegio de Profesionales
            </a>
            <button
              onClick={() => navigate('/')}
              className='px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors'
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/50 to-background flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center'>
          {/* Login Card */}
          <div className='bg-card border border-border rounded-xl shadow-xl p-8'>
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-10 h-10'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h2 className='text-3xl font-bold mb-2'>Iniciar Sesión</h2>
              <p className='text-muted-foreground'>
                Ingresa tus credenciales para acceder
              </p>
            </div>

            {error && (
              <div className='mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3'>
                <svg
                  className='w-5 h-5 text-destructive flex-shrink-0 mt-0.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <div className='text-sm text-destructive'>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold mb-2 flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg'
                  placeholder='Ingresa tu email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className='block text-sm font-semibold mb-2 flex items-center gap-2'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Contraseña
                </label>
                <input
                  type='password'
                  className='w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg'
                  placeholder='Ingresa tu contraseña'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type='submit'
                className='w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin h-5 w-5'
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
                    Ingresando...
                  </>
                ) : (
                  <>
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Ingresar
                  </>
                )}
              </button>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-muted-foreground mb-2'>
                ¿No tienes una cuenta?
              </p>
              <button
                onClick={() => navigate('/register')}
                className='text-primary font-semibold hover:underline'
              >
                Regístrate aquí
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className='hidden lg:block'>
            <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6'>
              <h6 className='font-bold text-lg mb-4 flex items-center gap-2'>
                <svg
                  className='w-5 h-5 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-4 0 1 1 0 014 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
                Credenciales de prueba
              </h6>
              <div className='space-y-3 text-sm'>
                <div>
                  <strong>Admin:</strong> usuario:{' '}
                  <code className='bg-white px-2 py-1 rounded'>admin</code> /
                  contraseña:{' '}
                  <code className='bg-white px-2 py-1 rounded'>12345</code>
                </div>
                <div>
                  <strong>Socio:</strong> usuario:{' '}
                  <code className='bg-white px-2 py-1 rounded'>socio</code> /
                  contraseña:{' '}
                  <code className='bg-white px-2 py-1 rounded'>12345</code>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <h6 className='font-bold mb-1'>Seguridad</h6>
                  <p className='text-sm text-muted-foreground'>
                    Datos protegidos con encriptación
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 0116 0zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <h6 className='font-bold mb-1'>Disponibilidad 24/7</h6>
                  <p className='text-sm text-muted-foreground'>
                    Accede cuando lo necesites
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-6 h-6'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z' />
                  </svg>
                </div>
                <div>
                  <h6 className='font-bold mb-1'>Rápido y Fácil</h6>
                  <p className='text-sm text-muted-foreground'>
                    Interfaz intuitiva y moderna
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-primary text-primary-foreground py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='flex items-center gap-2'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z' />
              </svg>
              &copy; 2025 Colegio de Profesionales
            </p>
            <div className='flex gap-6'>
              <a href='#' className='hover:opacity-80 transition-opacity'>
                Términos
              </a>
              <a href='#' className='hover:opacity-80 transition-opacity'>
                Privacidad
              </a>
              <a href='#' className='hover:opacity-80 transition-opacity'>
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
