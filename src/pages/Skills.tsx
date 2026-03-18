import { motion } from 'motion/react';
import { Code2, Database, Layout, Terminal, Server, Smartphone, Globe, Cpu } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: "Lenguajes & Core",
      icon: <Code2 className="text-primary" size={24} />,
      skills: [
        { name: "JavaScript (ES6+)", level: 95 },
        { name: "TypeScript", level: 90 },
        { name: "HTML5 / CSS3", level: 95 },
        { name: "Python", level: 75 },
        { name: "SQL", level: 85 }
      ]
    },
    {
      title: "Frameworks & Librerías",
      icon: <Layout className="text-primary" size={24} />,
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 85 },
        { name: "Vue.js", level: 80 },
        { name: "Node.js / Express", level: 85 },
        { name: "Tailwind CSS", level: 90 }
      ]
    },
    {
      title: "Herramientas & DevOps",
      icon: <Terminal className="text-primary" size={24} />,
      skills: [
        { name: "Git / GitHub", level: 90 },
        { name: "Docker", level: 75 },
        { name: "AWS / Vercel", level: 80 },
        { name: "CI/CD", level: 70 },
        { name: "Webpack / Vite", level: 85 }
      ]
    },
    {
      title: "Bases de Datos",
      icon: <Database className="text-primary" size={24} />,
      skills: [
        { name: "PostgreSQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Redis", level: 65 },
        { name: "Firebase", level: 85 },
        { name: "Supabase", level: 75 }
      ]
    }
  ];

  const areas = [
    {
      title: "Desarrollo Frontend",
      desc: "Creación de interfaces de usuario responsivas, accesibles y de alto rendimiento utilizando las últimas tecnologías web.",
      icon: <Globe size={32} />
    },
    {
      title: "Desarrollo Backend",
      desc: "Diseño e implementación de APIs RESTful y GraphQL robustas, seguras y escalables.",
      icon: <Server size={32} />
    },
    {
      title: "Arquitectura de Software",
      desc: "Diseño de sistemas escalables, patrones de diseño y toma de decisiones técnicas a nivel de proyecto.",
      icon: <Cpu size={32} />
    },
    {
      title: "Desarrollo Móvil",
      desc: "Creación de aplicaciones móviles multiplataforma utilizando React Native.",
      icon: <Smartphone size={32} />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Habilidades Técnicas</h1>
        <p className="text-text-muted text-lg">
          Un resumen detallado de mis competencias técnicas, herramientas que utilizo en mi día a día y áreas de especialización.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-bg-card border border-border-dark p-8 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-bg-surface rounded-xl border border-border-dark">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            
            <div className="space-y-6">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-text-muted">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-bg-surface rounded-full overflow-hidden border border-border-dark">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Áreas de Especialidad</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, idx) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-bg-card border border-border-dark p-6 rounded-xl hover:border-primary/50 transition-colors"
            >
              <div className="text-primary mb-4">{area.icon}</div>
              <h3 className="text-xl font-bold mb-3">{area.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{area.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
