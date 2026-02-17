// Patch turbopack runtime to remove @vercel/og reference
// This project does not use OG image generation, but Next.js includes it by default.
// The `resvg.wasm?module` import causes wrangler deploy to fail on Windows.

const fs = require('fs');
const path = require('path');
const glob = require('path');

const runtimeDir = path.join(
  '.open-next', 'server-functions', 'default',
  '.next', 'server', 'chunks', 'ssr'
);

if (!fs.existsSync(runtimeDir)) {
  console.log('Turbopack runtime dir not found, skipping patch');
  process.exit(0);
}

const files = fs.readdirSync(runtimeDir).filter(f => f.endsWith('.js'));

let patched = false;
for (const file of files) {
  const filePath = path.join(runtimeDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('@vercel/og')) {
    content = content.replace(
      /case\s+"next\/dist\/compiled\/@vercel\/og\/index\.node\.js":\s*\n\s*raw\s*=\s*await\s+import\("next\/dist\/compiled\/@vercel\/og\/index\.edge\.js"\);/g,
      'case "next/dist/compiled/@vercel/og/index.node.js":\n                    raw = {};'
    );
    fs.writeFileSync(filePath, content);
    console.log(`Patched: ${file}`);
    patched = true;
  }
}

if (!patched) {
  // Fallback: copy the wasm file so wrangler can find it
  const src = path.join('node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'resvg.wasm');
  if (fs.existsSync(src)) {
    const dstDir = path.join(
      '.open-next', 'server-functions', 'default',
      'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og'
    );
    fs.mkdirSync(dstDir, { recursive: true });
    fs.copyFileSync(src, path.join(dstDir, 'resvg.wasm'));
    console.log('Fallback: copied resvg.wasm to build output');
  } else {
    console.log('No @vercel/og references found and no wasm to copy');
  }
}
