import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { isDbReady } from "./db";

export const app = express();

// body parsing with raw capture
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// optional CORS for Plan B (only when CORS_ORIGIN is set)
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }
  }
  next();
});

// Gate API requests when DB is not configured
app.use((req, res, next) => {
  try {
    if (req.path.startsWith("/api")) {
      if (!isDbReady()) {
        return res.status(503).json({
          error: "Database not connected or not initialized",
          hint: "Connect Vercel Postgres and run db:push (and optionally db:seed).",
        });
      }
    }
    next();
  } catch {
    return res.status(503).json({
      error: "Database not connected or not initialized",
      hint: "Connect Vercel Postgres and run db:push (and optionally db:seed).",
    });
  }
});

// simple request logger for /api
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  (res as any).json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return (originalResJson as any).apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      console.log(logLine);
    }
  });
  next();
});

// health endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, ts: Date.now(), dbReady: isDbReady() });
});

// register application routes
// httpServer not needed in serverless mode; pass a dummy as required by signature
registerRoutes({} as any, app);

// error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
