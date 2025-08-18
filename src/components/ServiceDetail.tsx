import React from 'react';
import { ArrowLeft, MessageCircle, Phone, MapPin, Calendar, Mail, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/types/service';

interface ServiceDetailProps {
  service: Service;
  onBack: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack }) => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(service.whatsappMessage || 'Hola, te contacto por LaburAr para solicitarte un presupuesto por');
    const phoneNumber = service.phone.replace(/\D/g, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${service.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${service.email}`, '_self');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm border-b mb-6 -mx-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img 
              src="/LaburArApp logo.png" 
              alt="LaburAr" 
              className="h-8 w-auto mr-2"
            />
            <h1 className="text-xl font-bold text-cyan-500">LaburAr</h1>
          </button>
        </div>
      </header>

      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a resultados
      </Button>

      {/* Header Section */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mx-auto lg:mx-0">
                <div className="w-full h-full bg-cyan-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-3xl">
                    {service.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {service.name}
              </h1>
              {service.company && (
                <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span className="text-lg">{service.company}</span>
                </div>
              )}
              
              <div className="flex items-center justify-center lg:justify-start text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{service.neighborhood ? `${service.neighborhood}, ` : ''}{service.city}</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start text-gray-500 mb-6">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Miembro desde {formatDate(service.createdAt)}</span>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contactar por WhatsApp
                </Button>
                <Button
                  onClick={handleCall}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Llamar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Servicios ofrecidos
          </h2>
          <div className="flex flex-wrap gap-2">
            {service.categories.map((category) => (
              <Badge key={category} className="px-3 py-1 text-sm">
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Descripción del servicio
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {service.description}
          </p>
        </CardContent>
      </Card>

      {/* Contact Info Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Información de contacto
          </h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Phone className="h-5 w-5 mr-3 text-gray-400" />
              <span>{service.phone}</span>
            </div>
            <button
              onClick={handleEmail}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail className="h-5 w-5 mr-3 text-gray-400" />
              <span>{service.email}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};