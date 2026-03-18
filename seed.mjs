/**
 * Script para sembrar los datos iniciales de proyectos en Supabase.
 * Ejecutar UNA SOLA VEZ con: node seed.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eircwwskmtrtjmmiwzvw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcmN3d3NrbXRydGptbWl3enZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzEwNzcsImV4cCI6MjA4OTEwNzA3N30.g6H47dtpTip50ZdU07lMBEc6JXIzlLEvsdaaeuG4ZDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'Plataforma de comercio electrónico completa con panel de administración, carrito de compras y pasarela de pago integrada con Stripe. Incluye gestión de inventario en tiempo real y notificaciones push.',
    image_url: 'https://picsum.photos/seed/ecommerce/800/500',
    project_url: 'https://ecommerce-demo.vercel.app',
    github_url: 'https://github.com/giancarlos/ecommerce-platform',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    featured: true,
  },
  {
    title: 'Task Management App',
    description: 'Aplicación de gestión de tareas con características colaborativas en tiempo real. Incluye tableros Kanban, asignación de tareas por equipo, comentarios y seguimiento de progreso.',
    image_url: 'https://picsum.photos/seed/taskapp/800/500',
    project_url: 'https://taskapp-demo.vercel.app',
    github_url: 'https://github.com/giancarlos/task-management',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS', 'WebSockets'],
    featured: true,
  },
  {
    title: 'Financial Dashboard',
    description: 'Dashboard analítico para visualización de datos financieros complejos con gráficos interactivos, filtros dinámicos y exportación de reportes en PDF y Excel.',
    image_url: 'https://picsum.photos/seed/finance/800/500',
    project_url: 'https://finance-dashboard.vercel.app',
    github_url: 'https://github.com/giancarlos/financial-dashboard',
    technologies: ['React', 'D3.js', 'TypeScript', 'PostgreSQL'],
    featured: true,
  },
  {
    title: 'AI Content Generator',
    description: 'Herramienta de creación de contenido impulsada por IA que genera textos e imágenes. Integra la API de OpenAI para generar contenido personalizado según el tono y formato deseado.',
    image_url: 'https://picsum.photos/seed/aicontent/800/500',
    project_url: 'https://ai-content.vercel.app',
    github_url: 'https://github.com/giancarlos/ai-generator',
    technologies: ['Next.js', 'OpenAI API', 'TypeScript', 'Supabase'],
    featured: false,
  },
  {
    title: 'Real Estate Platform',
    description: 'Plataforma inmobiliaria con búsqueda avanzada por ubicación, filtros de precio, integración con Google Maps, visualizaciones 3D de propiedades y sistema de reservas online.',
    image_url: 'https://picsum.photos/seed/realestate/800/500',
    project_url: 'https://realestate.vercel.app',
    github_url: 'https://github.com/giancarlos/real-estate',
    technologies: ['React', 'GraphQL', 'Node.js', 'Google Maps API', 'MongoDB'],
    featured: false,
  },
  {
    title: 'Learning Management System',
    description: 'Plataforma educativa online con creación de cursos, videos, quizzes interactivos, sistema de certificaciones y panel de seguimiento del progreso de los estudiantes.',
    image_url: 'https://picsum.photos/seed/lmsapp/800/500',
    project_url: 'https://lms-demo.vercel.app',
    github_url: 'https://github.com/giancarlos/lms-platform',
    technologies: ['React', 'Django', 'PostgreSQL', 'AWS S3', 'Stripe'],
    featured: false,
  },
];

async function seed() {
  // Check if projects already exist
  const { data: existing } = await supabase.from('projects').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('✅ Ya existen proyectos en la base de datos. No se añaden duplicados.');
    return;
  }

  const { error } = await supabase.from('projects').insert(projects);
  if (error) {
    console.error('❌ Error al sembrar los proyectos:', error.message);
  } else {
    console.log(`✅ ${projects.length} proyectos sembrados correctamente.`);
  }
}

seed();
