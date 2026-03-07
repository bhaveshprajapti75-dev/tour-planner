import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Navbar from '../components/layout/Navbar';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, loading, isAuthenticated } = useAuthStore();
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect');
      if (redirect) navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'login') {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success('Welcome back!');
        const redirect = searchParams.get('redirect');
        if (redirect) {
          navigate(redirect);
        } else if (result.user?.is_superuser || result.user?.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else if (result.user?.role === 'AGENT') {
          navigate('/agent');
        } else {
          navigate('/planner/wizard');
        }
      } else {
        toast.error(result.error);
      }
    } else {
      const regData = { name: form.name, email: form.email, phone: form.phone, password: form.password };
      const result = await register(regData);
      if (result.success) {
        toast.success('Account created! Please login.');
        setMode('login');
        setForm(f => ({ ...f, name: '', phone: '' }));
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-d-canvas flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-d-card rounded-[2.5rem] shadow-xl shadow-ink/5 dark:shadow-black/20 border border-gray-100 dark:border-white/[0.08] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-brand/5 to-brand/10 dark:from-brand/10 dark:to-brand/5 p-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink dark:text-white mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-ink-light dark:text-white/60 text-sm font-medium">
              {mode === 'login' ? 'Sign in to continue planning' : 'Register to unlock all features'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-canvas dark:bg-d-surface p-1.5 mx-6 mt-6 rounded-full border border-gray-200/60 dark:border-white/[0.08] shadow-inner">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-full text-xs tracking-wide font-bold transition-all cursor-pointer capitalize
                  ${mode === m ? 'text-white bg-brand shadow-md' : 'text-ink-light dark:text-white/50 hover:text-ink dark:hover:text-white'}`}>
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {mode === 'register' && (
                  <InputField icon={User} placeholder="Full Name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                )}
                <InputField icon={Mail} type="email" placeholder="Email Address" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
                {mode === 'register' && (
                  <InputField icon={Phone} placeholder="Mobile Number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                )}
                <InputField icon={Lock} type="password" placeholder="Password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />

                <button type="submit" disabled={loading}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-bold hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-6 disabled:opacity-60">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-ink-light dark:text-white/50 pt-4 border-t border-gray-100 dark:border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-brand" /> Secure & encrypted
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

function InputField({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/30" />
      <input {...props}
        className="w-full pl-12 pr-4 py-3.5 bg-canvas dark:bg-d-surface rounded-2xl border border-transparent focus:bg-white dark:focus:bg-d-card focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-white/30 font-medium text-ink dark:text-white" />
    </div>
  );
}
