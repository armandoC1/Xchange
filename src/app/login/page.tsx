'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';

type Credentials = {
  correo: string
  contrasena: string
}

export default function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    correo: '',
    contrasena: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log('Datos que se enviarán:', credentials)
    try {
      const res = await fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      console.log('Estado de la respuesta:', res.status, res.statusText)
      const contentType = res.headers.get('Content-Type')
      console.log('Content-Type de la respuesta:', contentType)

      const responseText = await res.text()
      console.log('Cuerpo de la respuesta:', responseText)

      if (res.ok) {
        try {
          const data = JSON.parse(responseText)
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('idUsuario', data.idUsuario)
          console.log('id desde login: ', data.idUsuario)
          alert('Inicio de sesión exitoso.')
          router.push('/')
        } catch (parseError) {
          console.error('Error al parsear JSON:', parseError)
          alert('Error al procesar la respuesta del servidor.')
        }
      } else {
        console.error(`Error ${res.status}: ${res.statusText}`)
        alert(`Error ${res.status}: ${res.statusText}`)
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-violet-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="correo" className="sr-only">
                Correo electrónico
              </label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="correo"
                name="correo"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Correo electrónico"
                value={credentials.correo}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="contrasena" className="sr-only">
                Contraseña
              </label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full pl-12 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Contraseña"
                value={credentials.contrasena}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-primary-foreground group-hover:text-primary-foreground/90" aria-hidden="true" />
              </span>
              Iniciar Sesión
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/registro"
              className="font-medium text-violet-600 hover:text-purple-600 transition-colors"
            >
              ¿Aún no tienes cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
