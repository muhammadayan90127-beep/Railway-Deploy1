import app from "./app";
import { logger } from "./lib/logger";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../../luxury-app/dist")));

// Catch-all for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../luxury-app/dist/index.html"));
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});