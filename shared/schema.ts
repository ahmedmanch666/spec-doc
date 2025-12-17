import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// USERS TABLE (for CMS authentication)
// ============================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("content_creator"), // admin, editor, content_creator
  avatar: text("avatar"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// CASE STUDIES TABLE
// ============================================
export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  lang: text("lang").notNull().default("en"), // en | ar
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  client: text("client").notNull(),
  industry: text("industry").array().notNull(),
  region: text("region").notNull(),
  year: integer("year").notNull(),
  services: text("services").array().notNull(),
  deliverables: text("deliverables").array(),
  timeline: text("timeline"),
  links: json("links").$type<{ website?: string; social?: string[] }>(),
  coverImage: text("cover_image").notNull(),
  gallery: text("gallery").array(),
  videos: text("videos").array(),
  models3d: text("models_3d").array(),
  beforeAfter: json("before_after").$type<{ before?: string; after?: string }>(),
  challenge: text("challenge"),
  strategy: text("strategy"),
  solutionBrand: text("solution_brand"),
  solutionPackaging: text("solution_packaging"),
  solutionSocialVideo: text("solution_social_video"),
  solutionWeb: text("solution_web"),
  solution3d: text("solution_3d"),
  execution: text("execution"),
  impactKpis: json("impact_kpis").$type<Array<{ kpi: string; value: number; unit: string }>>(),
  featured: boolean("featured").notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImage: text("og_image"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;

// ============================================
// BLOG POSTS TABLE
// ============================================
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  lang: text("lang").notNull().default("en"), // en | ar
  title: text("title").notNull(),
  summary: text("summary"),
  coverImage: text("cover_image").notNull(),
  body: text("body").notNull(), // Rich text HTML
  tags: text("tags").array(),
  status: text("status").notNull().default("draft"), // draft | review | scheduled | published
  scheduledAt: timestamp("scheduled_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// ============================================
// PAGES TABLE (for dynamic pages in CMS)
// ============================================
export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  lang: text("lang").notNull().default("en"), // en | ar
  title: text("title").notNull(),
  content: json("content").$type<any>(), // JSON structure for page widgets/layout
  status: text("status").notNull().default("draft"), // draft | published
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

// ============================================
// CONTACT FORM SUBMISSIONS
// ============================================
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new | read | replied
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// ============================================
// SETTINGS (key/value store for site-wide config like theme)
// ============================================
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: json("value").$type<any>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Setting = typeof settings.$inferSelect;
