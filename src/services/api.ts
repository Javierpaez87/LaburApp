import { Service, ServiceFormData } from '@/types/service';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  orderBy,
  Timestamp
} from 'firebase/firestore';

// Firebase config (usando la misma configuración que en firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyDbphNhyINIcj0TwpT96tqeLcXnMXYRcm0",
  authDomain: "laburar-app-b1a11.firebaseapp.com",
  projectId: "laburar-app-b1a11",
  storageBucket: "laburar-app-b1a11.firebasestorage.app",
  messagingSenderId: "511558096886",
  appId: "1:511558096886:web:10b8b6d9ce01eeb21e59d7",
  measurementId: "G-E1VVV69GRE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función helper para convertir Timestamp de Firestore a Date
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Función helper para convertir datos de Firestore a Service
const convertFirestoreToService = (doc: any): Service => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name,
    company: data.company,
    city: data.city,
    neighborhood: data.neighborhood,
    phone: data.phone,
    email: data.email || '',
    categories: data.categories,
    description: data.description,
    status: data.status,
    createdAt: convertTimestampToDate(data.createdAt),
    whatsappMessage: data.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
  };
};

export const listServices = async (filters?: {
  search?: string;
  category?: string;
  city?: string;
  neighborhood?: string;
}): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    // Simplify query to avoid index requirements - we'll filter and sort on client side
    let q = query(servicesRef, where('status', '==', 'active'));
    
    const snapshot = await getDocs(q);
    let services = snapshot.docs.map(convertFirestoreToService);
    
    // Sort by createdAt on client side to avoid index requirement
    services.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Aplicar filtros en el cliente (ya que Firestore tiene limitaciones con múltiples where)
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      services = services.filter(service => 
        service.name.toLowerCase().includes(searchLower) ||
        service.company?.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.category) {
      services = services.filter(service =>
        service.categories.includes(filters.category!)
      );
    }
    
    if (filters?.city) {
      services = services.filter(service =>
        service.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    if (filters?.neighborhood) {
      services = services.filter(service =>
        service.neighborhood && service.neighborhood.toLowerCase().includes(filters.neighborhood!.toLowerCase())
      );
    }
    
    return services;
  } catch (error) {
    console.error('Error listing services:', error);
    throw new Error('Error al cargar los servicios');
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const docRef = doc(db, 'services', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().status === 'active') {
      return convertFirestoreToService(docSnap);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting service:', error);
    throw new Error('Error al cargar el servicio');
  }
};

export const createService = async (serviceData: ServiceFormData, userId: string): Promise<Service> => {
  try {
    const { customCategory, ...serviceDataWithoutCustomCategory } = serviceData;
    
    const newServiceData = {
      userId,
      ...serviceDataWithoutCustomCategory,
      email: serviceDataWithoutCustomCategory.email || '',
      status: 'active',
      createdAt: Timestamp.now(),
      whatsappMessage: serviceDataWithoutCustomCategory.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
    };
    
    const docRef = await addDoc(collection(db, 'services'), newServiceData);
    
    // Retornar el servicio creado
    return {
      id: docRef.id,
      ...newServiceData,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Error al crear el servicio');
  }
};

export const getUserServices = async (userId: string): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    const q = query(
      servicesRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertFirestoreToService);
  } catch (error) {
    console.error('Error getting user services:', error);
    throw new Error('Error al cargar tus servicios');
  }
};

export const updateService = async (serviceId: string, serviceData: Partial<ServiceFormData>, userId: string): Promise<Service> => {
  try {
    const docRef = doc(db, 'services', serviceId);
    
    // Verificar que el servicio pertenece al usuario
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Servicio no encontrado o no autorizado');
    }
    
    // Actualizar el documento
    await updateDoc(docRef, {
      ...serviceData,
      updatedAt: Timestamp.now()
    });
    
    // Obtener y retornar el servicio actualizado
    const updatedDoc = await getDoc(docRef);
    return convertFirestoreToService(updatedDoc);
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Error al actualizar el servicio');
  }
};

export const deleteService = async (serviceId: string, userId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'services', serviceId);
    
    // Verificar que el servicio pertenece al usuario
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data().userId !== userId) {
      throw new Error('Servicio no encontrado o no autorizado');
    }
    
    // Marcar como inactivo en lugar de eliminar completamente
    await updateDoc(docRef, {
      status: 'inactive',
      deletedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Error al eliminar el servicio');
  }
};

// Función para inicializar datos de prueba (opcional, solo para desarrollo)
export const initializeMockData = async (): Promise<void> => {
  // Skip initialization in production or if user is not authenticated
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  try {
    // Verificar si ya hay datos
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('Inicializando datos de prueba...');
      
      const mockServices = [
        {
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
          createdAt: Timestamp.now(),
          whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
        },
        {
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
          createdAt: Timestamp.now(),
          whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
        }
      ];
      
      for (const service of mockServices) {
        await addDoc(servicesRef, service);
      }
      
      console.log('Datos de prueba inicializados');
    }
  } catch (error) {
    console.warn('Could not initialize mock data (this is normal if not authenticated):', error);
    // Don't throw error, just log warning
  }
};