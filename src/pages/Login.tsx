import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Palabra secreta cifrada en Base64 ──────────────────────────────────────
// Para cambiarla: btoa('NUEVA_PALABRA') y reemplaza el valor.
// No almacenes la palabra en texto plano en este archivo.
const _ACCESO = 'UEVQSU5P'; // Base64 de la clave de acceso
// ─────────────────────────────────────────────────────────────────────────────

type Step = 'secret' | 'auth';
type Tab  = 'login' | 'register';

function verificarClave(input: string): boolean {
  try {
    return btoa(input.trim().toUpperCase()) === _ACCESO;
  } catch {
    return false;
  }
}

export default function Login() {
  // Step 1: gate de palabra secreta
  const [step, setStep]           = useState<Step>('secret');
  const [secretInput, setSecret]  = useState('');
  const [secretError, setSecretError] = useState(false);
  const [secretShake, setSecretShake] = useState(false);

  // Step 2: formulario de auth
  const [tab, setTab]             = useState<Tab>('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // ── Verificación de palabra secreta ─────────────────────────────────────
  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificarClave(secretInput)) {
      setSecretError(false);
      setStep('auth');
    } else {
      setSecretError(true);
      setSecretShake(true);
      setSecret('');
      setTimeout(() => setSecretShake(false), 600);
    }
  };

  // ── Formulario de autenticación ──────────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (tab === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else {
        navigate('/admin');
      }
    } else {
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Cuenta creada. Inicia sesión para continuar (puede requerirse confirmar el email).');
      }
    }

    setLoading(false);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-bg-dark font-bold text-xl mb-4">
            GD
          </div>
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <p className="text-text-muted mt-1 text-sm">Acceso restringido</p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ─── PASO 1: PALABRA SECRETA ─────────────────────────────────── */}
          {step === 'secret' && (
            <motion.div
              key="secret-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                animate={secretShake ? {
                  x: [-8, 8, -8, 8, -4, 4, 0],
                  transition: { duration: 0.5 }
                } : {}}
                className="bg-bg-surface border border-border-dark rounded-2xl p-8"
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <KeyRound size={32} className="text-primary" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-center mb-2">Acceso protegido</h2>
                <p className="text-text-muted text-sm text-center mb-8">
                  Introduce la palabra clave para continuar.
                </p>

                {/* Error message */}
                {secretError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-red-400 text-sm">Palabra incorrecta. Inténtalo de nuevo.</p>
                  </motion.div>
                )}

                <form onSubmit={handleSecretSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="secret-word" className="text-sm font-medium text-text-muted">
                      Palabra secreta
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        id="secret-word"
                        type="password"
                        value={secretInput}
                        onChange={e => {
                          setSecret(e.target.value);
                          setSecretError(false);
                        }}
                        required
                        autoComplete="off"
                        placeholder="••••••"
                        className={`w-full bg-bg-dark border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors ${
                          secretError
                            ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-border-dark focus:border-primary focus:ring-primary'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    id="btn-secret-submit"
                    type="submit"
                    className="w-full bg-primary text-bg-dark font-bold rounded-xl py-3 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={18} />
                    Verificar acceso
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}

          {/* ─── PASO 2: FORMULARIO DE AUTENTICACIÓN ─────────────────────── */}
          {step === 'auth' && (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-bg-surface border border-border-dark rounded-2xl p-8">
                {/* Verified badge */}
                <div className="flex items-center justify-center gap-2 mb-6 py-2 px-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-primary text-xs font-medium">Acceso verificado</span>
                </div>

                {/* Tabs */}
                <div className="flex bg-bg-dark rounded-xl p-1 mb-8">
                  <button
                    id="tab-login"
                    onClick={() => handleTabChange('login')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === 'login'
                        ? 'bg-primary text-bg-dark shadow'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    id="tab-register"
                    onClick={() => handleTabChange('register')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      tab === 'register'
                        ? 'bg-primary text-bg-dark shadow'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    Registrarse
                  </button>
                </div>

                {/* Auth messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                    >
                      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                      <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-6 flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl"
                    >
                      <CheckCircle className="text-primary shrink-0 mt-0.5" size={18} />
                      <p className="text-primary text-sm">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="login-email" className="text-sm font-medium text-text-muted">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="admin@ejemplo.com"
                        className="w-full bg-bg-dark border border-border-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="login-password" className="text-sm font-medium text-text-muted">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-bg-dark border border-border-dark rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="btn-submit-auth"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-bg-dark font-bold rounded-xl py-3 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" />
                    ) : tab === 'login' ? (
                      <><LogIn size={18} /> Iniciar Sesión</>
                    ) : (
                      <><UserPlus size={18} /> Crear Cuenta</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        <p className="text-center text-text-muted text-sm mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Volver al portafolio</a>
        </p>
      </div>
    </div>
  );
}
