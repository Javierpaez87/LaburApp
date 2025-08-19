import React from 'react';
import { MessageCircle, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onViewMore: (serviceId: string) => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onViewMore, 
  className = '' 
}) => {
  const isNew = () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return service.createdAt > twoWeeksAgo;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(service.whatsappMessage || 'Hola! Encontré tu perfil en LaburAr App y te escribo porque...');
    const phoneNumber = service.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${service.phone}`, '_self');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 ${className}`}>
      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-cyan-600 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {service.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          {service.company ? (
            <h3 className="font-semibold text-base text-gray-900">
              {service.company}
            </h3>
          ) : (
            <h3 className="font-semibold text-base text-gray-900">
              {service.name}
            </h3>
          )}
          {isNew() && (
            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
              Nuevo
            </Badge>
          )}
        </div>
        {service.company && (
          <p className="text-sm text-gray-600">{service.name}</p>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{service.neighborhood ? `${service.neighborhood}, ` : ''}{service.city}</span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-1 mb-3">
        {service.categories.map((category) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 font-semibold text-sm"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Contactar por WhatsApp
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 text-sm"
          >
            <Phone className="h-4 w-4 mr-2" />
            Llamar
          </Button>
          <Button
            onClick={() => onViewMore(service.id)}
            variant="outline"
            className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-10 text-sm"
          >
            Ver más
          </Button>
        </div>
      </div>
    </div>
  );
};