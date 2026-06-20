import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

function dataStoragePlugin() {
  return {
    name: 'data-storage-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/saveData' && req.method === 'POST') {
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
  }
})
