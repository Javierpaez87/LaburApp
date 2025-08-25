import React from 'react';
import { MessageCircle, Phone, MapPin, Hammer, Wrench, HardHat, Building, Zap, PaintBucket, Flame, Gauge, Leaf, PenTool as Tool, HeartHandshake, Scissors, Car, ChefHat, Scissors as Scissors2, Ruler, Palette, Home, Calculator, Truck, Heart, Stethoscope, Dog, MoreHorizontal } from 'lucide-react';
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
  // Mapeo de iconos por categoría (mismo que CategoryGrid)
  const categoryIcons = {
    'Carpintería': Hammer,
    'Plomería': Wrench,
    'Albañilería': HardHat,
    'Construcción': Building,
    'Zinguería': Gauge,
    'Pintura': PaintBucket,
    'Electricidad': Zap,
    'Gasista': Flame,
    'Jardinería': Leaf,
    'Herrería': Tool,
    'Cuidado de personas': HeartHandshake,
    'Costurería': Scissors,
    'Mecánico': Car,
    'Gastronomía': ChefHat,
    'Peluquería': Scissors2,
    'Arquitectura': Ruler,
    'Artes': Palette,
    'Decoración': Home,
    'Ingeniería': Calculator,
    'Rental': Truck,
    'Veterinaria': Dog,
    'Salud': Stethoscope,
    'Otros': MoreHorizontal
  };

  // Obtener el icono de la primera categoría
  const getCategoryIcon = () => {
    const firstCategory = service.categories[0];
    return categoryIcons[firstCategory as keyof typeof categoryIcons] || MoreHorizontal;
  };

  const getAvatarContent = () => {
    // Si tiene categorías, mostrar el ícono de la primera categoría
    if (service.categories && service.categories.length > 0) {
      const IconComponent = getCategoryIcon();
      return <IconComponent className="h-7 w-7 text-white" />;
    }
    
    // Si no tiene categorías, mostrar iniciales de la empresa o nombre
    const displayName = service.company || service.name;
    const initials = displayName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2); // Máximo 2 iniciales
    
    return (
      <span className="text-white font-semibold text-lg">
        {initials}
      </span>
    );
  };

  const isNew = () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return service.createdAt > twoWeeksAgo;
  };

  // Función para determinar el tamaño de fuente basado en la longitud del texto
  const getTitleFontSize = () => {
    const displayName = service.company || service.name;
    const length = displayName.length;
    
    if (length <= 20) return 'text-base'; // 1 línea aprox
    if (length <= 40) return 'text-sm';   // 2 líneas aprox
    return 'text-xs';                     // 3+ líneas
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(service.whatsappMessage || 'Hola! Encontré tu perfil en LaburAr App y te escribo porque...');
    const phoneNumber = service.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${service.phone}`, '_self');
  };

  // Función para mostrar categorías con límite
  const displayCategories = () => {
    const maxCategories = 2;
    if (service.categories.length <= maxCategories) {
      return service.categories;
    }
    return [...service.categories.slice(0, maxCategories), 'etc'];
  };
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 relative h-[320px] flex flex-col ${className}`}>
      {/* Badge "Nuevo" en esquina superior derecha */}
      {isNew() && (
        <Badge variant="default" className="absolute top-2 right-2 bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 z-10">
          Nuevo
        </Badge>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
          <div className="w-full h-full bg-cyan-600 flex items-center justify-center">
            {getAvatarContent()}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-3 flex-shrink-0">
        {service.company ? (
          <>
            <h3 className={`font-bold ${getTitleFontSize()} text-gray-900 mb-1 leading-tight`}>
              {service.company}
            </h3>
            <p className="text-xs text-gray-600">{service.name}</p>
          </>
        ) : (
          <h3 className={`font-bold ${getTitleFontSize()} text-gray-900 leading-tight`}>
            {service.name}
          </h3>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-1 mb-4 flex-shrink-0">
        {displayCategories().map((category) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>

      {/* Location */}
      <div className="flex items-center justify-center text-xs text-gray-500 mb-3 flex-shrink-0">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{service.city}</span>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        {/* Botón principal de WhatsApp solo con logo */}
        <Button
          onClick={handleWhatsApp}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-9 font-medium shadow-sm flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">WhatsApp</span>
        </Button>
        
        {/* Botones secundarios compactos */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1 max-w-[100px] border-gray-300 text-gray-700 hover:bg-gray-50 h-7 text-xs px-2"
          >
            <Phone className="h-3 w-3 mr-1" />
            Llamar
          </Button>
          <Button
            onClick={() => onViewMore(service.id)}
            variant="outline"
            className="flex-1 max-w-[100px] border-cyan-300 text-cyan-700 hover:bg-cyan-50 h-7 text-xs px-2"
          >
            Ver más
          </Button>
        </div>
      </div>
    </div>
  );
};