import { db } from "./db";
import { 
  users, 
  caseStudies, 
  blogPosts, 
  pages, 
  contactSubmissions,
  type User,
  type InsertUser,
  type CaseStudy,
  type InsertCaseStudy,
  type BlogPost,
  type InsertBlogPost,
  type Page,
  type InsertPage,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;
  
  // Case Studies
  getAllCaseStudies(lang?: string): Promise<CaseStudy[]>;
  getFeaturedCaseStudies(lang?: string): Promise<CaseStudy[]>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  getCaseStudyById(id: string): Promise<CaseStudy | undefined>;
  createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined>;
  deleteCaseStudy(id: string): Promise<void>;
  
  // Blog Posts
  getAllBlogPosts(lang?: string, status?: string): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;
  
  // Pages
  getAllPages(lang?: string): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  getPageById(id: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;
  
  // Contact Submissions
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: string, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ============================================
  // USERS
  // ============================================
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id));
  }

  // ============================================
  // CASE STUDIES
  // ============================================
  async getAllCaseStudies(lang?: string): Promise<CaseStudy[]> {
    const query = lang 
      ? db.select().from(caseStudies).where(eq(caseStudies.lang, lang)).orderBy(desc(caseStudies.year))
      : db.select().from(caseStudies).orderBy(desc(caseStudies.year));
    return await query;
  }

  async getFeaturedCaseStudies(lang?: string): Promise<CaseStudy[]> {
    const query = lang
      ? db.select().from(caseStudies).where(and(eq(caseStudies.featured, true), eq(caseStudies.lang, lang))).orderBy(desc(caseStudies.year))
      : db.select().from(caseStudies).where(eq(caseStudies.featured, true)).orderBy(desc(caseStudies.year));
    return await query;
  }

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
    return caseStudy;
  }

  async getCaseStudyById(id: string): Promise<CaseStudy | undefined> {
    const [caseStudy] = await db.select().from(caseStudies).where(eq(caseStudies.id, id)).limit(1);
    return caseStudy;
  }

  async createCaseStudy(caseStudy: InsertCaseStudy): Promise<CaseStudy> {
    const [created] = await db.insert(caseStudies).values(caseStudy).returning();
    return created;
  }

  async updateCaseStudy(id: string, caseStudy: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    const [updated] = await db.update(caseStudies)
      .set({ ...caseStudy, updatedAt: new Date() })
      .where(eq(caseStudies.id, id))
      .returning();
    return updated;
  }

  async deleteCaseStudy(id: string): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }

  // ============================================
  // BLOG POSTS
  // ============================================
  async getAllBlogPosts(lang?: string, status?: string): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (lang && status) {
      query = query.where(and(eq(blogPosts.lang, lang), eq(blogPosts.status, status)));
    } else if (lang) {
      query = query.where(eq(blogPosts.lang, lang));
    } else if (status) {
      query = query.where(eq(blogPosts.status, status));
    }
    
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return post;
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updated] = await db.update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // ============================================
  // PAGES
  // ============================================
  async getAllPages(lang?: string): Promise<Page[]> {
    const query = lang
      ? db.select().from(pages).where(eq(pages.lang, lang)).orderBy(desc(pages.updatedAt))
      : db.select().from(pages).orderBy(desc(pages.updatedAt));
    return await query;
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
    return page;
  }

  async getPageById(id: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
    return page;
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [created] = await db.insert(pages).values(page).returning();
    return created;
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined> {
    const [updated] = await db.update(pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updated;
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // ============================================
  // CONTACT SUBMISSIONS
  // ============================================
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }

  async updateContactSubmissionStatus(id: string, status: string): Promise<void> {
    await db.update(contactSubmissions).set({ status }).where(eq(contactSubmissions.id, id));
  }
}

export const storage = new DatabaseStorage();
