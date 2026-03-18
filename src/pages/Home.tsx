import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code2, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setFeaturedProjects(data as Project[]);
      setLoadingProjects(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Disponible para nuevos proyectos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Giancarlos Diaz
            <span className="block text-text-muted mt-2 text-3xl md:text-5xl">Desarrollador Web Senior</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-muted max-w-2xl leading-relaxed"
          >
            Especializado en crear experiencias digitales excepcionales.
            Transformo ideas complejas en soluciones web elegantes, escalables y centradas en el usuario.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              to="/contacto"
              className="px-6 py-3 rounded-lg bg-primary text-bg-dark font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Hablemos <ArrowRight size={18} />
            </Link>
            <Link
              to="/proyectos"
              className="px-6 py-3 rounded-lg bg-bg-card border border-border-dark text-text-main font-medium hover:border-primary/50 transition-colors"
            >
              Mis Proyectos
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 relative w-full"
        >
          <div className="aspect-square max-w-md mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border-dark bg-bg-card p-2">
              <img
                src="https://picsum.photos/seed/giancarlos/800/800"
                alt="Foto de perfil de Giancarlos Diaz"
                className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-bg-card border border-border-dark p-4 rounded-xl shadow-xl flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Code2 size={24} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Experiencia</p>
                <p className="font-bold">+8 Años</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="sobre-mi" className="py-20 border-t border-border-dark">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Sobre Mí</h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Soy un desarrollador full-stack apasionado por construir software excelente. Con base en Madrid, llevo más de 8 años transformando ideas en productos digitales reales.
              </p>
              <p>
                Me especializo en React y el ecosistema JavaScript moderno, aunque me siento igualmente cómodo trabajando en el backend con Node.js y bases de datos relacionales o NoSQL.
              </p>
              <p>
                Fuera del código, disfruto del diseño de interfaces, la fotografía urbana y seguir de cerca las novedades del sector tecnológico.
              </p>
            </div>
            <Link
              to="/experiencia"
              className="inline-flex items-center gap-2 mt-8 text-primary hover:underline font-medium"
            >
              Ver mi experiencia laboral <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Ubicación', value: 'Madrid, España' },
              { label: 'Experiencia', value: '+8 Años' },
              { label: 'Proyectos', value: '+50 Completados' },
              { label: 'Especialidad', value: 'Frontend / React' },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-card border border-border-dark p-6 rounded-xl">
                <p className="text-text-muted text-sm mb-1">{stat.label}</p>
                <p className="font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="proyectos" className="py-20 border-t border-border-dark">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Proyectos Destacados</h2>
            <p className="text-text-muted">Una selección de mi trabajo más reciente</p>
          </div>
          <Link to="/proyectos" className="text-primary hover:underline text-sm font-medium hidden sm:block">
            Ver todos →
          </Link>
        </div>

        {/* Loading */}
        {loadingProjects && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No featured projects */}
        {!loadingProjects && featuredProjects.length === 0 && (
          <div className="text-center py-16 bg-bg-card border border-border-dark rounded-2xl">
            <p className="text-text-muted">Aún no hay proyectos destacados.</p>
            <Link to="/admin" className="text-primary hover:underline text-sm mt-2 inline-block">
              Añadir proyectos desde el panel →
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!loadingProjects && featuredProjects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-bg-card border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="aspect-video overflow-hidden relative bg-bg-surface">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-bold">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2 bg-bg-surface rounded-full hover:text-primary transition-colors">
                        <Github size={20} />
                      </a>
                    )}
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" rel="noreferrer" aria-label="Ver proyecto" className="p-2 bg-bg-surface rounded-full hover:text-primary transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map(tag => (
                      <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-bg-surface text-primary border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2">{project.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/proyectos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border-dark hover:border-primary/50 text-text-muted hover:text-primary transition-colors"
          >
            Ver todos los proyectos <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
