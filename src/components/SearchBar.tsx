import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CitySelect } from '@/components/CitySelect';
import { SERVICE_CATEGORIES } from '@/types/service';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, location?: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = SERVICE_CATEGORIES.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    updateDropdownPosition();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    updateDropdownPosition();
    if (query.length >= 2) {
      const filtered = SERVICE_CATEGORIES.filter(category =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (category: string) => {
    setQuery(category);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!dropdownRef.current?.contains(relatedTarget)) {
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location);
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10 pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="¿Qué servicios buscás? (Plomería, Carpintería, etc)"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="pl-12 pr-10 h-12 rounded-l-lg md:rounded-r-none bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
          <ChevronDown className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform pointer-events-none",
            isOpen && "rotate-180"
          )} />

          {isOpen && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="fixed z-[99999] bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`
              }}
            >
              {suggestions.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(category);
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    index === highlightedIndex && "bg-gray-50"
                  )}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-900">{category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
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