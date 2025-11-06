import { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAPrompt() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Hook para manejar actualizaciones del service worker
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Manejar el evento beforeinstallprompt
  useEffect(() => {
    const handler = (e) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault();
      // Guardar el evento para usarlo después
      setDeferredPrompt(e);
      // Mostrar nuestro UI personalizado
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Verificar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('La app ya está instalada');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleCloseInstallPrompt = () => {
    setShowInstallPrompt(false);
  };

  const handleCloseOfflineReady = () => {
    setOfflineReady(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <>
      {/* Prompt de instalación */}
      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 20 } }}
      >
        <Alert
          severity="info"
          icon={<GetAppIcon />}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={handleInstallClick}
                sx={{ fontWeight: 'bold' }}
              >
                Instalar
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseInstallPrompt}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{ width: '100%', alignItems: 'center' }}
        >
          Instala Fermenta en tu dispositivo para acceso rápido
        </Alert>
      </Snackbar>

      {/* Notificación de disponibilidad offline */}
      <Snackbar
        open={offlineReady}
        autoHideDuration={5000}
        onClose={handleCloseOfflineReady}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 20 } }}
      >
        <Alert
          onClose={handleCloseOfflineReady}
          severity="success"
          sx={{ width: '100%' }}
        >
          La aplicación está lista para funcionar sin conexión
        </Alert>
      </Snackbar>

      {/* Notificación de actualización disponible */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 20 } }}
      >
        <Alert
          severity="warning"
          icon={<RefreshIcon />}
          action={
            <>
              <Button
                color="inherit"
                size="small"
                onClick={handleUpdate}
                sx={{ fontWeight: 'bold' }}
              >
                Actualizar
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setNeedRefresh(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{ width: '100%', alignItems: 'center' }}
        >
          Nueva versión disponible
        </Alert>
      </Snackbar>
    </>
  );
}

export default PWAPrompt;
