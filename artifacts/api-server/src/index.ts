import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../luxury-app/dist')));

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../luxury-app/dist/index.html'));
});