"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../assets/img/logo.png"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem("role")
    const username = localStorage.getItem("username")
    if (role && username) {
      setIsLoggedIn(true)
      setUserName(username)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    setUserName("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#inicio" className="flex items-center gap-2 font-bold text-lg">
              <img src={logo} alt="Logo" className="h-12 w-12 object-contain rounded-full" />
              Colegio de Profesionales
            </a>

            <div className="hidden md:flex items-center gap-6">
              <a href="#inicio" className="text-foreground hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="#caracteristicas" className="text-foreground hover:text-primary transition-colors">
                Características
              </a>
              <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors">
                Cómo Funciona
              </a>

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {userName}
                  </span>
                  <button
                    onClick={() => navigate("/socio")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Mi Cuenta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-12">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Sistema de Control
                <br />
                de Membresías
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-pretty">
                Gestiona tu membresía profesional de forma simple y segura. Registro, pagos y renovaciones en un solo
                lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={() => navigate("/socio")}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                    </svg>
                    Ir a Mi Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/register")}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Registrarse Ahora
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <img
                  src="./membresia.jpg"
                  alt="Tarjeta de Membresía Profesional"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas</h2>
            <p className="text-xl text-muted-foreground">
              Una plataforma completa para gestionar tu membresía profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Registro Simple</h3>
              <p className="text-muted-foreground">
                Proceso de registro rápido y sencillo. Completa tu perfil en minutos y comienza a disfrutar de los
                beneficios.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 002-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Pagos Seguros</h3>
              <p className="text-muted-foreground">
                Realiza tus pagos de forma segura con múltiples métodos de pago. Historial completo de transacciones.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Renovación Automática</h3>
              <p className="text-muted-foreground">
                Renueva tu membresía con un solo clic. Recibe notificaciones antes del vencimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground">Tres simples pasos para gestionar tu membresía</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Crea tu Cuenta</h3>
              <p className="text-muted-foreground">Regístrate con tus datos básicos para crear tu cuenta</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Solicita tu Membresía</h3>
              <p className="text-muted-foreground">Completa tu información profesional y selecciona tu plan</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Gestiona tu Cuenta</h3>
              <p className="text-muted-foreground">Accede a tu dashboard y gestiona tu membresía fácilmente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
  className="py-20 bg-[url('/src/assets/fondo.jpg')] bg-cover bg-center text-primary-foreground text-center"
>
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-black/50 p-8 rounded-xl">
    <h2 className="text-4xl font-bold mb-4">Únete al Colegio de Profesionales</h2>
    <p className="text-xl mb-8 opacity-90">
      Forma parte de nuestra comunidad profesional y accede a todos los beneficios exclusivos
    </p>
    {isLoggedIn ? (
      <button
        onClick={() => navigate("/socio")}
        className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors text-lg font-semibold"
      >
        Ir a Mi Dashboard
      </button>
    ) : (
      <button
        onClick={() => navigate("/register")}
        className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors text-lg font-semibold"
      >
        Registrarse Ahora
      </button>
    )}
  </div>
</section>


      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">Colegio de Profesionales</h5>
              <p className="text-sm text-muted-foreground">Sistema de gestión de membresías profesionales</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Navegación</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#inicio" className="text-muted-foreground hover:text-foreground transition-colors">
                    Inicio
                  </a>
                </li>
                {!isLoggedIn && (
                  <>
                    <li>
                      <a href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                        Iniciar Sesión
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => navigate("/register")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Registrarse
                      </button>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <li>
                    <a href="/socio" className="text-muted-foreground hover:text-foreground transition-colors">
                      Mi Cuenta
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Soporte</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Colegio de Profesionales. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
