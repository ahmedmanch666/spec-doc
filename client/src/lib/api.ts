import type { CaseStudy, BlogPost } from "@shared/schema";
import { fetchJson } from "./http";
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

// ============================================
// CASE STUDIES
// ============================================
export async function getCaseStudies(lang?: string): Promise<CaseStudy[]> {
  const url = lang ? `${API_BASE}/case-studies?lang=${lang}` : `${API_BASE}/case-studies`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch case studies");
  }
  return response.json();
}

export async function getFeaturedCaseStudies(lang?: string): Promise<CaseStudy[]> {
  const url = lang ? `${API_BASE}/case-studies/featured?lang=${lang}` : `${API_BASE}/case-studies/featured`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch featured case studies");
  }
  return response.json();
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
  const response = await fetch(`${API_BASE}/case-studies/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch case study");
  }
  return response.json();
}

// ============================================
// BLOG POSTS
// ============================================
export async function getBlogPosts(lang?: string): Promise<BlogPost[]> {
  const url = lang ? `${API_BASE}/blog-posts?lang=${lang}` : `${API_BASE}/blog-posts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  return response.json();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_BASE}/blog-posts/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }
  return response.json();
}

// ============================================
// CONTACT
// ============================================
export async function submitContactForm(data: { name: string; email: string; message: string }): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to submit contact form");
  }
  
  return response.json();
}

// ============================================
// AUTH
// ============================================
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string | null;
  };
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to login" }));
    throw new Error(error.error || "Failed to login");
  }
  
  return response.json();
}

export async function getCurrentUser(token: string): Promise<LoginResponse["user"]> {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  
  return response.json();
}

// ============================================
// THEME
// ============================================
export interface ThemeConfig {
  primary: string; // hex
  hover: string;   // hex
}

export async function getTheme(): Promise<ThemeConfig> {
  // public endpoint
  return fetchJson<ThemeConfig>(`${API_BASE}/theme`);
}

export async function updateTheme(theme: ThemeConfig): Promise<ThemeConfig> {
  return fetchJson<ThemeConfig>(`${API_BASE}/admin/theme`, {
    method: "PUT",
    body: JSON.stringify(theme),
  });
}

// ============================================
// ADMIN - DASHBOARD
// ============================================
export interface AdminStats {
  pages: number;
  caseStudies: number;
  blogPosts: number;
  contactSubmissions: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  return fetchJson<AdminStats>(`${API_BASE}/admin/stats`);
}
