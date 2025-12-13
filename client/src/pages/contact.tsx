import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { submitContactForm } from '@/lib/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast({
        title: t('cta.success'),
        description: "We'll get back to you shortly.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="py-24">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Info */}
        <div className="space-y-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {language === 'en' ? "Let's Talk" : 'تحدث معنا'}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {language === 'en' 
                ? "Have a project in mind? We would love to hear from you. Send us a message and we will get back to you as soon as possible."
                : 'هل لديك مشروع في ذهنك؟ نود أن نسمع منك. أرسل لنا رسالة وسنعود إليك في أقرب وقت ممكن.'}
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Email Us</h3>
                <a href="mailto:hello@eibs.com" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-email">hello@eibs.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Call Us</h3>
                <a href="tel:+966500000000" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-phone">+966 50 000 0000</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Visit Us</h3>
                <p className="text-muted-foreground">Riyadh, Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card border p-8 md:p-12 rounded-3xl shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} className="h-12" data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} className="h-12" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form.message')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your project..." {...field} className="min-h-[150px] resize-none" data-testid="input-message" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={mutation.isPending}
                data-testid="button-submit"
              >
                {mutation.isPending ? t('cta.sending') : t('cta.submit')}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
