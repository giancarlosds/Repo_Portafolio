import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setProjects(data as Project[]);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Obtener todas las tecnologías únicas
  const allTags = Array.from(
    new Set(projects.flatMap(p => p.technologies))
  ).sort();

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      filter === '' ||
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.description.toLowerCase().includes(filter.toLowerCase());
    const matchesTag = !activeTag || p.technologies.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mis Proyectos</h1>
        <p className="text-text-muted text-lg">
          Una colección de mis trabajos y proyectos personales desarrollados a lo largo de mi carrera.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10 space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full bg-bg-card border border-border-dark rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {filter && (
            <button
              onClick={() => setFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                !activeTag
                  ? 'bg-primary text-bg-dark border-primary'
                  : 'bg-bg-card border-border-dark text-text-muted hover:border-primary/50'
              }`}
            >
              Todos
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeTag === tag
                    ? 'bg-primary text-bg-dark border-primary'
                    : 'bg-bg-card border-border-dark text-text-muted hover:border-primary/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-24">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted">Cargando proyectos...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-24">
          <p className="text-text-muted text-lg mb-2">No se encontraron proyectos</p>
          <p className="text-text-muted text-sm">
            {projects.length === 0
              ? 'Aún no hay proyectos publicados.'
              : 'Prueba con otra búsqueda o filtro.'}
          </p>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group bg-bg-card border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative bg-bg-surface">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl font-bold">
                    {project.title.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Ver código en GitHub"
                      className="p-2 bg-bg-surface rounded-full hover:text-primary transition-colors"
                    >
                      <Github size={20} />
                    </a>
                  )}
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Ver proyecto en vivo"
                      className="p-2 bg-bg-surface rounded-full hover:text-primary transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                {project.featured && (
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-primary text-bg-dark rounded-full">
                    Destacado
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-1 rounded bg-bg-surface text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <p className="text-text-muted text-sm line-clamp-3">{project.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
