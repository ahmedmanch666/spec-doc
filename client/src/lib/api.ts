import type { CaseStudy, BlogPost } from "@shared/schema";

const API_URL = "/api";

// ============================================
// CASE STUDIES
// ============================================
export async function getCaseStudies(lang?: string): Promise<CaseStudy[]> {
  const url = lang ? `${API_URL}/case-studies?lang=${lang}` : `${API_URL}/case-studies`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch case studies");
  }
  return response.json();
}

export async function getFeaturedCaseStudies(lang?: string): Promise<CaseStudy[]> {
  const url = lang ? `${API_URL}/case-studies/featured?lang=${lang}` : `${API_URL}/case-studies/featured`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch featured case studies");
  }
  return response.json();
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
  const response = await fetch(`${API_URL}/case-studies/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch case study");
  }
  return response.json();
}

// ============================================
// BLOG POSTS
// ============================================
export async function getBlogPosts(lang?: string): Promise<BlogPost[]> {
  const url = lang ? `${API_URL}/blog-posts?lang=${lang}` : `${API_URL}/blog-posts`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts");
  }
  return response.json();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(`${API_URL}/blog-posts/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch blog post");
  }
  return response.json();
}

// ============================================
// CONTACT
// ============================================
export async function submitContactForm(data: { name: string; email: string; message: string }): Promise<{ success: boolean; id: string }> {
  const response = await fetch(`${API_URL}/contact`, {
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
