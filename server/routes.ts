import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCaseStudySchema, 
  insertBlogPostSchema,
  insertPageSchema,
  insertContactSubmissionSchema 
} from "@shared/schema";

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
      res.status(500).json({ error: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/featured", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const caseStudies = await storage.getFeaturedCaseStudies(lang);
      res.json(caseStudies);
    } catch (error) {
      console.error("Error fetching featured case studies:", error);
      res.status(500).json({ error: "Failed to fetch featured case studies" });
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
      res.status(500).json({ error: "Failed to fetch case study" });
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
      res.status(500).json({ error: "Failed to fetch blog posts" });
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
      res.status(500).json({ error: "Failed to fetch blog post" });
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
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // ============================================
  // ADMIN API - Case Studies (Protected - TODO: Add auth middleware)
  // ============================================
  app.post("/api/admin/case-studies", async (req, res) => {
    try {
      const validationResult = insertCaseStudySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid case study data", details: validationResult.error });
      }

      const caseStudy = await storage.createCaseStudy(validationResult.data);
      res.status(201).json(caseStudy);
    } catch (error) {
      console.error("Error creating case study:", error);
      res.status(500).json({ error: "Failed to create case study" });
    }
  });

  app.patch("/api/admin/case-studies/:id", async (req, res) => {
    try {
      const caseStudy = await storage.updateCaseStudy(req.params.id, req.body);
      if (!caseStudy) {
        return res.status(404).json({ error: "Case study not found" });
      }
      res.json(caseStudy);
    } catch (error) {
      console.error("Error updating case study:", error);
      res.status(500).json({ error: "Failed to update case study" });
    }
  });

  app.delete("/api/admin/case-studies/:id", async (req, res) => {
    try {
      await storage.deleteCaseStudy(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting case study:", error);
      res.status(500).json({ error: "Failed to delete case study" });
    }
  });

  // ============================================
  // ADMIN API - Blog Posts (Protected - TODO: Add auth middleware)
  // ============================================
  app.get("/api/admin/blog-posts", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const status = req.query.status as string | undefined;
      const posts = await storage.getAllBlogPosts(lang, status);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog-posts", async (req, res) => {
    try {
      const validationResult = insertBlogPostSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid blog post data", details: validationResult.error });
      }

      const post = await storage.createBlogPost(validationResult.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/admin/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ============================================
  // ADMIN API - Pages (Protected - TODO: Add auth middleware)
  // ============================================
  app.get("/api/admin/pages", async (req, res) => {
    try {
      const lang = req.query.lang as string | undefined;
      const pages = await storage.getAllPages(lang);
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const validationResult = insertPageSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid page data", details: validationResult.error });
      }

      const page = await storage.createPage(validationResult.data);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.patch("/api/admin/pages/:id", async (req, res) => {
    try {
      const page = await storage.updatePage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/pages/:id", async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // ============================================
  // ADMIN API - Contact Submissions (Protected - TODO: Add auth middleware)
  // ============================================
  app.get("/api/admin/contact-submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  app.patch("/api/admin/contact-submissions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      await storage.updateContactSubmissionStatus(req.params.id, status);
      res.status(204).send();
    } catch (error) {
      console.error("Error updating contact submission status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  return httpServer;
}
