import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Service } from '@/types/service';
import { getUserServices, deleteService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface MyServicesPageProps {
  onBack: () => void;
  onEditService: (service: Service) => void;
  onCreateService: () => void;
}

export const MyServicesPage: React.FC<MyServicesPageProps> = ({
  onBack,
  onEditService,
  onCreateService
}) => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userServices = await getUserServices(user.id);
      setServices(userServices);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus servicios",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!user || !confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;
    
    setDeletingId(serviceId);
    try {
      await deleteService(serviceId, user.id);
      setServices(services.filter(s => s.id !== serviceId));
      toast({
        title: "Servicio eliminado",
        description: "Tu servicio ha sido eliminado correctamente"
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el servicio",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
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
              <Button
                onClick={onBack}
                variant="ghost"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Mis servicios</h1>
            </div>
            <Button
              onClick={onCreateService}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo servicio
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {services.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes servicios publicados
              </h3>
              <p className="text-gray-600 mb-6">
                Publica tu primer servicio y comienza a recibir clientes
              </p>
              <Button
                onClick={onCreateService}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publicar servicio
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.company && (
                        <p className="text-sm text-gray-600">{service.company}</p>
                      )}
                    </div>
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {service.neighborhood ? `${service.neighborhood}, ` : ''}{service.city}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {service.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => onEditService(service)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteService(service.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingId === service.id}
                      >
                        {deletingId === service.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};