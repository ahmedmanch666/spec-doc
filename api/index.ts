export default async function handler(req: any, res: any) {
  try {
    const mod = await import("../server/app");
    const app = (mod as any).default;

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
