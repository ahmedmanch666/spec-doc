import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface I18nContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.about': { en: 'About', ar: 'من نحن' },
  'nav.brand_strategy': { en: 'Brand Strategy', ar: 'إستراتيجية العلامة' },
  'nav.packaging': { en: 'Packaging', ar: 'تصميم العبوات' },
  'nav.brand_design': { en: 'Brand Design', ar: 'تصميم الهوية' },
  'nav.advertising': { en: 'Advertising', ar: 'الإعلانات' },
  'nav.digital_marketing': { en: 'Digital Marketing', ar: 'التسويق الرقمي' },
  'nav.web': { en: 'Web', ar: 'تصميم المواقع' },
  'nav.case_studies': { en: 'Case Studies', ar: 'دراسات الحالة' },
  'nav.blog': { en: 'Blog', ar: 'المدونة' },
  'nav.contact': { en: 'Contact', ar: 'تواصل معنا' },
  
  // CTAs
  'cta.login': { en: 'Log in', ar: 'تسجيل الدخول' },
  'cta.lets_talk': { en: 'Let’s Talk', ar: 'تحدث معنا' },
  'cta.view_case': { en: 'View Case', ar: 'شاهد الحالة' },
  'cta.view_all': { en: 'View All', ar: 'عرض الكل' },
  'cta.read_more': { en: 'Read More', ar: 'اقرأ المزيد' },
  'cta.submit': { en: 'Submit', ar: 'إرسال' },
  'cta.sending': { en: 'Sending...', ar: 'جاري الإرسال...' },
  'cta.success': { en: 'Message Sent', ar: 'تم الإرسال' },

  // Sections
  'section.featured_work': { en: 'Featured Work', ar: 'أعمال مميزة' },
  'section.latest_insights': { en: 'Latest Insights', ar: 'أحدث المقالات' },
  'section.services': { en: 'Our Services', ar: 'خدماتنا' },
  
  // Footer
  'footer.rights': { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  
  // Form
  'form.name': { en: 'Name', ar: 'الاسم' },
  'form.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'form.message': { en: 'Message', ar: 'الرسالة' },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <I18nContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
