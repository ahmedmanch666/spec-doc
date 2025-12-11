import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, PenTool, ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const stats = [
    { title: 'Total Pages', value: '12', icon: FileText, change: '+2 this week' },
    { title: 'Case Studies', value: '24', icon: Briefcase, change: '+1 this week' },
    { title: 'Blog Posts', value: '8', icon: PenTool, change: '+3 this month' },
    { title: 'Media Items', value: '142', icon: ImageIcon, change: '+12 this week' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex gap-2">
           <Button className="bg-primary text-white hover:bg-primary/90 gap-2">
             <Plus className="h-4 w-4" /> New Project
           </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Updated "Brand Strategy" Page
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Admin User • 2 hours ago
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-primary">Edit</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <Button variant="outline" className="w-full justify-start gap-2 h-12">
               <FileText className="h-4 w-4" /> Create New Page
             </Button>
             <Button variant="outline" className="w-full justify-start gap-2 h-12">
               <Briefcase className="h-4 w-4" /> Add Portfolio Item
             </Button>
             <Button variant="outline" className="w-full justify-start gap-2 h-12">
               <PenTool className="h-4 w-4" /> Write Blog Post
             </Button>
             <Button variant="outline" className="w-full justify-start gap-2 h-12">
               <ImageIcon className="h-4 w-4" /> Upload Media
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
