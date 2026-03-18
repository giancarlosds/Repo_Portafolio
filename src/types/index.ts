export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  github_url: string;
  technologies: string;
  featured: boolean;
}
