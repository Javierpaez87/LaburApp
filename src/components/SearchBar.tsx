import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CitySelect } from '@/components/CitySelect';

interface SearchBarProps {
  onSearch: (query: string, location?: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10 pointer-events-none" />
          <Input
            type="text"
            placeholder="¿Qué buscás hoy?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 rounded-l-lg md:rounded-r-none bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <CitySelect
          value={location}
          onChange={setLocation}
          placeholder="Ubicación (opcional)"
          className="md:w-64"
        />

        <Button
          type="submit"
          className="h-12 px-8 bg-cyan-600 text-white hover:bg-cyan-700 font-semibold rounded-r-lg md:rounded-l-none transition-colors"
        >
          <Search className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Buscar</span>
        </Button>
      </div>
    </form>
  );
};