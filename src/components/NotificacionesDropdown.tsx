import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotificaciones } from '../hooks/useNotificaciones';

interface NotificacionesDropdownProps {
  usuarioId: string;
}

export default function NotificacionesDropdown({
  usuarioId,
}: NotificacionesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notificaciones,
    loading,
    error,
    fetchNotificaciones,
    marcarComoLeida,
    notificacionesNoLeidas,
  } = useNotificaciones(usuarioId);

  useEffect(() => {
    if (usuarioId) {
      fetchNotificaciones();
    }
  }, [usuarioId, fetchNotificaciones]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificacionClick = (notificacionId: string) => {
    marcarComoLeida(notificacionId);
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 1) {
      return 'Hace unos minutos';
    } else if (diffHoras < 24) {
      return `Hace ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    } else if (diffDias < 7) {
      return `Hace ${diffDias} día${diffDias > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES');
    }
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
        title='Notificaciones'
      >
        <Bell className='w-5 h-5' />
        {notificacionesNoLeidas > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {notificacionesNoLeidas > 9 ? '9+' : notificacionesNoLeidas}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
          <div className='p-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Notificaciones
            </h3>
          </div>

          <div className='max-h-96 overflow-y-auto'>
            {loading && (
              <div className='p-4 text-center text-gray-500'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto'></div>
                <p className='mt-2 text-sm'>Cargando...</p>
              </div>
            )}

            {error && (
              <div className='p-4 text-center text-red-500'>
                <p className='text-sm'>{error}</p>
              </div>
            )}

            {!loading && !error && notificaciones.length === 0 && (
              <div className='p-4 text-center text-gray-500'>
                <p className='text-sm'>No tienes notificaciones</p>
              </div>
            )}

            {!loading && !error && notificaciones.length > 0 && (
              <div className='divide-y divide-gray-100'>
                {notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.id}
                    onClick={() => handleNotificacionClick(notificacion.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notificacion.leida ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <h4
                          className={`text-sm font-medium ${
                            !notificacion.leida
                              ? 'text-gray-900'
                              : 'text-gray-700'
                          }`}
                        >
                          {notificacion.titulo}
                        </h4>
                        <p
                          className={`text-sm mt-1 ${
                            !notificacion.leida
                              ? 'text-gray-800'
                              : 'text-gray-600'
                          }`}
                        >
                          {notificacion.mensaje}
                        </p>
                        <p className='text-xs text-gray-400 mt-2'>
                          {formatFecha(notificacion.fechaCreacion)}
                        </p>
                      </div>
                      {!notificacion.leida && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2'></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notificaciones.length > 0 && (
            <div className='p-3 border-t border-gray-200'>
              <button
                onClick={() => setIsOpen(false)}
                className='w-full text-center text-sm text-gray-600 hover:text-gray-900'
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
