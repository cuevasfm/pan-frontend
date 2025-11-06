# Configuración PWA - Fermenta

Este documento describe la implementación de Progressive Web App (PWA) para la aplicación Fermenta.

## Características Implementadas

### 1. Service Worker
- **Actualización automática**: El service worker se actualiza automáticamente cuando hay una nueva versión
- **Cache de recursos**: Los archivos estáticos (JS, CSS, HTML, imágenes, fuentes) se almacenan en cache
- **Funcionamiento offline**: La aplicación funciona sin conexión después de la primera visita

### 2. Caché de Recursos

#### Fuentes de Google
- Cache strategy: `CacheFirst`
- Duración: 1 año
- Se almacenan las fuentes de Google Fonts para acceso rápido

#### API Requests
- Cache strategy: `NetworkFirst`
- Duración: 5 minutos
- Timeout de red: 10 segundos
- Permite funcionamiento offline con datos cacheados

### 3. Manifest (manifest.webmanifest)

El manifest contiene:
- Nombre de la aplicación: "Fermenta - Gestión de Pedidos"
- Nombre corto: "Fermenta"
- Color del tema: `#8b5a3c` (marrón panadería)
- Modo de visualización: `standalone` (pantalla completa sin navegador)
- Iconos en tamaños 192x192 y 512x512

### 4. Componente PWAPrompt

Ubicado en `/src/components/PWAPrompt.jsx`, proporciona:

#### Prompt de Instalación
- Se muestra automáticamente cuando la PWA puede ser instalada
- Permite al usuario instalar la app en su dispositivo
- UI personalizado con Material-UI

#### Notificaciones
1. **Disponibilidad Offline**: Confirma cuando la app está lista para funcionar sin conexión
2. **Actualización Disponible**: Alerta cuando hay una nueva versión con botón para actualizar

## Generación de Iconos

### Iconos Requeridos

Los iconos PWA deben estar ubicados en `/public/`:
- `pwa-192x192.png` - Icono estándar (192x192px)
- `pwa-512x512.png` - Icono de alta resolución (512x512px)

### Cómo Generar los Iconos

#### Opción 1: Usando el SVG base (Recomendado)

Existe un archivo `pwa-icon.svg` en `/public/` que puedes usar como base:

```bash
# Con ImageMagick
brew install imagemagick
convert public/pwa-icon.svg -resize 192x192 public/pwa-192x192.png
convert public/pwa-icon.svg -resize 512x512 public/pwa-512x512.png
```

#### Opción 2: Herramientas Online

1. Ve a https://realfavicongenerator.net/
2. Sube tu diseño
3. Genera iconos en los tamaños requeridos
4. Coloca los archivos en `/public/`

#### Opción 3: Diseño Personalizado

Recomendaciones de diseño:
- Usa colores de la marca (#8b5a3c - marrón principal)
- Incluye el logo o inicial de la marca
- Diseño simple y reconocible
- Evita texto pequeño (no se lee en iconos pequeños)

## Instalación y Uso

### Desarrollo

La PWA está habilitada en modo desarrollo:

```bash
npm run dev
```

La aplicación mostrará:
- Prompt de instalación (si el navegador lo soporta)
- Notificación cuando esté lista para funcionar offline
- Notificaciones de actualizaciones

### Producción

```bash
npm run build
npm run preview
```

El service worker y manifest se generan automáticamente durante el build.

## Probando la PWA

### Chrome DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Verifica:
   - **Manifest**: Revisa que todos los campos estén correctos
   - **Service Workers**: Verifica que esté registrado y activo
   - **Cache Storage**: Comprueba que los recursos se estén cacheando

### Lighthouse

1. Abre DevTools
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Ejecuta el análisis

Objetivo: Score de 90+ en PWA

### Probando en Dispositivos Móviles

#### Android (Chrome)
1. Visita la app desde Chrome en Android
2. Aparecerá un banner de "Agregar a pantalla de inicio"
3. Acepta para instalar la PWA

#### iOS (Safari)
1. Visita la app desde Safari en iOS
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

## Características PWA

### ✅ Instalable
- Los usuarios pueden instalar la app en su dispositivo
- Se ejecuta en modo standalone (sin barra del navegador)
- Aparece en el cajón de aplicaciones

### ✅ Offline First
- Funciona sin conexión después de la primera visita
- Los datos en cache permiten consultar información offline
- Las API requests se intentan primero por red, luego por cache

### ✅ Actualización Automática
- Las nuevas versiones se detectan automáticamente
- El usuario recibe una notificación para actualizar
- La actualización se aplica con un click

### ✅ Experiencia Nativa
- Pantalla de inicio personalizada
- Sin barra del navegador en modo standalone
- Transiciones y navegación fluidas

## Personalización

### Cambiar Colores del Tema

Edita `vite.config.js`:

```javascript
manifest: {
  theme_color: '#tu-color',
  background_color: '#tu-color-de-fondo',
}
```

### Modificar Estrategia de Cache

Edita `vite.config.js` en la sección `workbox`:

```javascript
runtimeCaching: [
  {
    urlPattern: /\/api\/.*/i,
    handler: 'NetworkFirst', // o 'CacheFirst', 'StaleWhileRevalidate'
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 5
      }
    }
  }
]
```

### Deshabilitar PWA en Desarrollo

Si necesitas deshabilitar la PWA temporalmente:

```javascript
// vite.config.js
devOptions: {
  enabled: false, // Cambia a false
  type: 'module'
}
```

## Troubleshooting

### El Service Worker no se actualiza

1. Abre DevTools > Application > Service Workers
2. Click en "Unregister"
3. Recarga la página con Ctrl+Shift+R (hard refresh)

### Los iconos no aparecen

1. Verifica que los archivos existan en `/public/`
2. Los nombres deben ser exactamente: `pwa-192x192.png` y `pwa-512x512.png`
3. Haz un hard refresh (Ctrl+Shift+R)

### El prompt de instalación no aparece

- El prompt solo aparece en HTTPS o localhost
- Algunos navegadores tienen sus propios criterios
- En iOS, el proceso es manual (botón compartir)

## Recursos Adicionales

- [Documentación vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

## Checklist de Deployment

Antes de desplegar a producción:

- [ ] Generar iconos finales (192x192 y 512x512)
- [ ] Probar instalación en Chrome (Android/Desktop)
- [ ] Probar instalación en Safari (iOS)
- [ ] Ejecutar Lighthouse y obtener score 90+ en PWA
- [ ] Verificar funcionamiento offline
- [ ] Probar actualización de la app
- [ ] Verificar que el service worker se registre correctamente
- [ ] Comprobar que los recursos se cacheen adecuadamente
