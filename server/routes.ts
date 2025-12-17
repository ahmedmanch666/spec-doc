import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, requireRole, generateToken, type AuthRequest } from "./auth";
import { comparePassword } from "./password";
import { 
  insertCaseStudySchema, 
  insertBlogPostSchema,
  insertPageSchema,
  insertContactSubmissionSchema 
} from "@shared/schema";
import { z } from "zod";

function respondError(res: any, error: any, fallback: string) {
  const status = error?.status || error?.statusCode;
  const code = error?.code;
  if (status === 503 || code === "42P01") {
    return res.status(503).json({
      error: "Database not connected or not initialized",
      hint: "Connect Vercel Postgres and run db:push (and optionally db:seed).",
    });
  }
  return res.status(500).json({ error: fallback });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============================================
  // PUBLIC API - Case Studies
  // ============================================
  app.get("/api/case-studies", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const caseStudies = await storage.getAllCaseStudies(lang);
      res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching case studies:", error);
      respondError(res, error, "Failed to fetch case studies");
    }
  });

  app.get("/api/case-studies/featured", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const caseStudies = await storage.getFeaturedCaseStudies(lang);
      res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching featured case studies:", error);
      respondError(res, error, "Failed to fetch featured case studies");
    }
  });

  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const caseStudy = await storage.getCaseStudyBySlug(req.params.slug);
      if (!caseStudy) {
        return res.status(404).json({ error: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      console.error("Error fetching case study:", error);
      respondError(res, error, "Failed to fetch case study");
    }
  });

  // ============================================
  // PUBLIC API - Blog Posts
  // ============================================
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const posts = await storage.getAllBlogPosts(lang, "published");
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      respondError(res, error, "Failed to fetch blog posts");
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      respondError(res, error, "Failed to fetch blog post");
    }
  });

  // ============================================
  // PUBLIC API - Contact Form
  // ============================================
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactSubmissionSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid submission data", details: validationResult.error });
      }

      const submission = await storage.createContactSubmission(validationResult.data);
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Error creating contact submission:", error);
      respondError(res, error, "Failed to submit contact form");
    }
  });

  // ============================================
  // PUBLIC API - Theme (read-only, used by public site)
  // ============================================
  app.get("/api/theme", async (_req, res) => {
    try {
      const setting = await storage.getSetting("theme");
      const value = setting?.value ?? {
        primary: "#e10600",
        hover: "#b20500",
      };
      res.json(value);
    } catch (error) {
      console.error("Error fetching theme:", error);
      respondError(res, error, "Failed to fetch theme");
    }
  });

  // ============================================
  // AUTH API - Login/Logout/Me
  // ============================================
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Generate token
      const token = generateToken(user);

      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      respondError(res, error, "Failed to login");
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      respondError(res, error, "Failed to fetch user");
    }
  });

  // ============================================
  // ADMIN API - Theme (update)
  // ============================================
  const themeSchema = z.object({
    primary: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color"),
    hover: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Invalid hex color"),
  });

  app.put("/api/admin/theme", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      const parseResult = themeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid theme data", details: parseResult.error });
      }
      const theme = parseResult.data;
      const saved = await storage.setSetting("theme", theme);
      res.json(saved.value);
    } catch (error) {
      console.error("Error updating theme:", error);
      respondError(res, error, "Failed to update theme");
    }
  });

  // ============================================
  // ADMIN API - Dashboard Stats (Protected)
  // ============================================
  app.get("/api/admin/stats", authenticateToken, async (_req, res) => {
    try {
      const [pages, caseStudiesList, blogPostsList, contactSubmissions] =
        await Promise.all([
          storage.getAllPages(),
          storage.getAllCaseStudies(),
          storage.getAllBlogPosts(undefined, undefined),
          storage.getAllContactSubmissions(),
        ]);

      res.json({
        pages: pages.length,
        caseStudies: caseStudiesList.length,
        blogPosts: blogPostsList.length,
        contactSubmissions: contactSubmissions.length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      respondError(res, error, "Failed to fetch admin stats");
    }
  });

  // ============================================
  // ADMIN API - Case Studies (Protected)
  // ============================================
  app.get("/api/admin/case-studies", authenticateToken, async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const caseStudies = await storage.getAllCaseStudies(lang);
      res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching admin case studies:", error);
      respondError(res, error, "Failed to fetch case studies");
    }
  });

  app.post("/api/admin/case-studies", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      const validationResult = insertCaseStudySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid case study data", details: validationResult.error });
      }

      const caseStudy = await storage.createCaseStudy(validationResult.data);
      res.status(201).json(caseStudy);
    } catch (error) {
      console.error("Error creating case study:", error);
      respondError(res, error, "Failed to create case study");
    }
  });

  app.patch("/api/admin/case-studies/:id", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      const caseStudy = await storage.updateCaseStudy(req.params.id, req.body);
      if (!caseStudy) {
        return res.status(404).json({ error: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      console.error("Error updating case study:", error);
      respondError(res, error, "Failed to update case study");
    }
  });

  app.delete("/api/admin/case-studies/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      await storage.deleteCaseStudy(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting case study:", error);
      respondError(res, error, "Failed to delete case study");
    }
  });

  // ============================================
  // ADMIN API - Blog Posts (Protected)
  // ============================================
  app.get("/api/admin/blog-posts", authenticateToken, async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const status = req.query.status as string | undefined;
      const posts = await storage.getAllBlogPosts(lang, status);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      respondError(res, error, "Failed to fetch blog posts");
    }
  });

  app.post("/api/admin/blog-posts", authenticateToken, requireRole("admin", "editor", "content_creator"), async (req, res) => {
    try {
      const validationResult = insertBlogPostSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid blog post data", details: validationResult.error });
      }

      const post = await storage.createBlogPost(validationResult.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      respondError(res, error, "Failed to create blog post");
    }
  });

  app.patch("/api/admin/blog-posts/:id", authenticateToken, requireRole("admin", "editor", "content_creator"), async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      respondError(res, error, "Failed to update blog post");
    }
  });

  app.delete("/api/admin/blog-posts/:id", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      respondError(res, error, "Failed to delete blog post");
    }
  });

  // ============================================
  // ADMIN API - Pages (Protected)
  // ============================================
  app.get("/api/admin/pages", authenticateToken, async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const pages = await storage.getAllPages(lang);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      respondError(res, error, "Failed to fetch pages");
    }
  });

  app.post("/api/admin/pages", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      const validationResult = insertPageSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid page data", details: validationResult.error });
      }

      const page = await storage.createPage(validationResult.data);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      respondError(res, error, "Failed to create page");
    }
  });

  app.patch("/api/admin/pages/:id", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      const page = await storage.updatePage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error updating page:", error);
      respondError(res, error, "Failed to update page");
    }
  });

  app.delete("/api/admin/pages/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page:", error);
      respondError(res, error, "Failed to delete page");
    }
  });

  // ============================================
  // ADMIN API - Contact Submissions (Protected)
  // ============================================
  app.get("/api/admin/contact-submissions", authenticateToken, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      respondError(res, error, "Failed to fetch contact submissions");
    }
  });

  app.patch("/api/admin/contact-submissions/:id/status", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      await storage.updateContactSubmissionStatus(req.params.id, status);
      res.status(204).send();
    } catch (error) {
      console.error("Error updating contact submission status:", error);
      respondError(res, error, "Failed to update status");
    }
  });

  return httpServer;
}
