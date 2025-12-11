// Mock Data based on specification

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  client: string;
  industry: string[];
  region: string;
  year: number;
  services: string[];
  image: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  tags: string[];
}

export const services = [
  {
    id: 'brand-strategy',
    title: { en: 'Brand Strategy', ar: 'إستراتيجية العلامة' },
    description: { en: 'Building the foundation for your brand\'s growth.', ar: 'بناء الأساس لنمو علامتك التجارية.' },
    icon: 'Target'
  },
  {
    id: 'packaging',
    title: { en: 'Packaging', ar: 'تصميم العبوات' },
    description: { en: 'Shelf-stopping designs that tell your story.', ar: 'تصاميم جذابة تحكي قصة منتجك.' },
    icon: 'Package'
  },
  {
    id: 'brand-design',
    title: { en: 'Brand Design', ar: 'تصميم الهوية' },
    description: { en: 'Visual identities that resonate and remember.', ar: 'هويات بصرية تبقى في الذاكرة.' },
    icon: 'PenTool'
  },
  {
    id: 'advertising',
    title: { en: 'Advertising', ar: 'الإعلانات' },
    description: { en: 'Campaigns that drive action and emotion.', ar: 'حملات إعلانية تحرك المشاعر والأفعال.' },
    icon: 'Megaphone'
  },
  {
    id: 'digital-marketing',
    title: { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
    description: { en: 'Data-driven growth across all channels.', ar: 'نمو مدفوع بالبيانات عبر جميع القنوات.' },
    icon: 'BarChart'
  },
  {
    id: 'web',
    title: { en: 'Web Design', ar: 'تصميم المواقع' },
    description: { en: 'Digital experiences that convert.', ar: 'تجارب رقمية تحقق النتائج.' },
    icon: 'Monitor'
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs_1',
    slug: 'crioro-packaging',
    title: 'Crioro — Packaging Refresh',
    summary: 'Premium relaunch for F&B Confectionery brand.',
    client: 'Crioro',
    industry: ['F&B', 'Confectionery'],
    region: 'MENA',
    year: 2025,
    services: ['Packaging', 'Brand Design'],
    image: 'https://images.unsplash.com/photo-1636819488524-1f019c4e1c44?q=80&w=1000&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'cs_2',
    slug: 'vertex-tech',
    title: 'Vertex — Brand Identity',
    summary: 'Modern tech identity for a SaaS unicorn.',
    client: 'Vertex',
    industry: ['Technology', 'SaaS'],
    region: 'Global',
    year: 2024,
    services: ['Brand Strategy', 'Brand Design'],
    image: 'https://images.unsplash.com/photo-1550963393-27137f68c37d?q=80&w=1000&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'cs_3',
    slug: 'elixir-wellness',
    title: 'Elixir — Digital Experience',
    summary: 'Holistic wellness platform web design.',
    client: 'Elixir',
    industry: ['Wellness', 'Healthcare'],
    region: 'KSA',
    year: 2024,
    services: ['Web', 'UI/UX'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    featured: true
  },
  {
    id: 'cs_4',
    slug: 'urban-eats',
    title: 'Urban Eats — Campaign',
    summary: 'Launch campaign for a new delivery service.',
    client: 'Urban Eats',
    industry: ['F&B', 'Logistics'],
    region: 'UAE',
    year: 2025,
    services: ['Advertising', 'Social Media'],
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
    featured: false
  },
  {
    id: 'cs_5',
    slug: 'lux-interiors',
    title: 'Lux — Catalog Design',
    summary: 'Elegant print design for luxury furniture.',
    client: 'Lux',
    industry: ['Retail', 'Furniture'],
    region: 'Europe',
    year: 2023,
    services: ['Print', 'Brand Design'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop',
    featured: true
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'post_1',
    slug: 'design-systems-2025',
    title: 'The Future of Design Systems in 2025',
    summary: 'How AI and automation are shaping the way we build interfaces.',
    date: 'Dec 10, 2025',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    tags: ['Design', 'Tech']
  },
  {
    id: 'post_2',
    slug: 'packaging-sustainability',
    title: 'Sustainable Packaging Trends',
    summary: 'Eco-friendly materials that don\'t compromise on luxury.',
    date: 'Nov 28, 2025',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
    tags: ['Packaging', 'Sustainability']
  },
  {
    id: 'post_3',
    slug: 'brand-storytelling',
    title: 'The Art of Brand Storytelling',
    summary: 'Why narrative matters more than ever in a crowded market.',
    date: 'Nov 15, 2025',
    image: 'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1000&auto=format&fit=crop',
    tags: ['Branding', 'Strategy']
  }
];
