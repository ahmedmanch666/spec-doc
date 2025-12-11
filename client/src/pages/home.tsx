import React from 'react';
import { useI18n } from '@/lib/i18n';
import { services, caseStudies, blogPosts } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowUpRight, Megaphone, Monitor, Package, PenTool, Target, BarChart } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
  Target,
  Package,
  PenTool,
  Megaphone,
  BarChart,
  Monitor
};

export default function Home() {
  const { t, language, direction } = useI18n();

  const isRtl = direction === 'rtl';

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground">
              {language === 'en' ? (
                <>
                  Building Brands <br />
                  <span className="text-primary relative inline-block">
                    That Matter
                    <svg className="absolute w-full h-3 bottom-0 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                       <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  نبني علامات <br />
                  <span className="text-primary relative inline-block">
                    لها أثر
                    <svg className="absolute w-full h-3 bottom-0 left-0 text-primary/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                       <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
              {language === 'en' 
                ? 'We are a strategic branding and design agency helping ambitious companies define their voice and visualize their future.'
                : 'نحن وكالة استراتيجية وتصميم نساعد الشركات الطموحة على تحديد صوتها وتصور مستقبلها.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8 text-lg font-bold h-14 bg-primary text-white hover:bg-primary/90">
                  {t('cta.lets_talk')}
                </Button>
              </Link>
              <Link href="/case-studies">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-lg font-bold h-14 border-2 border-primary text-primary hover:bg-primary hover:text-white">
                  {t('cta.view_case')}
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
             <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-muted relative">
                <img 
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" 
                  alt="Hero Image" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container-custom">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-3xl md:text-4xl font-bold">{t('section.services')}</h2>
           <Link href="/contact">
             <a className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
               {t('cta.view_all')} {isRtl ? <ArrowRight className="rotate-180" /> : <ArrowRight />}
             </a>
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <Link key={service.id} href={`/${service.id}`}>
                <a className="group">
                  <Card className="h-full border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        {Icon && <Icon className="w-6 h-6" />}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {language === 'en' ? service.title.en : service.title.ar}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {language === 'en' ? service.description.en : service.description.ar}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Portfolio Strip */}
      <section className="w-full overflow-hidden bg-muted/30 py-24">
        <div className="container-custom mb-12 flex justify-between items-center">
          <h2 className="text-3xl md:text-4xl font-bold">{t('section.featured_work')}</h2>
           <Link href="/case-studies">
             <Button variant="link" className="text-primary font-bold text-lg p-0 h-auto">
               {t('cta.view_all')}
             </Button>
           </Link>
        </div>
        
        <div className="container-custom">
           <div className="flex gap-8 overflow-x-auto pb-8 snap-x scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              {caseStudies.map((item) => (
                <Link key={item.id} href={`/case/${item.slug}`}>
                  <a className="min-w-[300px] md:min-w-[400px] snap-center group">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative shadow-md">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div>
                      <div className="flex gap-2 mb-3">
                         {item.services.slice(0, 2).map(s => (
                           <span key={s} className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded-md">
                             {s}
                           </span>
                         ))}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                        {item.title}
                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                      </h3>
                      <p className="text-muted-foreground">{item.summary}</p>
                    </div>
                  </a>
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="container-custom">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-3xl md:text-4xl font-bold">{t('section.latest_insights')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {blogPosts.map((post) => (
             <Link key={post.id} href={`/post/${post.slug}`}>
               <a className="group">
                 <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                     <span>{post.date}</span>
                     <span className="w-1 h-1 rounded-full bg-primary" />
                     <span className="text-primary">{post.tags[0]}</span>
                   </div>
                   <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                     {post.title}
                   </h3>
                   <p className="text-muted-foreground line-clamp-2">
                     {post.summary}
                   </p>
                 </div>
               </a>
             </Link>
           ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-custom">
        <div className="bg-primary rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              {language === 'en' ? 'Ready to Start?' : 'جاهز للبدء؟'}
            </h2>
            <p className="text-white/80 text-xl leading-relaxed">
              {language === 'en' 
                ? "Let's build something extraordinary together. Reach out to discuss your next project."
                : "دعنا نبني شيئاً استثنائياً معاً. تواصل معنا لمناقشة مشروعك القادم."}
            </p>
            <Link href="/contact">
              <Button size="lg" className="h-14 px-10 rounded-full bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                {t('cta.lets_talk')}
              </Button>
            </Link>
          </div>
          
          {/* Abstract circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
      </section>
    </div>
  );
}
