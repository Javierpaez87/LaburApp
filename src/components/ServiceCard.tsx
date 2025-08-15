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
    const message = encodeURIComponent(service.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por');
    const phoneNumber = service.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${service.phone}`, '_self');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden bg-gray-100 mx-auto sm:mx-0">
            <div className="w-full h-full bg-cyan-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm md:text-lg">
                {service.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 md:mb-2">
            <div>
              <h3 className="font-semibold text-sm md:text-lg text-gray-900 truncate">
                {service.name}
              </h3>
              {service.company && (
                <p className="text-xs md:text-sm text-gray-600 truncate">{service.company}</p>
              )}
            </div>
            {isNew() && (
              <Badge variant="default" className="bg-green-100 text-green-800 ml-2 text-xs">
                Nuevo
              </Badge>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span>{service.neighborhood ? `${service.neighborhood}, ` : ''}{service.city}</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2 md:mb-4">
            {service.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs px-1 py-0">
                {category}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2">
            {service.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-1 md:gap-2">
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 md:h-9"
              size="sm"
            >
              <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">WhatsApp</span>
            </Button>
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-10 md:h-9"
              size="sm"
            >
              <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              <span className="text-xs md:text-sm">Llamar</span>
            </Button>
            <Button
              onClick={() => onViewMore(service.id)}
              variant="outline"
              className="flex-1 border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-10 md:h-9"
              size="sm"
            >
              <span className="text-xs md:text-sm">+ Ver más</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};