import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Github,
  Star,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Project, ContactMessage, ProjectFormData } from '../types';

type Tab = 'projects' | 'messages';

const EMPTY_FORM: ProjectFormData = {
  title: '',
  description: '',
  image_url: '',
  project_url: '',
  github_url: '',
  technologies: '',
  featured: false,
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data as Project[]);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data as ContactMessage[]);
  };

  // Form handlers
  const handleOpenCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormStatus('idle');
    setFormError('');
    setShowForm(true);
  };

  const handleOpenEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      image_url: project.image_url ?? '',
      project_url: project.project_url ?? '',
      github_url: project.github_url ?? '',
      technologies: project.technologies.join(', '),
      featured: project.featured,
    });
    setEditingId(project.id);
    setFormStatus('idle');
    setFormError('');
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormStatus('idle');
    setFormError('');
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm(prev => ({ ...prev, [target.name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormStatus('idle');
    setFormError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      project_url: form.project_url.trim() || null,
      github_url: form.github_url.trim() || null,
      technologies: form.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      featured: form.featured,
    };

    let error = null;

    if (editingId) {
      const res = await supabase.from('projects').update(payload).eq('id', editingId);
      error = res.error;
    } else {
      const res = await supabase.from('projects').insert([payload]);
      error = res.error;
    }

    if (error) {
      setFormStatus('error');
      setFormError('Error al guardar el proyecto. Inténtalo de nuevo.');
    } else {
      setFormStatus('success');
      await fetchProjects();
      setTimeout(() => {
        handleCloseForm();
      }, 1000);
    }

    setFormLoading(false);
  };

  // Delete handlers
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await supabase.from('projects').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleteLoading(false);
    await fetchProjects();
  };

  // Sign out
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-surface border-r border-border-dark flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border-dark">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-bg-dark">
              GD
            </div>
            <span className="font-bold text-xl tracking-tight">Admin</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:bg-bg-card hover:text-text-main'
            }`}
          >
            <FolderKanban size={20} />
            Proyectos
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary/10 text-primary'
                : 'text-text-muted hover:bg-bg-card hover:text-text-main'
            }`}
          >
            <MessageSquare size={20} />
            Mensajes
            {messages.length > 0 && (
              <span className="ml-auto bg-primary text-bg-dark text-xs font-bold px-2 py-0.5 rounded-full">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {/* User info + logout */}
        <div className="p-4 border-t border-border-dark space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-bg-surface border-b border-border-dark flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-primary" />
            <h1 className="font-bold text-lg">
              {activeTab === 'projects' ? 'Proyectos' : 'Mensajes de Contacto'}
            </h1>
          </div>
          {activeTab === 'projects' && (
            <button
              id="btn-new-project"
              onClick={handleOpenCreate}
              className="bg-primary text-bg-dark px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              Nuevo Proyecto
            </button>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">

            {/* ---- PROJECTS TAB ---- */}
            {activeTab === 'projects' && (
              <>
                {loading && (
                  <div className="flex justify-center py-24">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {!loading && projects.length === 0 && (
                  <div className="text-center py-24 bg-bg-surface border border-border-dark rounded-2xl">
                    <FolderKanban size={48} className="text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted mb-4">Aún no tienes proyectos.</p>
                    <button
                      onClick={handleOpenCreate}
                      className="bg-primary text-bg-dark px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                    >
                      Crear primer proyecto
                    </button>
                  </div>
                )}

                {!loading && projects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-bg-surface border border-border-dark rounded-xl overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-bg-dark text-text-muted border-b border-border-dark">
                          <tr>
                            <th className="px-6 py-3 font-medium">Proyecto</th>
                            <th className="px-6 py-3 font-medium">Tecnologías</th>
                            <th className="px-6 py-3 font-medium">Destacado</th>
                            <th className="px-6 py-3 font-medium">Fecha</th>
                            <th className="px-6 py-3 font-medium text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark">
                          {projects.map(project => (
                            <tr key={project.id} className="hover:bg-bg-card/50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium">{project.title}</p>
                                  <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{project.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies.slice(0, 3).map(t => (
                                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                      {t}
                                    </span>
                                  ))}
                                  {project.technologies.length > 3 && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-bg-dark text-text-muted border border-border-dark">
                                      +{project.technologies.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {project.featured ? (
                                  <Star size={16} className="text-primary fill-primary" />
                                ) : (
                                  <Star size={16} className="text-text-muted" />
                                )}
                              </td>
                              <td className="px-6 py-4 text-text-muted">{formatDate(project.created_at)}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {project.project_url && (
                                    <a
                                      href={project.project_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label="Ver proyecto"
                                      className="p-1.5 text-text-muted hover:text-primary transition-colors rounded"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  )}
                                  {project.github_url && (
                                    <a
                                      href={project.github_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      aria-label="Ver GitHub"
                                      className="p-1.5 text-text-muted hover:text-primary transition-colors rounded"
                                    >
                                      <Github size={16} />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => handleOpenEdit(project)}
                                    aria-label="Editar proyecto"
                                    className="p-1.5 text-text-muted hover:text-primary transition-colors rounded"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteId(project.id)}
                                    aria-label="Eliminar proyecto"
                                    className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* ---- MESSAGES TAB ---- */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-24 bg-bg-surface border border-border-dark rounded-2xl">
                    <MessageSquare size={48} className="text-text-muted mx-auto mb-4" />
                    <p className="text-text-muted">No hay mensajes de contacto aún.</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-bg-surface border border-border-dark rounded-xl p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-bold">{msg.name}</p>
                        <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
                      </div>
                      <p className="text-text-muted text-xs shrink-0">{formatDate(msg.created_at)}</p>
                    </div>
                    <p className="font-medium mb-2 text-primary">{msg.subject}</p>
                    <p className="text-text-muted text-sm leading-relaxed">{msg.message}</p>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* ---- PROJECT FORM MODAL ---- */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-bg-surface border border-border-dark rounded-2xl mt-8 mb-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-dark">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-bg-card"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                {/* Feedback */}
                {formStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl"
                  >
                    <CheckCircle className="text-primary shrink-0" size={18} />
                    <p className="text-primary text-sm">¡Proyecto guardado correctamente!</p>
                  </motion.div>
                )}
                {formStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <AlertCircle className="text-red-500 shrink-0" size={18} />
                    <p className="text-red-400 text-sm">{formError}</p>
                  </motion.div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="proj-title" className="text-sm font-medium text-text-muted">
                    Nombre del proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="proj-title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                    placeholder="Mi Proyecto Increíble"
                    className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="proj-desc" className="text-sm font-medium text-text-muted">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="proj-desc"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleFormChange}
                    required
                    placeholder="Describe brevemente el proyecto y su propósito..."
                    className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label htmlFor="proj-tech" className="text-sm font-medium text-text-muted">
                    Tecnologías <span className="text-xs text-text-muted">(separadas por comas)</span>
                  </label>
                  <input
                    id="proj-tech"
                    name="technologies"
                    type="text"
                    value={form.technologies}
                    onChange={handleFormChange}
                    placeholder="React, TypeScript, Supabase, Tailwind CSS"
                    className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label htmlFor="proj-img" className="text-sm font-medium text-text-muted">URL de la imagen</label>
                  <input
                    id="proj-img"
                    name="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={handleFormChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Project URL */}
                  <div className="space-y-2">
                    <label htmlFor="proj-url" className="text-sm font-medium text-text-muted">URL del proyecto</label>
                    <input
                      id="proj-url"
                      name="project_url"
                      type="url"
                      value={form.project_url}
                      onChange={handleFormChange}
                      placeholder="https://miproyecto.com"
                      className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className="space-y-2">
                    <label htmlFor="proj-github" className="text-sm font-medium text-text-muted">URL de GitHub</label>
                    <input
                      id="proj-github"
                      name="github_url"
                      type="url"
                      value={form.github_url}
                      onChange={handleFormChange}
                      placeholder="https://github.com/user/repo"
                      className="w-full bg-bg-dark border border-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer group" htmlFor="proj-featured">
                  <div className="relative">
                    <input
                      id="proj-featured"
                      name="featured"
                      type="checkbox"
                      checked={form.featured}
                      onChange={handleFormChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-dark border border-border-dark rounded-full peer-checked:bg-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-text-muted rounded-full transition-all peer-checked:translate-x-5 peer-checked:bg-bg-dark" />
                  </div>
                  <span className="text-sm font-medium text-text-muted group-hover:text-text-main transition-colors">
                    Proyecto destacado (aparece en la página principal)
                  </span>
                </label>

                {/* Actions */}
                <div className="flex gap-4 pt-2 border-t border-border-dark">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="flex-1 py-3 rounded-xl border border-border-dark text-text-muted hover:border-primary/50 hover:text-text-main transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-3 rounded-xl bg-primary text-bg-dark font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? (
                      <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={16} />
                        {editingId ? 'Guardar Cambios' : 'Crear Proyecto'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- DELETE CONFIRMATION MODAL ---- */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm bg-bg-surface border border-border-dark rounded-2xl p-8 text-center"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">¿Eliminar proyecto?</h3>
              <p className="text-text-muted text-sm mb-8">
                Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl border border-border-dark text-text-muted hover:border-primary/50 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
