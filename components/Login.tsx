import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, User as UserIcon, CreditCard } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !cedula.trim()) {
      setError('Por favor complete todos los campos.');
      return;
    }
    if (cedula.length < 5) {
      setError('Ingrese una cédula válida.');
      return;
    }
    onLogin({ fullName, cedula });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-center">
          <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Evaluación Académica</h1>
          <p className="text-blue-200 text-sm mt-2">Comunicación Oral y Escrita</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="cedula"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Ej: 1720304050"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
          >
            Iniciar Evaluación
          </button>
        </form>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Asegúrese de tener una conexión estable a internet para la corrección automática.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;