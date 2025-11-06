# Generación de Iconos PWA

Para generar los iconos PWA en formato PNG desde el archivo `pwa-icon.svg`, puedes usar cualquiera de estos métodos:

## Opción 1: Usando ImageMagick (Recomendado)

```bash
# Instalar ImageMagick si no lo tienes
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generar iconos
convert pwa-icon.svg -resize 192x192 pwa-192x192.png
convert pwa-icon.svg -resize 512x512 pwa-512x512.png
```

## Opción 2: Usando una herramienta online

1. Ve a https://realfavicongenerator.net/ o https://www.pwabuilder.com/imageGenerator
2. Sube el archivo `pwa-icon.svg`
3. Genera los iconos en los tamaños: 192x192 y 512x512
4. Descarga y coloca los archivos en esta carpeta (`public/`)

## Opción 3: Usando Node.js con sharp

```bash
npm install -g sharp-cli
sharp -i pwa-icon.svg -o pwa-192x192.png resize 192 192
sharp -i pwa-icon.svg -o pwa-512x512.png resize 512 512
```

## Tamaños requeridos

- `pwa-192x192.png` - Icono estándar
- `pwa-512x512.png` - Icono de alta resolución y maskable

Una vez generados los iconos PNG, puedes eliminar este archivo README.
