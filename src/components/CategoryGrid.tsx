import React from 'react';
import { Hammer, Wrench, HardHat, Building, Zap, PaintBucket, Flame, Gauge, Leaf, PenTool as Tool, HeartHandshake, Scissors, Car, ChefHat, Scissors as Scissors2, Ruler, Palette, Home, Calculator, Truck, Heart, Stethoscope, Dog, MoreHorizontal } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/types/service';

interface CategoryGridProps {
  onCategorySelect: (category: string) => void;
  className?: string;
}

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
  'Veterinaria': Bone,
  'Salud': Stethoscope,
  'Otros': MoreHorizontal
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect, className = '' }) => {
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Servicios que pueden interesarte cerca tuyo
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {SERVICE_CATEGORIES.map((category) => {
          const IconComponent = categoryIcons[category];
          return (
            <button
              key={category}
              onClick={() => onCategorySelect(category)}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-cyan-300 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-cyan-200 transition-colors">
                <IconComponent className="h-6 w-6 text-cyan-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                {category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};