import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchCities } from '@/data/cities';
import { cn } from '@/lib/utils';

interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  placeholder = "Selecciona tu ciudad",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchCities(searchQuery, 8);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

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
    setSearchQuery(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
    updateDropdownPosition();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    updateDropdownPosition();
    if (searchQuery.length >= 2) {
      const results = searchCities(searchQuery, 8);
      setSuggestions(results);
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchQuery(city);
    onChange(city);
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
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Only update if we're not clicking on a suggestion
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!dropdownRef.current?.contains(relatedTarget)) {
      // Delay to allow click on suggestions
      setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 z-10 pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="pl-12 pr-10 h-12 bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
        <ChevronDown className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </div>

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
          {suggestions.map((city, index) => (
            <button
              key={city}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                handleSuggestionClick(city);
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                index === highlightedIndex && "bg-gray-50"
              )}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-900">{city}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};