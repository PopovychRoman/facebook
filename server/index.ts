import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleSignup, handleTrackVisit } from "./routes/auth";
import {
  handleGetAttempts,
  handleDeleteAttempt,
  handleClearAttempts,
  handleDeletePageVisit,
  handleClearPageVisits,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/track-visit", handleTrackVisit);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/signup", handleSignup);

  // Admin routes
  app.get("/api/admin/attempts", handleGetAttempts);
  app.delete("/api/admin/attempts/:id", handleDeleteAttempt);
  app.delete("/api/admin/attempts", handleClearAttempts);
  app.delete("/api/admin/visits/:id", handleDeletePageVisit);
  app.delete("/api/admin/visits", handleClearPageVisits);

  return app;
}
