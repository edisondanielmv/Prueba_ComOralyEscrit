import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, User as UserIcon, CreditCard, Loader2, AlertTriangle, Key, HelpCircle, X, GraduationCap } from 'lucide-react';
import { checkSystemAvailability } from '../services/geminiService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [carrera, setCarrera] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validaciones básicas de campos
    if (!fullName.trim() || !cedula.trim() || !carrera.trim()) {
      setError('Por favor complete su Nombre, Cédula y Carrera.');
      return;
    }
    if (cedula.length < 5) {
      setError('Ingrese una cédula válida.');
      return;
    }

    const cleanApiKey = apiKey.trim();

    // 2. Validación de formato de Clave (si el usuario ingresó una)
    if (cleanApiKey) {
        if (!cleanApiKey.startsWith('AIza')) {
            setError('La Clave Personal parece incorrecta. Debe comenzar con los caracteres "AIza". Por favor verifique que copió todo el código.');
            return;
        }
    }

    // 3. Verificación de conexión (Ping a Gemini)
    setIsVerifying(true);
    
    // Pasamos la clave limpia para verificar. Si está vacía, el servicio intentará usar la del sistema.
    const isSystemReady = await checkSystemAvailability(cleanApiKey);
    
    if (!isSystemReady) {
        setIsVerifying(false);
        
        if (cleanApiKey) {
            // Error específico para clave de usuario inválida
            setError('La Clave ingresada fue rechazada por Google. Verifique que la copió correctamente y que es válida.');
        } else {
            // Error genérico de sistema (solo si no puso clave)
            setError('El sistema central está saturado en este momento. Por favor, utilice la opción "¿No tienes clave?" para generar una Clave Personal y asegurar su acceso.');
        }
        return;
    }

    // 4. Todo correcto, procedemos al login
    setIsVerifying(false);
    onLogin({ fullName, cedula, carrera, apiKey: cleanApiKey });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      
      {/* MODAL DE AYUDA */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5"/> Cómo obtener tu Clave Gratis
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6"/>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-gray-600 text-sm">
                Para evitar errores de conexión durante tu examen, generaremos una clave personal gratuita de Google. Toma 30 segundos.
              </p>
              
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">1</span>
                  <div className="text-sm text-gray-700">
                    Abre <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline hover:text-indigo-800">Google AI Studio (Clic aquí)</a> e inicia sesión con tu correo Gmail.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">2</span>
                  <div className="text-sm text-gray-700">
                    Presiona el botón azul grande que dice <strong>"Create API Key"</strong> (o "Crear clave de API").
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">3</span>
                  <div className="text-sm text-gray-700">
                    Copia el código largo que empieza con <code>AIza...</code> y pégalo en la casilla del examen.
                  </div>
                </li>
              </ol>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs text-yellow-800">
                <strong>Nota:</strong> Es totalmente gratuito y seguro. Esta clave solo se usa para calificar tu examen en este momento.
              </div>

              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Entendido, ya tengo mi clave
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-primary p-6 text-center">
          <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Evaluación Académica</h1>
          <p className="text-blue-200 text-sm mt-2 font-light">Comunicación Oral y Escrita</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                  placeholder="Ej: Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cedula" className="block text-sm font-semibold text-gray-700 mb-1">Cédula de Identidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="cedula"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                  placeholder="Ej: 1720304050"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div>
              <label htmlFor="carrera" className="block text-sm font-semibold text-gray-700 mb-1">Carrera / Facultad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="carrera"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                  placeholder="Ej: Ingeniería en Sistemas"
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  disabled={isVerifying}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <div className="flex justify-between items-center mb-2">
                   <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-700">
                       Clave de Acceso Personal
                   </label>
                   <button
                     type="button"
                     onClick={() => setShowHelp(true)}
                     className="text-xs text-accent font-medium hover:text-indigo-800 flex items-center gap-1 transition-colors"
                   >
                     <HelpCircle className="w-3 h-3" />
                     ¿No tienes clave?
                   </button>
               </div>
               
               <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className={`h-5 w-5 transition-colors ${apiKey ? 'text-indigo-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  id="apiKey"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg leading-5 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all ${apiKey && !apiKey.trim().startsWith('AIza') ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
                  placeholder="Pega tu clave aquí (empieza con AIza...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isVerifying}
                />
               </div>
               <p className="text-[11px] text-gray-500 mt-2 leading-snug">
                 Usar tu propia clave asegura que el examen se califique sin interrupciones por saturación del sistema.
               </p>
            </div>
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-start gap-2 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white shadow-md transition-all transform active:scale-95
                ${isVerifying 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-accent hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'
                }`}
          >
            {isVerifying ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin"/> Validando acceso...
                </span>
            ) : (
                "Comenzar Evaluación"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;