import { Service, ServiceFormData } from '@/types/service';

// TODO: Replace with Firestore integration
// const firebaseConfig = {
//   // Firebase config will go here
// };

// In-memory store for development
let services: Service[] = [];
let nextId = 1;

// Mock data
const mockServices: Service[] = [
  {
    id: '1',
    userId: 'mock-user-1',
    name: 'Juan Carlos Pérez',
    company: 'Plomería JCP',
    city: 'Buenos Aires',
    neighborhood: 'Palermo',
    phone: '541134567890',
    email: 'juan@plomeriajcp.com',
    categories: ['Plomería', 'Gasista'],
    description: 'Más de 15 años de experiencia en instalaciones y reparaciones de plomería. Trabajo las 24hs para emergencias. Presupuesto sin cargo.',
    status: 'active',
    createdAt: new Date('2024-12-01'),
    whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  },
  {
    id: '2',
    userId: 'mock-user-2',
    name: 'María González',
    company: 'Carpintería Artesanal MG',
    city: 'Buenos Aires',
    neighborhood: 'Villa Crespo',
    phone: '541145678901',
    email: 'maria@carpinteriamg.com',
    categories: ['Carpintería'],
    description: 'Especialista en muebles a medida y restauración. Trabajo con maderas nobles y diseños personalizados.',
    status: 'active',
    createdAt: new Date('2024-12-10'),
    whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  },
  {
    id: '3',
    userId: 'mock-user-3',
    name: 'Roberto Silva',
    company: undefined,
    city: 'Buenos Aires',
    neighborhood: 'San Telmo',
    phone: '541156789012',
    email: 'roberto.electricista@gmail.com',
    categories: ['Electricidad'],
    description: 'Electricista matriculado con 20 años de experiencia. Instalaciones domiciliarias e industriales.',
    status: 'active',
    createdAt: new Date('2024-11-25'),
    whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  },
  {
    id: '4',
    userId: 'mock-user-4',
    name: 'Ana Torres',
    company: 'Pintura Profesional AT',
    city: 'Buenos Aires',
    neighborhood: 'Belgrano',
    phone: '541167890123',
    email: 'ana@pinturasat.com',
    categories: ['Pintura'],
    description: 'Pintora profesional especializada en interiores y exteriores. Trabajos con garantía y materiales de primera calidad.',
    status: 'active',
    createdAt: new Date('2024-12-15'),
    whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  },
  {
    id: '5',
    userId: 'mock-user-5',
    name: 'Carlos Mendoza',
    company: 'Construcciones Mendoza',
    city: 'Buenos Aires',
    neighborhood: 'Caballito',
    phone: '541178901234',
    email: 'carlos@construccionesmendoza.com',
    categories: ['Construcción', 'Albañilería'],
    description: 'Empresa familiar con 30 años en el mercado. Especialistas en ampliaciones, remodelaciones y obra nueva.',
    status: 'active',
    createdAt: new Date('2024-12-05'),
    whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  }
];

// Initialize mock data
services = [...mockServices];
nextId = mockServices.length + 1;

export const listServices = async (filters?: {
  search?: string;
  category?: string;
  city?: string;
  neighborhood?: string;
}): Promise<Service[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredServices = services.filter(service => service.status === 'active');
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredServices = filteredServices.filter(service => 
      service.name.toLowerCase().includes(searchLower) ||
      service.company?.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.category) {
    filteredServices = filteredServices.filter(service =>
      service.categories.includes(filters.category!)
    );
  }
  
  if (filters?.city) {
    filteredServices = filteredServices.filter(service =>
      service.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }
  
  if (filters?.neighborhood) {
    filteredServices = filteredServices.filter(service =>
      service.neighborhood && (service.neighborhood ?? '').toLowerCase().includes(filters.neighborhood!.toLowerCase())
    );
  }
  
  return filteredServices;
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return services.find(service => service.id === id && service.status === 'active') || null;
};

export const createService = async (serviceData: ServiceFormData, userId: string): Promise<Service> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { customCategory, ...serviceDataWithoutCustomCategory } = serviceData;
  
  const newService: Service = {
    id: nextId.toString(),
    userId,
    ...serviceDataWithoutCustomCategory,
    email: serviceDataWithoutCustomCategory.email ?? '',
    status: 'active',
    createdAt: new Date(),
    whatsappMessage: serviceDataWithoutCustomCategory.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  };
  
  services.push(newService);
  nextId++;
  
  return newService;
};

export const getUserServices = async (userId: string): Promise<Service[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return services.filter(service => service.userId === userId);
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceFormData>, userId: string): Promise<Service> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const serviceIndex = services.findIndex(service => service.id === serviceId && service.userId === userId);
  if (serviceIndex === -1) {
    throw new Error('Service not found or unauthorized');
  }
  
  services[serviceIndex] = {
    ...services[serviceIndex],
    ...serviceData
  };
  
  return services[serviceIndex];
};

export const deleteService = async (serviceId: string, userId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const serviceIndex = services.findIndex(service => service.id === serviceId && service.userId === userId);
  if (serviceIndex === -1) {
    throw new Error('Service not found or unauthorized');
  }
  
  services[serviceIndex].status = 'inactive';
};
// TODO: Future Firestore integration
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
// 
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// 
// export const listServices = async (filters) => {
//   const servicesRef = collection(db, 'services');
//   let q = query(servicesRef, where('status', '==', 'active'));
//   
//   if (filters?.category) {
//     q = query(q, where('categories', 'array-contains', filters.category));
//   }
//   
//   const snapshot = await getDocs(q);
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };