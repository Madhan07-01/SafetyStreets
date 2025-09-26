import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// 404 handler for unknown API routes (before SPA fallback)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not Found', path: req.originalUrl });
  }
  return next();
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Global error handler (last)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({
    error: err && err.message ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


