import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

function dataStoragePlugin() {
  return {
    name: 'data-storage-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/loadData' && req.method === 'GET') {
          try {
            const dataPath = path.resolve(__dirname, 'src/data.js');
            const fileContent = fs.readFileSync(dataPath, 'utf-8');
            const jsonPart = fileContent.replace('export const weaponsDataStore = ', '').replace(/;\s*$/, '');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(jsonPart);
          } catch (err) {
            res.statusCode = 200;
            res.end('[]');
          }
        } else if (req.url === '/api/saveData' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const dataPath = path.resolve(__dirname, 'src/data.js');
              const jsContent = `export const weaponsDataStore = ${body};\n`;
              fs.writeFileSync(dataPath, jsContent, 'utf-8');
              res.statusCode = 200;
              res.end('Data saved successfully');
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.end('Error saving data');
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), dataStoragePlugin()],
  server: {
    watch: {
      ignored: ['**/src/data.js']
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild', // Minifikasi bawaan yang sangat cepat
    cssCodeSplit: true, // Memecah file CSS
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Memecah file node_modules menjadi chunk terpisah agar browser dapat melakukan cache
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
