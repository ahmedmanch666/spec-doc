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

// Placeholder components for other pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="container-custom py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
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
      <Route path="/admin/:rest*">
         <AdminLayout>
           <Switch>
             <Route path="/admin/dashboard" component={Dashboard} />
             <Route path="/admin/:any">
               {(params) => <PlaceholderPage title={`Admin: ${params.any}`} />}
             </Route>
           </Switch>
         </AdminLayout>
      </Route>

      {/* Main Routes - With Layout */}
      <Route path="/:rest*">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about">
              <PlaceholderPage title="About Us" />
            </Route>
            <Route path="/brand-strategy">
              <PlaceholderPage title="Brand Strategy" />
            </Route>
            <Route path="/packaging">
              <PlaceholderPage title="Packaging" />
            </Route>
            <Route path="/brand-design">
              <PlaceholderPage title="Brand Design" />
            </Route>
            <Route path="/advertising">
              <PlaceholderPage title="Advertising" />
            </Route>
            <Route path="/digital-marketing">
              <PlaceholderPage title="Digital Marketing" />
            </Route>
            <Route path="/web">
              <PlaceholderPage title="Web Design" />
            </Route>
            
            <Route path="/case-studies" component={CaseStudies} />
            
            <Route path="/blog">
              <PlaceholderPage title="Blog" />
            </Route>
            
            <Route path="/contact" component={Contact} />
            
            {/* Dynamic Routes */}
            <Route path="/case/:slug">
              {(params) => <PlaceholderPage title={`Case Study: ${params.slug}`} />}
            </Route>
            <Route path="/post/:slug">
              {(params) => <PlaceholderPage title={`Blog Post: ${params.slug}`} />}
            </Route>
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
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
