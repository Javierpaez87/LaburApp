import React, { useState, useEffect } from 'react';
import { ServiceDetail } from '@/components/ServiceDetail';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/service';
import { getServiceById } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface ServiceDetailPageProps {
  serviceId: string;
  onBack: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceId, onBack }) => {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadService = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getServiceById(serviceId);
        if (data) {
          setService(data);
        } else {
          setError('Servicio no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el servicio');
        console.error('Error loading service:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadService();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Servicio no encontrado'}
          </h2>
          <Button onClick={onBack} variant="outline">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ServiceDetail service={service} onBack={onBack} />
    </div>
  );
};