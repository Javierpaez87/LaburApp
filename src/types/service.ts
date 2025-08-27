export interface Service {
  id: string;
  userId: string;
  name: string;
  company?: string;
  city: string;
  neighborhood?: string;
  phone: string;
  email?: string;
  categories: string[];
  description: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  whatsappMessage?: string;
}

export interface ServiceFormData {
  name: string;
  company?: string;
  city: string;
  neighborhood?: string;
  phone: string;
  email?: string;
  categories: string[];
  description: string;
  whatsappMessage?: string;
  customCategory?: string;
}

export const SERVICE_CATEGORIES = [
  'Carpintería',
  'Plomería', 
  'Albañilería',
  'Construcción',
  'Zinguería',
  'Pintura',
  'Electricidad',
  'Gasista',
  'Jardinería',
  'Herrería',
  'Cuidado de personas',
  'Costurería',
  'Mecánico',
  'Gastronomía',
  'Peluquería',
  'Arquitectura',
  'Artes',
  'Decoración',
  'Ingeniería',
  'Rental',
  'Veterinaria',
  'Salud',
  'Informática',
  'Otros'
] as const;