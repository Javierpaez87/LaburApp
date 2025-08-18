import React, { useState } from 'react';
import { PublishForm } from '@/components/PublishForm';
import { ServiceFormData, Service } from '@/types/service';
import { createService } from '@/services/api';
import { updateService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface PublishPageProps {
  onBack: () => void;
  onServiceCreated: () => void;
  editingService?: Service;
}

export const PublishPage: React.FC<PublishPageProps> = ({ 
  onBack, 
  onServiceCreated,
  editingService 
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ServiceFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (editingService) {
        await updateService(editingService.id, data, user.id);
      } else {
        await createService(data, user.id);
      }
      onServiceCreated();
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getInitialData = (): ServiceFormData | undefined => {
    if (!editingService) return undefined;
    
    return {
      name: editingService.name,
      company: editingService.company,
      city: editingService.city,
      neighborhood: editingService.neighborhood,
      phone: editingService.phone,
      email: editingService.email,
      categories: editingService.categories,
      description: editingService.description,
      whatsappMessage: editingService.whatsappMessage
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Necesitás iniciar sesión</h2>
          <p className="text-gray-600">
            Para publicar o editar un servicio, primero tenés que iniciar sesión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/LaburArApp logo.png" 
                alt="LaburAr" 
                className="h-8 w-auto mr-2"
              />
              <h1 className="text-2xl font-bold text-cyan-500">LaburAr</h1>
            </div>
          </div>
        </div>
      </header>

      <PublishForm
        onSubmit={handleSubmit}
        initialData={getInitialData()}
        isEditing={!!editingService}
        onBack={onBack}
        isLoading={isLoading}
      />
    </div>
  );
};
