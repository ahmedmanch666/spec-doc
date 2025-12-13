import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { t, language, setLanguage, direction } = useI18n();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
      setLocation('/admin/dashboard'); 
    }, 1500);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" dir={direction}>
      {/* Top Bar */}
      <div className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter text-primary">EIBS</div>
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
          <Globe className="h-4 w-4" />
          {language === 'en' ? 'AR' : 'EN'}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-bold tracking-tight text-foreground">
               {language === 'en' ? 'Welcome back' : 'مرحباً بعودتك'}
             </h1>
             <p className="text-muted-foreground">
               {language === 'en' ? 'Enter your credentials to access the dashboard' : 'أدخل بياناتك للدخول إلى لوحة التحكم'}
             </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="email">{t('form.email')}</Label>
                 <Input id="email" type="email" placeholder="name@eibs.com" required className="h-11" />
               </div>
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <Label htmlFor="password">Password</Label>
                   <a href="#" className="text-xs font-medium text-primary hover:underline">
                     Forgot password?
                   </a>
                 </div>
                 <Input id="password" type="password" required className="h-11" />
               </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me for 30 days</Label>
            </div>
            
            <Button type="submit" className="w-full h-11 bg-primary text-white hover:bg-primary/90 font-bold" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('cta.login')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
