// Script simple para generar iconos PWA temporales
// Para producción, se recomienda usar diseños profesionales

import { createWriteStream } from 'fs';
import { createCanvas } from 'canvas';

const sizes = [192, 512];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fondo marrón panadería
  ctx.fillStyle = '#8b5a3c';
  ctx.fillRect(0, 0, size, size);

  // Círculo central más claro
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Letra F
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F', centerX, centerY);

  // Guardar como PNG
  const out = createWriteStream(`./public/pwa-${size}x${size}.png`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on('finish', () => {
      console.log(`✓ Generated pwa-${size}x${size}.png`);
      resolve();
    });
    out.on('error', reject);
  });
}

async function generateAllIcons() {
  console.log('Generating PWA icons...');
  try {
    for (const size of sizes) {
      await generateIcon(size);
    }
    console.log('\n✓ All icons generated successfully!');
    console.log('\nRecommendation: Replace these placeholder icons with professional designs.');
  } catch (error) {
    console.error('Error generating icons:', error.message);
    console.log('\nPlease generate icons manually using the instructions in public/ICONS_README.md');
  }
}

generateAllIcons();
