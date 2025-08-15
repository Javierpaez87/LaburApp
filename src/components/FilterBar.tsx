import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  selectedCity,
  onCategoryChange,
  onCityChange,
  onClearFilters,
  className = ''
}) => {
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

        <Select value={selectedCity || ''} onValueChange={(value) => onCityChange(value === 'all-cities' ? undefined : value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las ciudades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-cities">Todas las ciudades</SelectItem>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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