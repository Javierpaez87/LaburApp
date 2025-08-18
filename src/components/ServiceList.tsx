import React from 'react';
import { ServiceCard } from './ServiceCard';
import { Service } from '@/types/service';
import { Loader2 } from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  onViewMore: (serviceId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ServiceList: React.FC<ServiceListProps> = ({ 
  services, 
  onViewMore, 
  isLoading = false,
  className = '' 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No se encontraron servicios
          </h3>
          <p className="text-gray-600">
            Intenta buscar con otros términos o revisa los filtros aplicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewMore={onViewMore}
          />
        ))}
      </div>
    </div>
  );
};