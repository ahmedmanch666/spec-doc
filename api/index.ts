import { createRequire } from "module";

const require = createRequire(import.meta.url);
const appModule = require("../dist/app.cjs");
const app = appModule?.default ?? appModule;

export default function handler(req: any, res: any) {
  try {
    (app as any)(req, res, (err: any) => {
      if (err) {
        console.error("Unhandled error in API handler:", err);
        if (!res.headersSent) {
          res.status(500).json({
            error: "Internal Server Error",
            message: err?.message || "Unknown error",
          });
        }
      }
    });
  } catch (err: any) {
    console.error("Fatal error in API handler:", err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal Server Error",
        message: err?.message || "Unknown error",
      });
    }
  }
}
