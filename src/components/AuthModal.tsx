import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInWithGoogle: () => Promise<void>;
  isLoading: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignInWithGoogle,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Iniciar sesión
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600">
            Para publicar y gestionar tus servicios necesitas iniciar sesión
          </p>
          
          <Button
            onClick={onSignInWithGoogle}
            disabled={isLoading}
            className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="h-5 w-5 mr-2"
              />
            )}
            {isLoading ? 'Iniciando sesión...' : 'Continuar con Google'}
          </Button>
          
          <p className="text-xs text-center text-gray-500">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};