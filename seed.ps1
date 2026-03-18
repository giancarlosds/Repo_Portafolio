
$url = "https://eircwwskmtrtjmmiwzvw.supabase.co/rest/v1/projects"
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcmN3d3NrbXRydGptbWl3enZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MzEwNzcsImV4cCI6MjA4OTEwNzA3N30.g6H47dtpTip50ZdU07lMBEc6JXIzlLEvsdaaeuG4ZDk"

$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "return=minimal"
}

# First check if projects already exist
$existing = Invoke-RestMethod -Uri "$url`?select=id&limit=1" -Headers $headers -Method GET
if ($existing.Count -gt 0) {
    Write-Host "Ya existen $($existing.Count) proyectos. No se anaden duplicados."
    exit 0
}

$projects = @(
    @{
        title = "E-commerce Platform"
        description = "Plataforma de comercio electronico completa con panel de administracion, carrito de compras y pasarela de pago integrada con Stripe. Incluye gestion de inventario en tiempo real."
        image_url = "https://picsum.photos/seed/ecommerce/800/500"
        project_url = "https://ecommerce-demo.vercel.app"
        github_url = "https://github.com/giancarlos/ecommerce-platform"
        technologies = @("React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS")
        featured = $true
    },
    @{
        title = "Task Management App"
        description = "Aplicacion de gestion de tareas con caracteristicas colaborativas en tiempo real. Incluye tableros Kanban, asignacion de tareas por equipo y seguimiento de progreso."
        image_url = "https://picsum.photos/seed/taskapp/800/500"
        project_url = "https://taskapp-demo.vercel.app"
        github_url = "https://github.com/giancarlos/task-management"
        technologies = @("Vue.js", "Firebase", "Tailwind CSS", "WebSockets")
        featured = $true
    },
    @{
        title = "Financial Dashboard"
        description = "Dashboard analitico para visualizacion de datos financieros complejos con graficos interactivos, filtros dinamicos y exportacion de reportes en PDF y Excel."
        image_url = "https://picsum.photos/seed/finance/800/500"
        project_url = "https://finance-dashboard.vercel.app"
        github_url = "https://github.com/giancarlos/financial-dashboard"
        technologies = @("React", "D3.js", "TypeScript", "PostgreSQL")
        featured = $true
    },
    @{
        title = "AI Content Generator"
        description = "Herramienta de creacion de contenido impulsada por IA que genera textos e imagenes. Integra la API de OpenAI para generar contenido personalizado segun el tono deseado."
        image_url = "https://picsum.photos/seed/aicontent/800/500"
        project_url = "https://ai-content.vercel.app"
        github_url = "https://github.com/giancarlos/ai-generator"
        technologies = @("Next.js", "OpenAI API", "TypeScript", "Supabase")
        featured = $false
    },
    @{
        title = "Real Estate Platform"
        description = "Plataforma inmobiliaria con busqueda avanzada por ubicacion, filtros de precio, integracion con Google Maps, visualizaciones 3D de propiedades y sistema de reservas online."
        image_url = "https://picsum.photos/seed/realestate/800/500"
        project_url = "https://realestate.vercel.app"
        github_url = "https://github.com/giancarlos/real-estate"
        technologies = @("React", "GraphQL", "Node.js", "Google Maps API", "MongoDB")
        featured = $false
    },
    @{
        title = "Learning Management System"
        description = "Plataforma educativa online con creacion de cursos, videos, quizzes interactivos, sistema de certificaciones y panel de seguimiento del progreso de los estudiantes."
        image_url = "https://picsum.photos/seed/lmsapp/800/500"
        project_url = "https://lms-demo.vercel.app"
        github_url = "https://github.com/giancarlos/lms-platform"
        technologies = @("React", "Django", "PostgreSQL", "AWS S3", "Stripe")
        featured = $false
    }
)

Write-Host "Intentando sembrar $($projects.Count) proyectos..."
Write-Host "NOTA: El anon key no puede insertar sin autenticacion (RLS bloqueado)."
Write-Host "Por favor, crea un primer usuario en /login (registro), luego los proyectos se pueden crear desde el panel Admin."
