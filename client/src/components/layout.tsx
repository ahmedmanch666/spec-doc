import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Layout({ children }: { children: React.ReactNode }) {
  const { t, language, setLanguage, direction } = useI18n();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.about', href: '/about' },
    { key: 'nav.brand_strategy', href: '/brand-strategy' },
    { key: 'nav.packaging', href: '/packaging' },
    { key: 'nav.brand_design', href: '/brand-design' },
    { key: 'nav.advertising', href: '/advertising' },
    { key: 'nav.digital_marketing', href: '/digital-marketing' },
    { key: 'nav.web', href: '/web' },
    { key: 'nav.case_studies', href: '/case-studies' },
    { key: 'nav.blog', href: '/blog' },
    { key: 'nav.contact', href: '/contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background font-sans ${language === 'ar' ? 'font-arabic' : ''}`} dir={direction}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="text-2xl font-bold tracking-tighter text-primary">EIBS</a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
            {navItems.slice(0, 6).map((item) => (
              <Link key={item.key} href={item.href}>
                <a className={`transition-colors hover:text-primary ${location === item.href ? 'text-primary border-b-2 border-primary' : 'text-foreground/80'}`}>
                  {t(item.key)}
                </a>
              </Link>
            ))}
             <Link href="/contact">
                <a className={`transition-colors hover:text-primary ${location === '/contact' ? 'text-primary border-b-2 border-primary' : 'text-foreground/80'}`}>
                  {t('nav.contact')}
                </a>
              </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'AR' : 'EN'}
            </Button>
            <Link href="/admin/login">
              <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-6">
                {t('cta.login')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side={direction === 'rtl' ? 'right' : 'left'} className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/">
                  <a className="text-2xl font-bold text-primary mb-4" onClick={() => setIsMobileMenuOpen(false)}>EIBS</a>
                </Link>
                {navItems.map((item) => (
                  <Link key={item.key} href={item.href}>
                    <a 
                      className="text-lg font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(item.key)}
                    </a>
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <Button variant="outline" onClick={toggleLanguage} className="justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'العربية' : 'English'}
                </Button>
                <Link href="/admin/login">
                  <Button className="w-full bg-primary text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('cta.login')}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 pt-16 pb-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/">
                <a className="text-3xl font-bold text-primary mb-6 block">EIBS</a>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {language === 'en' 
                  ? 'Strategic branding and design agency helping ambitious companies build world-class brands.' 
                  : 'وكالة إستراتيجية وتصميم تساعد الشركات الطموحة على بناء علامات تجارية عالمية.'}
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t('section.services')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/brand-strategy"><a className="hover:text-primary">{t('nav.brand_strategy')}</a></Link></li>
                <li><Link href="/brand-design"><a className="hover:text-primary">{t('nav.brand_design')}</a></Link></li>
                <li><Link href="/packaging"><a className="hover:text-primary">{t('nav.packaging')}</a></Link></li>
                <li><Link href="/advertising"><a className="hover:text-primary">{t('nav.advertising')}</a></Link></li>
                <li><Link href="/digital-marketing"><a className="hover:text-primary">{t('nav.digital_marketing')}</a></Link></li>
                <li><Link href="/web"><a className="hover:text-primary">{t('nav.web')}</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t('nav.about')}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about"><a className="hover:text-primary">{language === 'en' ? 'Who we are' : 'من نحن'}</a></Link></li>
                <li><Link href="/about"><a className="hover:text-primary">{language === 'en' ? 'Careers' : 'الوظائف'}</a></Link></li>
                <li><Link href="/blog"><a className="hover:text-primary">{t('nav.blog')}</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-primary">{t('nav.contact')}</a></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">{t('nav.contact')}</h4>
              <address className="not-italic text-sm text-muted-foreground space-y-3">
                <p>Hello@eibs.com</p>
                <p>+966 50 000 0000</p>
                <p>Riyadh, Saudi Arabia</p>
              </address>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 EIBS. {t('footer.rights')}</p>
            <div className="flex gap-6">
              <Link href="/privacy"><a className="hover:text-primary">Privacy Policy</a></Link>
              <Link href="/terms"><a className="hover:text-primary">Terms of Service</a></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
