import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ServiceList } from '@/components/ServiceList';
import { FilterBar } from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { Service } from '@/types/service';
import { listServices, initializeMockData } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { UserPlus } from 'lucide-react';
interface HomePageProps {
  onViewService: (serviceId: string) => void;
  onPublishService: () => void;
  onManageServices: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onViewService, 
  onPublishService,
  onManageServices 
}) => {
  const { user, isAuthenticated, signInWithGoogle, signOut } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();

  const loadServices = async () => {
    setIsLoading(true);
    try {
      // Only initialize mock data if user is authenticated and in development
      if (process.env.NODE_ENV === 'development' && isAuthenticated) {
        await initializeMockData();
      }
      
      const filters = {
        search: searchQuery || undefined,
        category: selectedCategory,
        city: selectedCity,
      };
      const data = await listServices(filters);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [searchQuery, selectedCategory, selectedCity, isAuthenticated]);

  const handleSearch = (query: string, location?: string) => {
    setSearchQuery(query);
    if (location) setSelectedCity(location);
  };

  const handleCategorySelect = (category: string) => setSelectedCategory(category);

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCity(undefined);
    setSearchQuery('');
  };

  const handlePublishClick = () => {
    if (isAuthenticated) {
      onPublishService();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
      onPublishService();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setAuthLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src="/LaburArApp logo.png" alt="LaburAr App" className="h-8 w-auto" />
             <<h1 className="font-bold tracking-tight leading-none">
  <span className="block text-xl md:text-2xl leading-none">LaburAr</span>
  <span className="block text-xs md:text-sm font-semibold text-black leading-none -m-[6px] md:-mt-[8px]">app</span>
</h1>
            </button>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <UserMenu 
                  user={user!} 
                  onManageServices={onManageServices}
                  onSignOut={signOut}
                />
              ) : (
                <Button
                  onClick={handlePublishClick}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl px-4 py-2"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registrar servicio
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-laburar-400 via-laburar-500 to-laburar-700" />

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Encontrá el servicio que necesitás
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Te conectamos con los mejores profesionales cerca tuyo
          </p>

          <div className="mx-auto max-w-3xl">
            <SearchBar onSearch={handleSearch} className="mb-8 shadow-soft" />
          </div>

          <Button
            onClick={handlePublishClick}
            size="lg"
            className="bg-laburar-600 hover:bg-laburar-700 text-white font-semibold rounded-xl px-6 md:px-8 py-6 text-sm md:text-base shadow-lg border-2 border-laburar-600 hover:border-laburar-700 transition-all duration-200 w-full max-w-lg mx-auto"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            <div className="text-center leading-tight">
              <div className="font-bold">Registra tus servicios</div>
              <div className="text-xs md:text-sm font-normal text-white/90">Es gratis y solo tarda 4 minutos</div>
            </div>
          </Button>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-8 md:py-14 bg-laburar-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Profesionales disponibles</h2>
            <FilterBar
              selectedCategory={selectedCategory}
              selectedCity={selectedCity}
              onCategoryChange={setSelectedCategory}
              onCityChange={setSelectedCity}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
            <ServiceList services={services} onViewMore={onViewService} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-8 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-semibold mb-6">Servicios que pueden interesarte cerca tuyo</h3>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
            <CategoryGrid onCategorySelect={handleCategorySelect} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/LaburArApp logo.png" alt="LaburAr" className="h-8 w-auto" />
            <h2 className="text-xl font-bold">LaburAr</h2>
          </div>
          <p className="text-white/70 mb-6">
            Conectando personas con los mejores profesionales de servicios
          </p>
          
          {/* Patagonia Argentina with mountain icon */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg 
              className="h-5 w-5 text-white/70" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22l-9-12z"/>
            </svg>
            <span className="text-white/70 font-medium">Patagonia Argentina</span>
          </div>
          
          {/* Copyright */}
          <p className="text-white/60 text-sm leading-relaxed">
            © 2025 LaburAr App. Hecho en Junín de los Andes, Neuquén.<br />
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignInWithGoogle={handleSignIn}
        isLoading={authLoading}
      />
    </div>
  );
};
