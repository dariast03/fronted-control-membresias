import React, { useState } from 'react';

// URL simulada del endpoint de la API
const API_REGISTRO_URL = 'https://tuapi.com/api/Socios/Registrar';

export default function RegistrarSocio() {
  const [formData, setFormData] = useState({
    nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '',
    ciudad: '', codigoPostal: '', profesion: '', 
    especialidad: '', fechaNacimiento: '', tipoCuota: 'mensual', 
    metodoPago: 'transferencia',
    // Campos para Tarjeta de Crédito (solo usados si metodoPago === 'tarjeta')
    cardNumber: '',
    cardHolder: '',
    cardExpiry: '', // Formato MM/YY
    cardCVC: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSuccessMessage(null);
    setErrorMessage(null);

    let newValue = value;

    if (name === 'dni') {
        // Validación para C.I.: solo números, máximo 8 dígitos
        const ciValue = value.replace(/[^0-9]/g, '').slice(0, 8); 
        newValue = ciValue;
    } else if (name === 'cardNumber') {
        // Número de tarjeta: solo dígitos, max 16. Y se separan en grupos de 4.
        const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
        // Formatear: inserta un espacio después de cada 4 dígitos
        newValue = digitsOnly.match(/.{1,4}/g)?.join(' ') || '';
    } else if (name === 'cardCVC') {
        // CVC: solo dígitos, max 4
        newValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'cardExpiry') {
        // Vencimiento MM/AA: formato automático con barra
        const inputDigits = value.replace(/\D/g, '').slice(0, 4);
        let formattedExpiry = inputDigits;
        if (inputDigits.length > 2) {
            // Inserta la barra después de los primeros 2 dígitos (MM)
            formattedExpiry = inputDigits.slice(0, 2) + '/' + inputDigits.slice(2, 4);
        }
        newValue = formattedExpiry;
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Validación básica de campos obligatorios
    if (!formData.nombre || !formData.dni || !formData.email || !formData.profesion || !formData.fechaNacimiento) {
      setErrorMessage('Por favor, complete todos los campos obligatorios (*).');
      setLoading(false);
      return;
    }
    
    // 1. Validación de formato estricta de Cédula de Identidad (CI) - 8 dígitos
    if (formData.dni.length !== 8 || isNaN(Number(formData.dni))) {
        setErrorMessage('La Cédula de Identidad (C.I.) debe ser un número válido de **exactamente 8 dígitos**.');
        setLoading(false);
        return;
    }

    let rawCardNumber = '';
    
    // 2. Validación de datos de tarjeta si el método es 'tarjeta'
    if (formData.metodoPago === 'tarjeta') {
        // Extraer solo dígitos, ignorando los espacios para la validación
        rawCardNumber = formData.cardNumber.replace(/\s/g, ''); 

        if (!rawCardNumber || !formData.cardHolder || !formData.cardExpiry || !formData.cardCVC) {
            setErrorMessage('Por favor, complete todos los campos de la tarjeta de crédito.');
            setLoading(false);
            return;
        }
        if (rawCardNumber.length !== 16) { // Usamos el valor sin espacios para la validación de 16 dígitos
            setErrorMessage('El número de tarjeta debe contener exactamente 16 dígitos.');
            setLoading(false);
            return;
        }
        if (formData.cardExpiry.length !== 5 || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
            setErrorMessage('La fecha de vencimiento debe estar en formato MM/AA (Mes/Año).');
            setLoading(false);
            return;
        }
        if (formData.cardCVC.length < 3 || formData.cardCVC.length > 4) {
            setErrorMessage('El código CVC debe contener 3 o 4 dígitos.');
            setLoading(false);
            return;
        }
    }
    
    // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
    try {
      // Simulación de tiempo de espera
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Simulación de error de tarjeta: se usa el valor sin espacios (rawCardNumber)
      if (formData.metodoPago === 'tarjeta' && rawCardNumber === '4000400040004000') {
          throw new Error('La tarjeta ha sido rechazada. Fondos insuficientes o datos inválidos. Intente con otra tarjeta.');
      }

      // Simulación de éxito
      console.log('Socio registrado:', formData);
      setSuccessMessage(`✅ Socio ${formData.nombre} ${formData.apellidos} registrado con éxito.`);
      
      // Resetear el formulario después del éxito
      setFormData({
        nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '',
        ciudad: '', codigoPostal: '', profesion: '', 
        especialidad: '', fechaNacimiento: '', tipoCuota: 'mensual', 
        metodoPago: 'transferencia',
        cardNumber: '', cardHolder: '', cardExpiry: '', cardCVC: ''
      });

    } catch (error) {
      console.error('Error de registro:', error.message);
      setErrorMessage(`❌ Error al registrar: ${error.message || 'Error de conexión con el servidor.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Estilos de foco compartido
  const inputStyle = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 transition duration-150";


  return (
    <div className="w-full h-full py-8 bg-gray-100 min-h-screen font-sans"> 
      <div className="mx-auto px-4 md:px-8 max-w-6xl space-y-6"> 
        
        {/* Título de la Sección */}
        <div>
          <h2 className="font-bold text-3xl mb-1 text-black">Formulario de Registro de Socio</h2>
          <p className="text-gray-500 text-sm font-light">Complete los datos personales, de dirección, profesionales y de pago.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensajes de feedback */}
            {successMessage && (
                <div className="p-4 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300 transition duration-300 shadow-sm">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300 transition duration-300 shadow-sm">
                    {errorMessage}
                </div>
            )}

            {/* Sección: Datos Personales */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan" required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* Apellidos */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Apellidos *</label>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Ej: Pérez García" required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* DNI/C.I. - 8 dígitos */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cédula de Identidad (C.I.) *</label>
                  <input 
                    type="text" 
                    name="dni" 
                    value={formData.dni} 
                    onChange={handleChange} 
                    placeholder="8 dígitos (solo números)" 
                    required
                    className={inputStyle} 
                    disabled={loading}
                    maxLength={8} 
                    inputMode="numeric"
                  />
                </div>
                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                  <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ejemplo@email.com" required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+591 XXXXXXXX" required
                    className={inputStyle} disabled={loading} />
                </div>
              </div>
            </div>

            {/* Sección: Dirección */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100">Dirección</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Dirección Completa */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dirección Completa *</label>
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número, zona" required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* Ciudad */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad *</label>
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="La Paz / Santa Cruz" required
                    className={inputStyle} disabled={loading} />
                </div>
                {/* Código Postal */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Código Postal *</label>
                  <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="9999" required
                    className={inputStyle} disabled={loading} />
                </div>
                <div className="hidden md:block"></div> 
              </div>
            </div>

            {/* Sección: Datos Profesionales y Cuota */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-xl mb-5 text-black border-b pb-3 border-gray-100">Datos Profesionales y Cuota</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Profesión */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Profesión *</label>
                  <select name="profesion" value={formData.profesion} onChange={handleChange} required
                    className={inputStyle} disabled={loading}>
                    <option value="">Seleccione una profesión</option>
                    <option value="Ingeniero Civil">Ingeniero Civil</option>
                    <option value="Arquitecto">Arquitecto</option>
                    <option value="Ingeniero Industrial">Ingeniero Industrial</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                {/* Especialidad */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Especialidad</label>
                  <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Ej: Estructuras"
                    className={inputStyle} disabled={loading} />
                </div>
                <div className="hidden md:block"></div> 
                
                {/* Tipo de Cuota (Bs.) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Cuota *</label>
                  <select name="tipoCuota" value={formData.tipoCuota} onChange={handleChange} required
                    className={inputStyle} disabled={loading}>
                    <option value="mensual">Mensual - Bs. 350/mes</option>
                    <option value="trimestral">Trimestral - Bs. 1000/3 meses</option>
                    <option value="semestral">Semestral - Bs. 1950/6 meses</option>
                    <option value="anual">Anual - Bs. 3800/año</option>
                  </select>
                </div>
                {/* Método de Pago */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Método de Pago *</label>
                  <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} required
                    className={inputStyle} disabled={loading}>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="domiciliacion">Domiciliación Bancaria</option>
                    <option value="tarjeta">Tarjeta de Crédito</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                </div>
                <div className="hidden md:block"></div> 

                {/* Renderizado Condicional de los campos de Tarjeta de Crédito */}
                {formData.metodoPago === 'tarjeta' && (
                    <div className="md:col-span-3 pt-4 border-t border-gray-100 mt-4">
                        <h4 className="font-semibold text-base mb-3 text-black">Detalles de la Tarjeta de Crédito</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                            {/* Titular */}
                            <div className="md:col-span-4">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Titular *</label>
                                <input type="text" name="cardHolder" value={formData.cardHolder} onChange={handleChange} placeholder="Como aparece en la tarjeta" required
                                    className={inputStyle} disabled={loading} />
                            </div>
                            {/* Número de Tarjeta */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Número de Tarjeta (16 dígitos) *</label>
                                <input 
                                    type="text" 
                                    name="cardNumber" 
                                    value={formData.cardNumber} 
                                    onChange={handleChange} 
                                    placeholder="XXXX XXXX XXXX XXXX (Prueba '4000400040004000' para error)" 
                                    required
                                    className={inputStyle} 
                                    disabled={loading} 
                                    inputMode="numeric" 
                                    maxLength={19} // 16 dígitos + 3 espacios
                                />
                            </div>
                            {/* Vencimiento */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Vencimiento (MM/AA) *</label>
                                <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} placeholder="MM/AA" required
                                    className={inputStyle} disabled={loading} inputMode="numeric" maxLength={5} />
                            </div>
                            {/* CVC */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">CVC *</label>
                                <input type="text" name="cardCVC" value={formData.cardCVC} onChange={handleChange} placeholder="CVC" required
                                    className={inputStyle} disabled={loading} inputMode="numeric" maxLength={4} />
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                className={`px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 shadow-sm ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition duration-200 shadow-sm flex items-center justify-center ${
                  loading ? 'bg-gray-500 cursor-wait' : 'bg-black hover:bg-gray-800'
                }`}
                disabled={loading}
              >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                    </>
                ) : 'Registrar Socio'}
              </button>
            </div>
            
        </form>
      </div>
    </div>
  );
}
