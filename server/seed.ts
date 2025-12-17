import { storage } from "./storage";
import type { InsertCaseStudy, InsertBlogPost, InsertPage, InsertUser } from "@shared/schema";
import { isDbReady } from "./db";
import { hashPassword } from "./password";

async function seed() {
  console.log("🌱 Seeding database...");

  if (!isDbReady()) {
    console.log("⏭️  Database not connected. Set DATABASE_URL or POSTGRES_URL then run db:push and db:seed.");
    process.exit(0);
  }

  // Seed Admin User
  const adminUser: InsertUser = {
    email: "admin@eibs.com",
    password: await hashPassword("admin"),
    name: "Admin User",
    role: "admin",
    avatar: null,
    lastLogin: null,
  };

  try {
    const existingAdmin = await storage.getUserByEmail(adminUser.email);
    if (!existingAdmin) {
      await storage.createUser(adminUser);
      console.log(`✅ Created admin user: ${adminUser.email} (password: admin)`);
    } else {
      console.log(`⏭️  Admin user already exists: ${adminUser.email}`);
    }
  } catch (err) {
    console.error("❌ Failed to seed admin user:", err);
    throw err;
  }

  // Seed Case Studies
  const caseStudiesData: InsertCaseStudy[] = [
    {
      slug: "crioro-packaging",
      lang: "en",
      title: "Crioro — Packaging Refresh",
      summary: "Premium relaunch for F&B Confectionery brand.",
      client: "Crioro",
      industry: ["F&B", "Confectionery"],
      region: "MENA",
      year: 2025,
      services: ["Packaging", "Brand Design"],
      deliverables: ["Rigid box", "Foil", "Guideline"],
      timeline: "2025-Q1",
      links: { website: "https://crioro.com", social: [] },
      coverImage: "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
      ],
      videos: [],
      models3d: [],
      beforeAfter: {},
      challenge: "Crioro needed to reposition their premium chocolate brand in a competitive market.",
      strategy: "We developed a luxury packaging system that emphasizes craftsmanship and quality.",
      solutionBrand: "Created a refined visual identity that speaks to sophisticated consumers.",
      solutionPackaging: "Designed elegant rigid boxes with gold foil accents and premium materials.",
      solutionSocialVideo: "",
      solutionWeb: "",
      solution3d: "3D mockups for product visualization.",
      execution: "Worked closely with packaging manufacturers to ensure quality production.",
      impactKpis: [
        { kpi: "Sales Growth", value: 42, unit: "%" },
        { kpi: "Brand Recognition", value: 65, unit: "%" },
      ],
      featured: true,
      seoTitle: "Crioro Packaging Redesign Case Study",
      seoDescription: "How we helped Crioro relaunch their premium confectionery brand with elegant packaging.",
      ogImage: "https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=1000&auto=format&fit=crop",
      createdBy: null,
    },
    {
      slug: "vertex-tech",
      lang: "en",
      title: "Vertex — Brand Identity",
      summary: "Modern tech identity for a SaaS unicorn.",
      client: "Vertex",
      industry: ["Technology", "SaaS"],
      region: "Global",
      year: 2024,
      services: ["Brand Strategy", "Brand Design"],
      deliverables: ["Logo", "Brand Guidelines", "Marketing Materials"],
      timeline: "2024-Q3",
      links: { website: "https://vertex.tech", social: [] },
      coverImage: "https://images.unsplash.com/photo-1550963393-27137f68c37d?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1550963393-27137f68c37d?q=80&w=1000&auto=format&fit=crop",
      ],
      videos: [],
      models3d: [],
      beforeAfter: {},
      challenge: "Vertex needed a brand that would appeal to enterprise clients while maintaining a modern, innovative edge.",
      strategy: "Developed a brand strategy focused on trust, innovation, and scalability.",
      solutionBrand: "Created a bold, geometric visual identity with a tech-forward color palette.",
      solutionPackaging: "",
      solutionSocialVideo: "",
      solutionWeb: "Designed a comprehensive website that showcases the platform.",
      solution3d: "",
      execution: "Rolled out the new brand across all touchpoints within 3 months.",
      impactKpis: [
        { kpi: "Enterprise Leads", value: 120, unit: "%" },
        { kpi: "Brand Recall", value: 78, unit: "%" },
      ],
      featured: true,
      seoTitle: "Vertex Brand Identity Case Study",
      seoDescription: "Building a modern SaaS brand for the enterprise market.",
      ogImage: "https://images.unsplash.com/photo-1550963393-27137f68c37d?q=80&w=1000&auto=format&fit=crop",
      createdBy: null,
    },
    {
      slug: "elixir-wellness",
      lang: "en",
      title: "Elixir — Digital Experience",
      summary: "Holistic wellness platform web design.",
      client: "Elixir",
      industry: ["Wellness", "Healthcare"],
      region: "KSA",
      year: 2024,
      services: ["Web", "UI/UX"],
      deliverables: ["Website", "Mobile App"],
      timeline: "2024-Q2",
      links: { website: "https://elixir-wellness.com", social: [] },
      coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
      ],
      videos: [],
      models3d: [],
      beforeAfter: {},
      challenge: "Creating a digital platform that feels both professional and approachable for wellness services.",
      strategy: "User-centered design focused on ease of booking and clear service information.",
      solutionBrand: "",
      solutionPackaging: "",
      solutionSocialVideo: "",
      solutionWeb: "Designed a calming, intuitive web experience with seamless booking flow.",
      solution3d: "",
      execution: "Built with modern web technologies for optimal performance.",
      impactKpis: [
        { kpi: "Online Bookings", value: 89, unit: "%" },
        { kpi: "User Satisfaction", value: 92, unit: "%" },
      ],
      featured: true,
      seoTitle: "Elixir Wellness Digital Platform Case Study",
      seoDescription: "Designing a user-friendly wellness platform for modern consumers.",
      ogImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
      createdBy: null,
    },
  ];

  for (const caseStudy of caseStudiesData) {
    const existing = await storage.getCaseStudyBySlug(caseStudy.slug);
    if (!existing) {
      await storage.createCaseStudy(caseStudy);
      console.log(`✅ Created case study: ${caseStudy.title}`);
    } else {
      console.log(`⏭️  Case study already exists: ${caseStudy.title}`);
    }
  }

  // Seed Blog Posts
  const blogPostsData: InsertBlogPost[] = [
    {
      slug: "design-systems-2025",
      lang: "en",
      title: "The Future of Design Systems in 2025",
      summary: "How AI and automation are shaping the way we build interfaces.",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
      body: "<p>Design systems are evolving rapidly. In 2025, we're seeing AI-powered tools that can generate components, maintain consistency, and even suggest improvements based on user behavior.</p><p>This transformation is reshaping how design teams work, making them more efficient while maintaining high-quality outputs.</p>",
      tags: ["Design", "Tech", "AI"],
      status: "published",
      scheduledAt: null,
      seoTitle: "The Future of Design Systems in 2025",
      seoDescription: "Exploring how AI and automation are transforming design systems.",
      createdBy: null,
      publishedAt: new Date("2024-12-10"),
    },
    {
      slug: "packaging-sustainability",
      lang: "en",
      title: "Sustainable Packaging Trends",
      summary: "Eco-friendly materials that don't compromise on luxury.",
      coverImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
      body: "<p>The packaging industry is undergoing a green revolution. Brands are discovering that sustainable materials can be just as luxurious as traditional options.</p><p>From biodegradable plastics to recycled papers with unique textures, the possibilities are endless.</p>",
      tags: ["Packaging", "Sustainability"],
      status: "published",
      scheduledAt: null,
      seoTitle: "Sustainable Packaging Trends 2025",
      seoDescription: "How eco-friendly packaging is reshaping the luxury market.",
      createdBy: null,
      publishedAt: new Date("2024-11-28"),
    },
    {
      slug: "brand-storytelling",
      lang: "en",
      title: "The Art of Brand Storytelling",
      summary: "Why narrative matters more than ever in a crowded market.",
      coverImage: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1000&auto=format&fit=crop",
      body: "<p>In today's saturated market, brands need more than just good products. They need compelling stories that resonate with their audience.</p><p>Great brand storytelling creates emotional connections that drive loyalty and advocacy.</p>",
      tags: ["Branding", "Strategy"],
      status: "published",
      scheduledAt: null,
      seoTitle: "The Art of Brand Storytelling",
      seoDescription: "Why narrative-driven branding is the future.",
      createdBy: null,
      publishedAt: new Date("2024-11-15"),
    },
  ];

  for (const post of blogPostsData) {
    const existing = await storage.getBlogPostBySlug(post.slug);
    if (!existing) {
      await storage.createBlogPost(post);
      console.log(`✅ Created blog post: ${post.title}`);
    } else {
      console.log(`⏭️  Blog post already exists: ${post.title}`);
    }
  }

  // Seed Pages
  const pagesData: InsertPage[] = [
    {
      slug: "about",
      lang: "en",
      title: "About",
      content: [{}],
      status: "published",
      seoTitle: "About",
      seoDescription: "About page",
      createdBy: null,
    },
    {
      slug: "privacy",
      lang: "en",
      title: "Privacy Policy",
      content: [{}],
      status: "published",
      seoTitle: "Privacy Policy",
      seoDescription: "Privacy policy page",
      createdBy: null,
    },
  ];

  for (const page of pagesData) {
    const existing = await storage.getPageBySlug(page.slug);
    if (!existing) {
      await storage.createPage(page);
      console.log(`✅ Created page: ${page.title}`);
    } else {
      console.log(`⏭️  Page already exists: ${page.title}`);
    }
  }

  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
