"use client"

import { useNavigate } from "react-router-dom"
import logo from "../../assets/img/logo.png"

export default function SocioPage() {
  const navigate = useNavigate()
  const username = localStorage.getItem("username") || "Socio"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-lg">
              <a href="#inicio" className="flex items-center gap-2 font-bold text-lg">
                <img src={logo} alt="Logo" className="h-12 w-12 object-contain rounded-full" />
                Panel de Socio
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold">Bienvenido</p>
                <p className="text-sm text-muted-foreground">{username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard de Socio</h1>
          <p className="text-muted-foreground">Gestiona tu membresía y accede a tus beneficios</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Activo</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Estado de Membresía</h3>
            <p className="text-muted-foreground text-sm">Tu membresía está activa y al día</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Próxima Renovación</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">15 Dic 2025</p>
            <p className="text-muted-foreground text-sm">Faltan 8 meses</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Pagos</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">€150.00</p>
            <p className="text-muted-foreground text-sm">Último pago realizado</p>
          </div>
        </div>

        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Información Personal</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Nombre Completo</label>
              <p className="text-lg">{username}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Código de Socio</label>
              <p className="text-lg font-mono">
                COL-2025-
                {Math.floor(Math.random() * 1000)
                  .toString()
                  .padStart(3, "0")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Email</label>
              <p className="text-lg">{username.toLowerCase()}@ejemplo.com</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Teléfono</label>
              <p className="text-lg">+34 600 000 000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
