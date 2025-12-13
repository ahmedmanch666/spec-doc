import React from 'react';
import { Link, useLocation } from 'wouter';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, FileText, Briefcase, PenTool, Image as ImageIcon, 
  MessageSquare, Palette, Type, Grid, Users, Settings, Bell, Search, LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { direction } = useI18n();
  const [location] = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: FileText, label: 'Pages', href: '/admin/pages' },
    { icon: Briefcase, label: 'Portfolio', href: '/admin/portfolio' },
    { icon: PenTool, label: 'Blog', href: '/admin/blog' },
    { icon: ImageIcon, label: 'Media', href: '/admin/media' },
    { icon: MessageSquare, label: 'Forms', href: '/admin/forms' },
    { icon: Palette, label: 'Theme', href: '/admin/theme' },
    { icon: Type, label: 'Typography', href: '/admin/typography' },
    { icon: Grid, label: 'Widgets', href: '/admin/widgets' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-muted/20" dir={direction}>
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter text-primary">EIBS CMS</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location === item.href ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t">
          <Link href="/admin/login">
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${direction === 'rtl' ? 'mr-64' : 'ml-64'}`}>
        {/* Topbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <span className="font-medium text-foreground">Dashboard</span>
             <span>/</span>
             <span>Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary" />
            </div>
            
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@eibs.com</p>
              </div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
