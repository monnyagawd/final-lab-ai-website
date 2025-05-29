import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Loader2, Plus, Code, Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface TrackedWebsite {
  id: number;
  userId: number;
  domain: string;
  name: string;
  trackingId: string;
  isActive: boolean;
  createdAt: string;
}

export default function WebsiteTracking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newWebsite, setNewWebsite] = useState({ name: "", domain: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<TrackedWebsite | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch all tracked websites
  const { data: websites, isLoading, error } = useQuery({
    queryKey: ["/api/tracked-websites"],
    enabled: !!user,
  });

  // Create new website mutation
  const createWebsiteMutation = useMutation({
    mutationFn: async (websiteData: { name: string; domain: string }) => {
      const res = await apiRequest("POST", "/api/tracked-websites", websiteData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracked-websites"] });
      setOpenDialog(false);
      setNewWebsite({ name: "", domain: "" });
      toast({
        title: "Website added successfully",
        description: "You can now integrate the tracking code to start collecting data.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding website",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWebsite.name || !newWebsite.domain) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and domain for your website.",
        variant: "destructive",
      });
      return;
    }
    
    // Clean domain input
    let domain = newWebsite.domain.trim().toLowerCase();
    
    // Add https:// if no protocol provided
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'https://' + domain;
    }
    
    // Remove trailing slash if present
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    
    createWebsiteMutation.mutate({
      name: newWebsite.name,
      domain: domain
    });
  };

  // Copy tracking code to clipboard
  const copyTrackingCode = (trackingId: string) => {
    const code = `<script src="${window.location.origin}/tracking.js?siteId=${trackingId}" async></script>`;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Tracking code copied",
        description: "Paste this code in your website's HTML, just before the closing </body> tag.",
      });
    });
  };

  // Format domain for display
  const formatDomain = (domain: string) => {
    try {
      const url = new URL(domain);
      return url.hostname;
    } catch (e) {
      return domain;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load your tracked websites. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Website Tracking</h1>
          <p className="text-muted-foreground mt-2">
            Track visitors, page views, and events on your websites
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new website</DialogTitle>
              <DialogDescription>
                Enter your website details to start tracking analytics.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Website Name</Label>
                  <Input
                    id="name"
                    value={newWebsite.name}
                    onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                    placeholder="My Business Website"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domain">Website Domain</Label>
                  <Input
                    id="domain"
                    value={newWebsite.domain}
                    onChange={(e) => setNewWebsite({ ...newWebsite, domain: e.target.value })}
                    placeholder="https://example.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Include the full domain with protocol (e.g., https://example.com)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createWebsiteMutation.isPending}>
                  {createWebsiteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Website
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {websites && websites.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium">No websites added yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Add your first website to start collecting analytics data
          </p>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Website
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {websites && websites.map((website: TrackedWebsite) => (
            <Card key={website.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-2">
                    <CardTitle className="truncate">{website.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <a 
                        href={website.domain} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:underline text-sm truncate"
                      >
                        {formatDomain(website.domain)}
                        <ExternalLink className="h-3 w-3 ml-1 inline-flex" />
                      </a>
                    </CardDescription>
                  </div>
                  <Badge variant={website.isActive ? "default" : "secondary"}>
                    {website.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Tracking Code</TabsTrigger>
                    <TabsTrigger value="info">Information</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="py-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Insert this code in your website:</div>
                      <div className="relative">
                        <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                          <code>
                            {`<script src="${window.location.origin}/tracking.js?siteId=${website.trackingId}" async></script>`}
                          </code>
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 h-7 w-7 p-0"
                          onClick={() => copyTrackingCode(website.trackingId)}
                        >
                          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Place just before the closing <code>&lt;/body&gt;</code> tag
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="info" className="space-y-3 py-2">
                    <div>
                      <div className="text-sm font-medium mb-1">Website ID</div>
                      <div className="text-sm font-mono">{website.id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Tracking ID</div>
                      <div className="text-sm font-mono truncate">{website.trackingId}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Created</div>
                      <div className="text-sm">{new Date(website.createdAt).toLocaleString()}</div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`/website-analytics/${website.id}`}>
                    View Analytics
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12">
        <Separator className="mb-6" />
        <h2 className="text-xl font-bold mb-4">Integration Guide</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Add your website</h3>
            <p className="text-muted-foreground">
              Click "Add Website" and enter your website's name and domain.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Copy the tracking code</h3>
            <p className="text-muted-foreground">
              Copy the generated tracking script and add it to your website's HTML just before the closing &lt;/body&gt; tag.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Track custom events (optional)</h3>
            <p className="text-muted-foreground mb-3">
              You can track specific user interactions by adding custom event tracking:
            </p>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
              <code>
{`// Example: Track button click
document.getElementById('signup-button').addEventListener('click', function() {
  window.labAIAnalytics.trackEvent('button_click', { 
    buttonId: 'signup-button',
    buttonText: 'Sign Up',
    page: window.location.pathname
  });
});

// Example: Track form submission
document.getElementById('contact-form').addEventListener('submit', function() {
  window.labAIAnalytics.trackEvent('form_submit', { 
    formId: 'contact-form',
    page: window.location.pathname
  });
});`}
              </code>
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">4. View your analytics</h3>
            <p className="text-muted-foreground">
              Once the tracking code is installed, data will start being collected. 
              Visit the analytics dashboard to see page views, visitor information, and custom events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}