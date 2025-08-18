import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CitySelect } from '@/components/CitySelect';
import { SERVICE_CATEGORIES } from '@/types/service';

interface FilterBarProps {
  selectedCategory?: string;
  selectedCity?: string;
  onCategoryChange: (category?: string) => void;
  onCityChange: (city?: string) => void;
  onClearFilters: () => void;
  className?: string;
}

const CITIES = [
  'Buenos Aires',
  'Córdoba',
  'Rosario',
  'Mendoza',
  'La Plata',
  'Mar del Plata'
];
  const hasFilters = selectedCategory || selectedCity;

  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <Select value={selectedCategory || ''} onValueChange={(value) => onCategoryChange(value === 'all-categories' ? undefined : value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">Todas las categorías</SelectItem>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-full sm:w-48">
          <CitySelect
            value={selectedCity || ''}
            onChange={(value) => onCityChange(value || undefined)}
            placeholder="Todas las ciudades"
          />
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};