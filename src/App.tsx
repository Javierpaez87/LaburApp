import { useState } from 'react';
import { HomePage } from '@/pages/HomePage';
import { ServiceDetailPage } from '@/pages/ServiceDetailPage';
import { PublishPage } from '@/pages/PublishPage';
import { MyServicesPage } from '@/pages/MyServicesPage';
import { Toaster } from '@/components/ui/toaster';
import { Service } from '@/types/service';

type AppView = 'home' | 'service-detail' | 'publish' | 'my-services';

interface AppState {
  view: AppView;
  selectedServiceId?: string;
  editingService?: Service;
}

function App() {
  const [appState, setAppState] = useState<AppState>({ view: 'home' });

  const handleViewService = (serviceId: string) => {
    setAppState({ view: 'service-detail', selectedServiceId: serviceId });
  };

  const handlePublishService = () => {
    setAppState({ view: 'publish', editingService: undefined });
  };

  const handleManageServices = () => {
    setAppState({ view: 'my-services' });
  };

  const handleEditService = (service: Service) => {
    setAppState({ view: 'publish', editingService: service });
  };

  const handleBackToHome = () => {
    setAppState({ view: 'home' });
  };

  const handleServiceCreated = () => {
    setAppState({ view: 'home' });
  };

  const renderCurrentView = () => {
    switch (appState.view) {
      case 'home':
        return (
          <HomePage
            onViewService={handleViewService}
            onPublishService={handlePublishService}
            onManageServices={handleManageServices}
          />
        );
      case 'service-detail':
        return appState.selectedServiceId ? (
          <ServiceDetailPage
            serviceId={appState.selectedServiceId}
            onBack={handleBackToHome}
          />
        ) : (
          <HomePage
            onViewService={handleViewService}
            onPublishService={handlePublishService}
            onManageServices={handleManageServices}
          />
        );
      case 'publish':
        return (
          <PublishPage
            onBack={handleBackToHome}
            onServiceCreated={handleServiceCreated}
            editingService={appState.editingService}
          />
        );
      case 'my-services':
        return (
          <MyServicesPage
            onBack={handleBackToHome}
            onEditService={handleEditService}
            onCreateService={handlePublishService}
          />
        );
      default:
        return (
          <HomePage
            onViewService={handleViewService}
            onPublishService={handlePublishService}
            onManageServices={handleManageServices}
          />
        );
    }
  };

  return (
    <>
      {renderCurrentView()}
      <Toaster />
    </>
  );
}

export default App;