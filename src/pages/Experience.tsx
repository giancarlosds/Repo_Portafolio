import { motion } from 'motion/react';
import { Briefcase, Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

export default function Experience() {
  const experiences = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechNova Solutions",
      period: "Ene 2021 - Presente",
      desc: "Liderando el equipo de frontend en el desarrollo de la plataforma principal de la empresa. Implementación de nueva arquitectura basada en micro-frontends.",
      tags: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest"],
      details: [
        "Reducción del tiempo de carga inicial en un 40% mediante code splitting y optimización de assets.",
        "Mentoría a 4 desarrolladores junior, estableciendo mejores prácticas y code reviews.",
        "Migración exitosa de una aplicación monolítica Vue 2 a React/Next.js.",
        "Implementación de un sistema de diseño propio utilizando Storybook."
      ]
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "Digital Innovators",
      period: "Mar 2018 - Dic 2020",
      desc: "Desarrollo de aplicaciones web a medida para clientes corporativos. Participación en todo el ciclo de vida del software.",
      tags: ["Vue.js", "Node.js", "Express", "MongoDB", "Docker"],
      details: [
        "Desarrollo de un CRM personalizado que aumentó la eficiencia del equipo de ventas en un 25%.",
        "Implementación de integraciones con APIs de terceros (Stripe, Twilio, SendGrid).",
        "Configuración de pipelines CI/CD utilizando GitHub Actions.",
        "Optimización de consultas a la base de datos, reduciendo la latencia en endpoints críticos."
      ]
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Creative Web Agency",
      period: "Jun 2015 - Feb 2018",
      desc: "Creación de sitios web interactivos y landing pages de alta conversión para campañas de marketing.",
      tags: ["JavaScript", "HTML/CSS", "Sass", "React", "WordPress"],
      details: [
        "Desarrollo de más de 30 sitios web responsivos y accesibles.",
        "Creación de animaciones complejas utilizando GSAP.",
        "Optimización SEO técnico que resultó en un aumento promedio del 30% en tráfico orgánico.",
        "Desarrollo de temas y plugins personalizados para WordPress."
      ]
    }
  ];

  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Experiencia Laboral</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Mi trayectoria profesional y los roles que han moldeado mi experiencia como desarrollador.
        </p>
      </motion.div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-dark before:to-transparent">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-bg-dark bg-primary text-bg-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Briefcase size={16} />
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-bg-card border border-border-dark p-6 rounded-2xl hover:border-primary/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <h3 className="font-bold text-xl text-primary">{exp.role}</h3>
                <div className="flex items-center gap-1 text-text-muted text-sm bg-bg-surface px-3 py-1 rounded-full border border-border-dark w-fit">
                  <Calendar size={14} />
                  <span>{exp.period}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-medium mb-3">{exp.company}</h4>
              <p className="text-text-muted mb-4">{exp.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {exp.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-bg-surface text-text-main border border-border-dark">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="border-t border-border-dark pt-4">
                <button 
                  onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  className="flex items-center justify-between w-full text-sm font-medium text-text-muted hover:text-primary transition-colors"
                >
                  <span>Ver detalles técnicos</span>
                  <ChevronDown 
                    size={16} 
                    className={clsx("transition-transform duration-300", expandedId === exp.id && "rotate-180")} 
                  />
                </button>
                
                <motion.div 
                  initial={false}
                  animate={{ height: expandedId === exp.id ? 'auto' : 0, opacity: expandedId === exp.id ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <ul className="mt-4 space-y-2 text-sm text-text-muted list-disc pl-5 marker:text-primary">
                    {exp.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
