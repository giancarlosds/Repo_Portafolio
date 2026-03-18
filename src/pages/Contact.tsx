import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const { error } = await supabase.from('contact_messages').insert([{
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    }]);

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Pongámonos en contacto</h1>
        <p className="text-text-muted text-lg">
          ¿Tienes un proyecto en mente o simplemente quieres saludar? Llena el formulario a continuación o contáctame directamente.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-bg-card border border-border-dark p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Email</p>
                  <a href="mailto:hola@giancarlos.dev" className="font-medium hover:text-primary transition-colors">
                    hola@giancarlos.dev
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Teléfono</p>
                  <a href="tel:+34600000000" className="font-medium hover:text-primary transition-colors">
                    +34 600 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-text-muted mb-1">Ubicación</p>
                  <p className="font-medium">Madrid, España</p>
                  <p className="text-sm text-text-muted mt-1">Disponible para trabajo remoto en todo el mundo.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-border-dark">
              <p className="text-sm text-text-muted mb-4">Sígueme en redes sociales</p>
              <div className="flex gap-4">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="p-3 bg-bg-surface border border-border-dark rounded-xl hover:text-primary hover:border-primary/50 transition-colors">
                  <Github size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-3 bg-bg-surface border border-border-dark rounded-xl hover:text-primary hover:border-primary/50 transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="p-3 bg-bg-surface border border-border-dark rounded-xl hover:text-primary hover:border-primary/50 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-48 rounded-2xl overflow-hidden border border-border-dark relative">
            <img
              src="https://picsum.photos/seed/map/800/400"
              alt="Ubicación en el mapa"
              className="w-full h-full object-cover grayscale opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-bg-card border border-border-dark p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Envíame un mensaje</h2>

            {/* Feedback messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl"
              >
                <CheckCircle className="text-primary shrink-0 mt-0.5" size={18} />
                <p className="text-primary text-sm">
                  ¡Mensaje enviado! Me pondré en contacto contigo lo antes posible.
                </p>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <p className="text-red-400 text-sm">
                  Error al enviar el mensaje. Por favor, inténtalo de nuevo.
                </p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-text-muted">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-bg-surface border border-border-dark rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-text-muted">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-bg-surface border border-border-dark rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-text-muted">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-surface border border-border-dark rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="¿De qué trata tu mensaje?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-text-muted">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-surface border border-border-dark rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-bg-dark font-bold rounded-xl px-6 py-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
