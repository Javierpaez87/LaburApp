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
    userId: data.authorUid,
    name: data.name,
    company: data.company,
    city: data.city,
    neighborhood: data.neighborhood,
    phone: data.phone,
    email: data.email || '',
    categories: data.categories,
    description: data.description,
    status: data.isActive ? 'active' : 'inactive',
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
    let q = query(servicesRef, where('isActive', '==', true));
    
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
    
    if (docSnap.exists() && docSnap.data().isActive === true) {
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
    console.log('=== DEBUG: Starting createService ===');
    console.log('Raw serviceData:', serviceData);
    console.log('userId:', userId);
    
    const { customCategory, ...serviceDataWithoutCustomCategory } = serviceData;
    
    console.log('serviceDataWithoutCustomCategory:', serviceDataWithoutCustomCategory);
    
    // Prepare data for Firestore with required fields first
    const newServiceData = {
      // Required fields for security rules
      title: serviceDataWithoutCustomCategory.name,
      description: serviceDataWithoutCustomCategory.description,
      category: serviceDataWithoutCustomCategory.categories[0] || 'Otros',
      isActive: true,
      authorUid: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      
      // Additional service data
      name: serviceDataWithoutCustomCategory.name,
      city: serviceDataWithoutCustomCategory.city,
      phone: serviceDataWithoutCustomCategory.phone,
      categories: serviceDataWithoutCustomCategory.categories,
      company: serviceDataWithoutCustomCategory.company || '',
      neighborhood: serviceDataWithoutCustomCategory.neighborhood || '',
      email: serviceDataWithoutCustomCategory.email || '',
      whatsappMessage: serviceDataWithoutCustomCategory.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
    };
    
    console.log('=== Final data to send to Firestore ===');
    console.log('newServiceData:', JSON.stringify(newServiceData, null, 2));
    console.log('Data keys:', Object.keys(newServiceData));
    console.log('authorUid matches userId?', newServiceData.authorUid === userId);
    
    console.log('=== Attempting to create document ===');
    const docRef = await addDoc(collection(db, 'services'), newServiceData);
    console.log('=== Document created successfully ===');
    console.log('Document ID:', docRef.id);
    
    // Return the complete service
    return {
      id: docRef.id,
      userId: userId,
      name: serviceDataWithoutCustomCategory.name,
      company: serviceDataWithoutCustomCategory.company,
      city: serviceDataWithoutCustomCategory.city,
      neighborhood: serviceDataWithoutCustomCategory.neighborhood,
      phone: serviceDataWithoutCustomCategory.phone,
      email: serviceDataWithoutCustomCategory.email || '',
      categories: serviceDataWithoutCustomCategory.categories,
      description: serviceDataWithoutCustomCategory.description,
      status: 'active' as const,
      createdAt: new Date(),
      whatsappMessage: serviceDataWithoutCustomCategory.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
    };
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Error al crear el servicio');
  }
};

export const getUserServices = async (userId: string): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    // Simplify query to avoid index requirements - we'll sort on client side
    const q = query(servicesRef, where('authorUid', '==', userId));
    
    const snapshot = await getDocs(q);
    let services = snapshot.docs.map(convertFirestoreToService);
    
    // Sort by createdAt on client side to avoid index requirement
    services.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return services;
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
    if (!docSnap.exists() || docSnap.data().authorUid !== userId) {
      throw new Error('Servicio no encontrado o no autorizado');
    }
    
    // Prepare update data to match Firestore rules
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    if (serviceData.name) {
      updateData.title = serviceData.name;
      updateData.name = serviceData.name;
    }
    if (serviceData.description) {
      updateData.description = serviceData.description;
    }
    if (serviceData.categories && serviceData.categories.length > 0) {
      updateData.category = serviceData.categories[0];
      updateData.categories = serviceData.categories;
    }
    if (serviceData.company !== undefined) {
      updateData.company = serviceData.company;
    }
    if (serviceData.city) {
      updateData.city = serviceData.city;
    }
    if (serviceData.neighborhood !== undefined) {
      updateData.neighborhood = serviceData.neighborhood;
    }
    if (serviceData.phone) {
      updateData.phone = serviceData.phone;
    }
    if (serviceData.email !== undefined) {
      updateData.email = serviceData.email;
    }
    if (serviceData.whatsappMessage !== undefined) {
      updateData.whatsappMessage = serviceData.whatsappMessage;
    }
    
    // Actualizar el documento
    await updateDoc(docRef, updateData);
    
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
    if (!docSnap.exists() || docSnap.data().authorUid !== userId) {
      throw new Error('Servicio no encontrado o no autorizado');
    }
    
    // Marcar como inactivo en lugar de eliminar completamente
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now()
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
          // Required fields for Firestore rules
          title: 'Juan Carlos Pérez',
          description: 'Más de 15 años de experiencia en instalaciones y reparaciones de plomería. Trabajo las 24hs para emergencias. Presupuesto sin cargo.',
          category: 'Plomería',
          isActive: true,
          authorUid: 'mock-user-1',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          
          // Additional fields for our app
          name: 'Juan Carlos Pérez',
          company: 'Plomería JCP',
          city: 'Buenos Aires',
          neighborhood: 'Palermo',
          phone: '541134567890',
          email: 'juan@plomeriajcp.com',
          categories: ['Plomería', 'Gasista'],
          whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por'
        },
        {
          // Required fields for Firestore rules
          title: 'María González',
          description: 'Especialista en muebles a medida y restauración. Trabajo con maderas nobles y diseños personalizados.',
          category: 'Carpintería',
          isActive: true,
          authorUid: 'mock-user-2',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          
          // Additional fields for our app
          name: 'María González',
          company: 'Carpintería Artesanal MG',
          city: 'Buenos Aires',
          neighborhood: 'Villa Crespo',
          phone: '541145678901',
          email: 'maria@carpinteriamg.com',
          categories: ['Carpintería'],
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