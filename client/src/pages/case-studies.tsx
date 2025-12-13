import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { ArrowUpRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getCaseStudies } from '@/lib/api';

export default function CaseStudies() {
  const { t, language } = useI18n();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ['case-studies', language],
    queryFn: () => getCaseStudies(language),
  });
  
  const industries = ['All', ...Array.from(new Set(caseStudies.flatMap(c => c.industry)))];

  const filteredCases = activeFilter === 'All' 
    ? caseStudies 
    : caseStudies.filter(c => c.industry.includes(activeFilter));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading case studies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Filter Bar */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur border-b py-4">
        <div className="container-custom flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
          <div className="flex items-center gap-8 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
             <span className="font-bold text-lg whitespace-nowrap" data-testid="text-count">{filteredCases.length} {t('nav.case_studies')}</span>
             <div className="h-6 w-px bg-border hidden lg:block" />
             <div className="flex gap-2">
               {industries.map(industry => (
                 <Button 
                   key={industry}
                   variant={activeFilter === industry ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => setActiveFilter(industry)}
                   className={`rounded-full ${activeFilter === industry ? 'bg-primary text-white border-primary' : 'border-border'}`}
                   data-testid={`button-filter-${industry}`}
                 >
                   {industry}
                 </Button>
               ))}
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative w-full lg:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input placeholder="Search projects..." className="pl-9 rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary" data-testid="input-search" />
             </div>
             <Select>
                <SelectTrigger className="w-[140px] rounded-full" data-testid="select-sort">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-custom py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
           <AnimatePresence>
             {filteredCases.map((item) => (
               <motion.div
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.3 }}
                 key={item.id}
                 className="break-inside-avoid"
               >
                <Link href={`/case/${item.slug}`} className="group block" data-testid={`card-case-${item.id}`}>
                    <div className="relative rounded-2xl overflow-hidden mb-4 bg-muted">
                      <img 
                        src={item.coverImage} 
                        alt={item.title} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white text-primary font-bold px-6 py-3 rounded-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          {t('cta.view_case')}
                        </span>
                      </div>
                       
                       {/* Badges */}
                       <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                         {item.services.slice(0, 2).map(s => (
                           <span key={s} className="bg-white/90 backdrop-blur text-black text-xs font-bold px-2 py-1 rounded-md" data-testid={`text-service-${s}`}>
                             {s}
                           </span>
                         ))}
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors flex items-center gap-2" data-testid={`text-title-${item.id}`}>
                          {item.title}
                          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-primary" />
                        </h3>
                        <div className="flex gap-3 text-sm text-muted-foreground">
                          <span data-testid={`text-client-${item.id}`}>{item.client}</span>
                          <span>•</span>
                          <span data-testid={`text-year-${item.id}`}>{item.year}</span>
                          <span>•</span>
                          <span data-testid={`text-region-${item.id}`}>{item.region}</span>
                        </div>
                      </div>
                    </div>
                </Link>
               </motion.div>
             ))}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
