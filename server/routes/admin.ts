import { RequestHandler } from "express";
import {
  getAttempts,
  removeAttempt,
  clearAttempts,
  getPageVisits,
  removePageVisit,
  clearPageVisits,
} from "./auth";

export const handleGetAttempts: RequestHandler = (_req, res) => {
  // In production, verify admin authentication here
  const attempts = getAttempts();
  const pageVisits = getPageVisits();
  res.json({ attempts, pageVisits });
};

export const handleDeleteAttempt: RequestHandler = (req, res) => {
  // In production, verify admin authentication here
  const { id } = req.params;
  const success = removeAttempt(id as string);

  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Attempt not found" });
  }
};

export const handleDeletePageVisit: RequestHandler = (req, res) => {
  // In production, verify admin authentication here
  const { id } = req.params;
  const success = removePageVisit(id as string);

  if (success) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Visit not found" });
  }
};

export const handleClearAttempts: RequestHandler = (_req, res) => {
  // In production, verify admin authentication here
  clearAttempts();
  res.json({ success: true, message: "All attempts cleared" });
};

export const handleClearPageVisits: RequestHandler = (_req, res) => {
  // In production, verify admin authentication here
  clearPageVisits();
  res.json({ success: true, message: "All visits cleared" });
};
