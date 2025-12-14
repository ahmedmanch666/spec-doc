import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { AdminLayout } from "@/components/admin-layout";
import Home from "@/pages/home";
import CaseStudies from "@/pages/case-studies";
import Contact from "@/pages/contact";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";
import ThemePanel from "@/pages/admin/theme";
import TypographyPanel from "@/pages/admin/typography";
import WidgetsLibrary from "@/pages/admin/widgets";
import PagesAdmin from "@/pages/admin/pages";
import PortfolioAdmin from "@/pages/admin/portfolio";
import BlogAdmin from "@/pages/admin/blog";
import MediaAdmin from "@/pages/admin/media";
import FormsAdmin from "@/pages/admin/forms";
import UsersAdmin from "@/pages/admin/users";
import SettingsAdmin from "@/pages/admin/settings";
import PortfolioEdit from "@/pages/admin/portfolio-edit";
import BlogEdit from "@/pages/admin/blog-edit";
import PagesEdit from "@/pages/admin/pages-edit";

// Placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-4xl font-bold mb-4" style={{ color: '#111111' }}>{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This page is under construction as part of the prototype.
    </p>
  </div>
);

function Router() {
  return (
    <Switch>
      {/* Auth Routes - No Layout */}
      <Route path="/admin/login" component={Login} />
      
      {/* Admin Routes - Admin Layout */}
      <Route path="/admin">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/dashboard">
        <AdminLayout>
          <Dashboard />
        </AdminLayout>
      </Route>
      <Route path="/admin/pages/:id" component={(props: any) => (
        <AdminLayout>
          <PagesEdit {...props} />
        </AdminLayout>
      )} />
      <Route path="/admin/portfolio/:id" component={(props: any) => (
        <AdminLayout>
          <PortfolioEdit {...props} />
        </AdminLayout>
      )} />
      <Route path="/admin/blog/:id" component={(props: any) => (
        <AdminLayout>
          <BlogEdit {...props} />
        </AdminLayout>
      )} />
      <Route path="/admin/pages">
        <AdminLayout>
          <PagesAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/portfolio">
        <AdminLayout>
          <PortfolioAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/blog">
        <AdminLayout>
          <BlogAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/media">
        <AdminLayout>
          <MediaAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/forms">
        <AdminLayout>
          <FormsAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/theme">
        <AdminLayout>
          <ThemePanel />
        </AdminLayout>
      </Route>
      <Route path="/admin/typography">
        <AdminLayout>
          <TypographyPanel />
        </AdminLayout>
      </Route>
      <Route path="/admin/widgets">
        <AdminLayout>
          <WidgetsLibrary />
        </AdminLayout>
      </Route>
      <Route path="/admin/users">
        <AdminLayout>
          <UsersAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout>
          <SettingsAdmin />
        </AdminLayout>
      </Route>
      <Route path="/admin/:rest*">
        {(params) => (
          <AdminLayout>
            <PlaceholderPage title={`Admin: ${(params as any)["rest*"] ?? ""}`} />
          </AdminLayout>
        )}
      </Route>

      {/* Main Routes - With Layout */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/about">
        <Layout><PlaceholderPage title="About Us" /></Layout>
      </Route>
      <Route path="/brand-strategy">
        <Layout><PlaceholderPage title="Brand Strategy" /></Layout>
      </Route>
      <Route path="/packaging">
        <Layout><PlaceholderPage title="Packaging" /></Layout>
      </Route>
      <Route path="/brand-design">
        <Layout><PlaceholderPage title="Brand Design" /></Layout>
      </Route>
      <Route path="/advertising">
        <Layout><PlaceholderPage title="Advertising" /></Layout>
      </Route>
      <Route path="/digital-marketing">
        <Layout><PlaceholderPage title="Digital Marketing" /></Layout>
      </Route>
      <Route path="/web">
        <Layout><PlaceholderPage title="Web Design" /></Layout>
      </Route>
      
      <Route path="/case-studies">
        <Layout><CaseStudies /></Layout>
      </Route>
      
      <Route path="/blog">
        <Layout><PlaceholderPage title="Blog" /></Layout>
      </Route>
      
      <Route path="/contact">
        <Layout><Contact /></Layout>
      </Route>
      
      {/* Dynamic Routes */}
      <Route path="/case/:slug">
        {(params) => <Layout><PlaceholderPage title={`Case Study: ${params.slug}`} /></Layout>}
      </Route>
      <Route path="/post/:slug">
        {(params) => <Layout><PlaceholderPage title={`Blog Post: ${params.slug}`} /></Layout>}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <Toaster />
          <Router />
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
