import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SERVICE_CATEGORIES, ServiceFormData } from '@/types/service';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  company: z.string().optional(),
  city: z.string().min(2, 'La ciudad es requerida'),
  neighborhood: z.string().optional(),
  phone: z.string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .regex(/^(\+54|54)?9?[0-9]{8,10}$/, 'Formato de teléfono argentino inválido. Ej: +5491134567890 o 1134567890'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  whatsappMessage: z.string().optional(),
  customCategory: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface PublishFormProps {
  onSubmit: (data: ServiceFormData) => Promise<void>;
  initialData?: ServiceFormData;
  isEditing?: boolean;
  onBack: () => void;
  isLoading?: boolean;
}

export const PublishForm: React.FC<PublishFormProps> = ({ 
  onSubmit, 
  initialData,
  isEditing = false,
  onBack, 
  isLoading = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      categories: [],
      whatsappMessage: 'Hola, te contacto por LaburAr para solicitarte un presupuesto por',
      customCategory: ''
    }
  });

  const selectedCategories = watch('categories') || [];
  const customCategory = watch('customCategory') || '';

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setValue('categories', [...selectedCategories, category]);
    } else {
      setValue('categories', selectedCategories.filter(c => c !== category));
    }
  };

  const handleCustomCategoryChange = (value: string) => {
    setValue('customCategory', value);
    if (value.trim()) {
      const customCategoryName = `Otros: ${value.trim()}`;
      if (!selectedCategories.includes(customCategoryName)) {
        setValue('categories', [...selectedCategories.filter(c => !c.startsWith('Otros:')), customCategoryName]);
      }
    } else {
      setValue('categories', selectedCategories.filter(c => !c.startsWith('Otros:')));
    }
  };

  const onFormSubmit = async (data: FormData) => {
    const serviceData: ServiceFormData = {
      name: data.name,
      company: data.company,
      city: data.city,
      neighborhood: data.neighborhood,
      phone: data.phone,
      email: data.email,
      categories: data.categories,
      description: data.description,
      whatsappMessage: data.whatsappMessage
    };
    
    try {
      await onSubmit(serviceData);
      reset();
      toast({
        title: isEditing ? "¡Servicio actualizado!" : "¡Tu servicio ya está publicado!",
        description: isEditing ? "Los cambios han sido guardados." : "Los clientes pueden contactarte ahora mismo.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al publicar tu servicio. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar servicio' : 'Publicar mi servicio'}
            </CardTitle>
            <Button variant="ghost" onClick={onBack}>
              ← Volver
            </Button>
          </div>
          <p className="text-gray-600">
            {isEditing 
              ? 'Actualiza la información de tu servicio'
              : 'Completa tu perfil en 4 minutos y comienza a recibir clientes hoy mismo.'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Información personal</h3>
              
              <div>
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Tu nombre y apellido"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Nombre de la empresa (opcional)</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Ej: Plomería JCP"
                  className="mt-1"
                />
              </div>

            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    {...register('city')}
                    placeholder="Buenos Aires"
                    className="mt-1"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="neighborhood">Barrio (opcional)</Label>
                  <Input
                    id="neighborhood"
                    {...register('neighborhood')}
                    placeholder="Palermo"
                    className="mt-1"
                  />
                  {errors.neighborhood && (
                    <p className="text-red-500 text-sm mt-1">{errors.neighborhood.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono/WhatsApp *</Label>
                  <p className="text-xs text-gray-500 mb-1">
                    Formato argentino. Ej: +5491134567890, 1134567890 o 91134567890
                  </p>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+5491134567890"
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="tu@email.com"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <Label>Categorías de servicios *</Label>
              <p className="text-sm text-gray-600 mb-3">Selecciona todos los servicios que ofreces</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {SERVICE_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={category} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              
              {/* Custom Category Input */}
              <div className="mt-4">
                <Label htmlFor="customCategory">Si seleccionaste "Otros", especifica:</Label>
                <Input
                  id="customCategory"
                  value={customCategory}
                  onChange={(e) => handleCustomCategoryChange(e.target.value)}
                  placeholder="Especifica tu servicio..."
                  className="mt-1"
                  disabled={!selectedCategories.includes('Otros')}
                />
              </div>
              
              {errors.categories && (
                <p className="text-red-500 text-sm mt-1">{errors.categories.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Descripción de cómo trabajas *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe tu experiencia, cómo trabajas, qué materiales usas, si das garantía, etc. Mínimo 50 caracteres."
                className="mt-1 min-h-32"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* WhatsApp Message */}
            <div>
              <Label htmlFor="whatsappMessage">Mensaje personalizado de WhatsApp (opcional)</Label>
              <Input
                id="whatsappMessage"
                {...register('whatsappMessage')}
                placeholder="Hola, te contacto por LaburAr para solicitarte un presupuesto por"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este será el mensaje que los clientes verán al contactarte por WhatsApp
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >
              {isLoading 
                ? (isEditing ? 'Guardando...' : 'Publicando...') 
                : (isEditing ? 'Guardar cambios' : 'Publicar servicio (gratis)')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};