import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { SocialMediaAccount } from "@shared/schema";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Share2,
  Users,
  Megaphone,
  BarChart3,
  PlusCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  TrendingUp,
  TrendingDown,
  UserRound,
  Eye,
  Music2,
  MessageCircle,
  Heart,
  MessageSquare,
  ArrowUpRight,
  DollarSign,
  BarChart,
  LineChart,
  ChevronUp,
  ChevronDown,
  Globe,
  Repeat2,
  RefreshCw,
  Image,
  Clock,
  Info as InfoIcon,
  Minus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from "recharts";
import { format, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SocialMediaDashboard() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("last-7-days");
  
  // Generate time period dependent data based on selected period
  const getMetricMultiplier = () => {
    return selectedTimePeriod === "last-7-days" ? 1 : 
           selectedTimePeriod === "last-30-days" ? 2.8 : 5.2;
  };
  
  const getMetricByTimePeriod = (baseValue: number, modifierPercentage?: number) => {
    const multiplier = getMetricMultiplier();
    const modifier = modifierPercentage || 1;
    return Math.round(baseValue * multiplier * modifier);
  };
  
  const getFollowersData = () => {
    // If no growth metrics are available, return default data
    if (!growthMetrics || growthMetrics.length === 0) {
      const days = selectedTimePeriod === "last-7-days" ? 7 : 
                 selectedTimePeriod === "last-30-days" ? 30 : 90;
      
      // Use total followers from social accounts if available
      const baseFollowers = socialAccounts?.reduce(
        (total, account) => total + parseInt(account.followers || "0"), 0
      ) || 5200;
                 
      const growth = baseFollowers * 0.03 / days; // 3% growth over the period
      
      return Array.from({ length: Math.min(7, days) }, (_, i) => {
        const daysAgo = selectedTimePeriod === "last-7-days" ? 6-i : 
                       selectedTimePeriod === "last-30-days" ? Math.floor((30 / 6) * (6-i)) :
                       Math.floor((90 / 6) * (6-i));
        
        return {
          date: format(subDays(new Date(), daysAgo), "MMM d"),
          followers: Math.round(baseFollowers - (growth * daysAgo))
        };
      });
    }
    
    // Create a map to aggregate follower counts by date
    const followersByDate = new Map<string, number>();
    
    // Process all accounts' follower history
    growthMetrics.forEach(account => {
      if (account.followersHistory && account.followersHistory.length > 0) {
        account.followersHistory.forEach(entry => {
          const currentCount = followersByDate.get(entry.date) || 0;
          followersByDate.set(entry.date, currentCount + parseInt(entry.count));
        });
      }
    });
    
    // Convert the map to an array of data points sorted by date
    const result = Array.from(followersByDate.entries())
      .map(([date, followers]) => ({ 
        date: format(new Date(date), "MMM d"),
        followers 
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    
    return result;
  };

  // Get social media accounts
  const {
    data: socialAccounts,
    isLoading,
    isError,
  } = useQuery<SocialMediaAccount[]>({
    queryKey: ["/api/dashboard/social-media"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  
  // Get social media growth metrics
  const {
    data: growthMetrics,
    isLoading: isLoadingGrowth,
    isError: isErrorGrowth,
  } = useQuery({
    queryKey: ["/api/dashboard/social-media/growth"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!socialAccounts && socialAccounts.length > 0,
  });

  // Mutation to link social media account
  const linkAccountMutation = useMutation({
    mutationFn: async (data: { platform: string; accountName: string; accountId: string }) => {
      const res = await apiRequest("POST", "/api/dashboard/link-social", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/social-media"] });
      toast({
        title: "Account connected",
        description: `Your ${selectedPlatform} account has been connected successfully.`,
      });
      setOpenDialog(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Connection failed",
        description: error.message || `Could not connect your ${selectedPlatform} account.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlatform) {
      toast({
        title: "Missing platform",
        description: "Please select a social media platform.",
        variant: "destructive",
      });
      return;
    }

    linkAccountMutation.mutate({
      platform: selectedPlatform,
      accountName,
      accountId,
    });
  };

  const resetForm = () => {
    setSelectedPlatform("");
    setAccountName("");
    setAccountId("");
  };

  const formatNumberWithCommas = (numStr: string) => {
    const num = parseInt(numStr, 10);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  const platformIcons: Record<string, JSX.Element> = {
    facebook: <Facebook className="h-6 w-6" />,
    instagram: <Instagram className="h-6 w-6" />,
    twitter: <Twitter className="h-6 w-6" />,
    tiktok: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M15 8v4a4 4 0 0 1-4 4" />
      </svg>
    ),
    discord: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
        <path d="M7 16.5c3.5 1 6.5 1 10 0" />
        <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3.5V20h2v-6h-6v3Z" />
        <path d="M6.5 17c0 1-1.5 3-2 3-1.5 0-2.833-1.667-3.5-3.5V20h-2v-6h6v3Z" />
      </svg>
    ),
    youtube: <Youtube className="h-6 w-6" />,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics for all your social media accounts
        </p>
      </div>
      
      {/* Time Period Selection */}
      <div className="flex items-center justify-between space-x-2 mb-6">
        <div className="flex space-x-1">
          <Button 
            variant={selectedTimePeriod === "last-7-days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedTimePeriod("last-7-days")}
          >
            7 Days
          </Button>
          <Button 
            variant={selectedTimePeriod === "last-30-days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedTimePeriod("last-30-days")}
          >
            30 Days
          </Button>
          <Button 
            variant={selectedTimePeriod === "last-90-days" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedTimePeriod("last-90-days")}
          >
            90 Days
          </Button>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Social Media Account</DialogTitle>
              <DialogDescription>
                Link your social media accounts to track performance and audience growth.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 py-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={selectedPlatform}
                    onValueChange={setSelectedPlatform}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Social Media Platforms</SelectLabel>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter / X</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedPlatform && (
                  <div className="flex flex-col gap-4">
                    <div className="rounded-md bg-muted/50 p-4">
                      <div className="mb-3 text-sm text-muted-foreground">
                        {selectedPlatform === "facebook" && "Connect with Facebook to track followers, engagement, and more."}
                        {selectedPlatform === "instagram" && "Connect with Instagram to track followers, post performance, and reach."}
                        {selectedPlatform === "twitter" && "Connect with Twitter/X to track followers, engagement, and retweets."}
                        {selectedPlatform === "tiktok" && "Connect with TikTok to track followers, video views, and engagement."}
                        {selectedPlatform === "discord" && "Connect with Discord to track server members, active users, and engagement."}
                        {selectedPlatform === "youtube" && "Connect with YouTube to track subscribers, video views, and watch time."}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          type="button" 
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            if (selectedPlatform === "facebook") {
                              window.location.href = "/auth/facebook";
                            } else if (selectedPlatform === "twitter") {
                              window.location.href = "/auth/twitter";
                            } else if (selectedPlatform === "youtube") {
                              window.location.href = "/auth/google";
                            }
                          }}
                        >
                          <div className="mr-2">
                            {selectedPlatform === "facebook" && <Facebook className="h-4 w-4" />}
                            {selectedPlatform === "instagram" && <Instagram className="h-4 w-4" />}
                            {selectedPlatform === "twitter" && <Twitter className="h-4 w-4" />}
                            {selectedPlatform === "tiktok" && <Music2 className="h-4 w-4" />}
                            {selectedPlatform === "discord" && <MessageCircle className="h-4 w-4" />}
                            {selectedPlatform === "youtube" && <Youtube className="h-4 w-4" />}
                          </div>
                          Connect with {selectedPlatform === "twitter" ? "Twitter/X" : selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative my-3">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or add manually</span>
                      </div>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        placeholder="Your account name or handle"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountId">Account ID (Optional)</Label>
                      <Input
                        id="accountId"
                        placeholder="Your account ID or URL"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={linkAccountMutation.isPending}>
                  {linkAccountMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>Connect Account</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setSelectedTab}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview" className="sm:flex-1">Overview</TabsTrigger>
          <TabsTrigger value="followers" className="sm:flex-1">Followers</TabsTrigger>
          <TabsTrigger value="engagement" className="sm:flex-1">Engagement</TabsTrigger>
          <TabsTrigger value="posts" className="sm:flex-1">Top Posts</TabsTrigger>
          <TabsTrigger value="reach" className="sm:flex-1">Reach</TabsTrigger>
          <TabsTrigger value="platforms" className="sm:flex-1">Platforms</TabsTrigger>
          <TabsTrigger value="reports" className="sm:flex-1">Reports</TabsTrigger>
        </TabsList>
        
        {/* Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Followers Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumberWithCommas(
                    getMetricByTimePeriod(
                      socialAccounts?.reduce((total, account) => total + parseInt(account.followers || "0"), 0) || 0
                    ).toString()
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {socialAccounts?.length || 0} connected platforms ({selectedTimePeriod === "last-7-days" ? "7 days" : 
                  selectedTimePeriod === "last-30-days" ? "30 days" : "90 days"})
                </p>
              </CardContent>
            </Card>
            
            {/* Engagement Rate Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {socialAccounts?.length 
                    ? ((socialAccounts.reduce((total, account) => total + parseFloat(account.engagement || "0"), 0) / socialAccounts.length) * 
                       (selectedTimePeriod === "last-7-days" ? 1 : 
                        selectedTimePeriod === "last-30-days" ? 1.3 : 1.6)).toFixed(2) + "%"
                    : "0%"
                  }
                </div>
                <Progress 
                  value={socialAccounts?.length 
                    ? ((socialAccounts.reduce((total, account) => total + parseFloat(account.engagement || "0"), 0) / socialAccounts.length) * 
                       (selectedTimePeriod === "last-7-days" ? 1 : 
                        selectedTimePeriod === "last-30-days" ? 1.3 : 1.6))
                    : 0
                  } 
                  className="h-2 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For the last {selectedTimePeriod === "last-7-days" ? "7 days" : 
                              selectedTimePeriod === "last-30-days" ? "30 days" : "90 days"}
                </p>
              </CardContent>
            </Card>
            
            {/* Total Impressions Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumberWithCommas(
                    getMetricByTimePeriod(
                      socialAccounts?.reduce((total, account) => total + parseInt(account.impressions || "0"), 0) || 0
                    ).toString()
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  In the last {selectedTimePeriod === "last-7-days" ? "7 days" : 
                              selectedTimePeriod === "last-30-days" ? "30 days" : "90 days"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Growth Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Growth Summary</CardTitle>
              <CardDescription>Follower growth metrics across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || isLoadingGrowth ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Growth Overview Chart */}
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getFollowersData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          tickFormatter={(value) => formatNumberWithCommas(value.toString())}
                          width={60}
                          tick={{ fontSize: 12 }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <Tooltip
                          formatter={(value) => formatNumberWithCommas(value.toString())}
                          labelFormatter={(label) => `Date: ${label}`}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.375rem",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="followers"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorFollowers)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Growth Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Net Growth */}
                    <Card className="shadow-none border">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-muted-foreground">Net Growth</p>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" />
                            <span className="text-lg font-semibold">
                              {formatNumberWithCommas(
                                getMetricByTimePeriod(
                                  socialAccounts?.reduce((total, account) => {
                                    const growth = parseFloat(account.growthRate || "0") / 100 * parseInt(account.followers || "0");
                                    return total + growth;
                                  }, 0) || 0
                                ).toFixed(0)
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Growth Rate */}
                    <Card className="shadow-none border">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-muted-foreground">Avg Growth Rate</p>
                          <div className="flex items-center">
                            <ChevronUp className="h-4 w-4 mr-1 text-emerald-500" />
                            <span className="text-lg font-semibold">
                              {(socialAccounts?.reduce((sum, account) => sum + parseFloat(account.growthRate || "0"), 0) / 
                                (socialAccounts?.length || 1)).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Best Platform */}
                    <Card className="shadow-none border">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-muted-foreground">Best Platform</p>
                          <div className="flex items-center">
                            {socialAccounts && socialAccounts.length > 0 ? (
                              <>
                                {(() => {
                                  const bestPlatform = [...(socialAccounts || [])].sort(
                                    (a, b) => parseFloat(b.growthRate || "0") - parseFloat(a.growthRate || "0")
                                  )[0];
                                  return (
                                    <>
                                      {platformIcons[bestPlatform?.platform || ""] || <Share2 className="h-4 w-4 mr-1" />}
                                      <span className="text-lg font-semibold capitalize">
                                        {bestPlatform?.platform || "N/A"}
                                      </span>
                                    </>
                                  );
                                })()}
                              </>
                            ) : (
                              <span className="text-lg font-semibold">N/A</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Growth Period */}
                    <Card className="shadow-none border">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm text-muted-foreground">Period</p>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-lg font-semibold">
                              {selectedTimePeriod === "last-7-days" ? "7 Days" : 
                               selectedTimePeriod === "last-30-days" ? "30 Days" : "90 Days"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="followers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Followers Growth</CardTitle>
              <CardDescription>Track your audience growth across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading || isLoadingGrowth ? (
                <div className="flex items-center justify-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError || isErrorGrowth ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                  <h3 className="font-medium text-lg">Failed to load growth data</h3>
                  <p className="text-muted-foreground">Please try again later</p>
                </div>
              ) : growthMetrics?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                  <LineChart className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No growth data available</h3>
                  <p className="text-muted-foreground">Connect your social accounts to see follower growth metrics</p>
                  <Button variant="outline" className="mt-4" onClick={() => setOpenDialog(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Overall Follower Growth */}
                  <div>
                    <h3 className="font-medium text-base mb-4">Overall Follower Growth</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={getFollowersData()}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="totalFollowers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip formatter={(value) => formatNumberWithCommas(value.toString())} />
                          <Area
                            type="monotone"
                            dataKey="followers"
                            stroke="hsl(var(--primary))"
                            fillOpacity={1}
                            fill="url(#totalFollowers)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Growth Rates by Platform */}
                  <div>
                    <h3 className="font-medium text-base mb-4">Growth Rate by Platform</h3>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {growthMetrics?.map((platform) => (
                        <Card key={platform.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className="mr-2">
                                {platformIcons[platform.platform] || <Share2 className="h-6 w-6" />}
                              </div>
                              <div>
                                <CardTitle className="text-sm font-medium capitalize">
                                  {platform.platform}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  {platform.accountName || `@${platform.platform}account`}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Followers</p>
                                <p className="text-2xl font-bold">{formatNumberWithCommas(platform.followers)}</p>
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="text-xs text-muted-foreground">Growth Rate</p>
                                <div className="flex items-center justify-end">
                                  {parseFloat(platform.growthRate) > 0 ? (
                                    <>
                                      <ChevronUp className="text-emerald-500 h-4 w-4 mr-1" />
                                      <span className="text-emerald-500 font-medium">
                                        {platform.growthRate}%
                                      </span>
                                    </>
                                  ) : parseFloat(platform.growthRate) < 0 ? (
                                    <>
                                      <ChevronDown className="text-rose-500 h-4 w-4 mr-1" />
                                      <span className="text-rose-500 font-medium">
                                        {Math.abs(parseFloat(platform.growthRate))}%
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">0%</span>
                                  )}
                                  
                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                        <InfoIcon className="h-3 w-3" />
                                      </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-60">
                                      <div className="space-y-2">
                                        <h4 className="text-sm font-semibold">Growth Metrics</h4>
                                        <div className="text-xs space-y-1">
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Current:</span>
                                            <span className="font-medium">{formatNumberWithCommas(platform.followers)}</span>
                                          </div>
                                          
                                          {platform.followersHistory && platform.followersHistory.length > 1 && (
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Previous:</span>
                                              <span className="font-medium">
                                                {formatNumberWithCommas(platform.followersHistory[platform.followersHistory.length - 2]?.count || "0")}
                                              </span>
                                            </div>
                                          )}
                                          
                                          <div className="flex justify-between">
                                            <span className="text-muted-foreground">Period:</span>
                                            <span className="font-medium">
                                              {selectedTimePeriod === "last-7-days" ? "7 Days" : 
                                               selectedTimePeriod === "last-30-days" ? "30 Days" : "90 Days"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
                                </div>
                              </div>
                            </div>
                            
                            {/* Followers History Chart */}
                            {platform.followersHistory?.length > 1 ? (
                              <div className="h-32 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart 
                                    data={platform.followersHistory}
                                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                  >
                                    <defs>
                                      <linearGradient id={`gradient-${platform.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop 
                                          offset="5%" 
                                          stopColor={parseFloat(platform.growthRate) >= 0 ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(346.8, 77.2%, 49.8%)"}  
                                          stopOpacity={0.8} 
                                        />
                                        <stop 
                                          offset="95%" 
                                          stopColor={parseFloat(platform.growthRate) >= 0 ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(346.8, 77.2%, 49.8%)"}
                                          stopOpacity={0} 
                                        />
                                      </linearGradient>
                                    </defs>
                                    <Tooltip 
                                      formatter={(value) => formatNumberWithCommas(value.toString())} 
                                      labelFormatter={(label) => format(new Date(label), "MMM d, yyyy")}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="count"
                                      stroke={parseFloat(platform.growthRate) >= 0 ? "hsl(142.1, 76.2%, 36.3%)" : "hsl(346.8, 77.2%, 49.8%)"}
                                      fill={`url(#gradient-${platform.id})`}
                                      strokeWidth={2}
                                      activeDot={{ r: 3 }}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                                
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                  <div>
                                    {platform.followersHistory[0]?.date && format(new Date(platform.followersHistory[0].date), "MMM d")}
                                  </div>
                                  <div className="flex items-center">
                                    {parseFloat(platform.growthRate) > 0 ? (
                                      <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                                    ) : parseFloat(platform.growthRate) < 0 ? (
                                      <TrendingDown className="h-3 w-3 text-rose-500 mr-1" />
                                    ) : (
                                      <Minus className="h-3 w-3 mr-1" />
                                    )}
                                    <span>{platform.growthRate}%</span>
                                  </div>
                                  <div>
                                    {platform.followersHistory[platform.followersHistory.length - 1]?.date && 
                                      format(new Date(platform.followersHistory[platform.followersHistory.length - 1].date), "MMM d")}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-32 mt-4 flex items-center justify-center text-center">
                                <p className="text-xs text-muted-foreground">
                                  Not enough historical data to display growth chart
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Content Type</CardTitle>
              <CardDescription>Analyze which content formats perform best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Photos', value: 40 },
                        { name: 'Videos', value: 30 },
                        { name: 'Text', value: 20 },
                        { name: 'Links', value: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Photos', value: 40 },
                        { name: 'Videos', value: 30 },
                        { name: 'Text', value: 20 },
                        { name: 'Links', value: 10 }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumberWithCommas(
                    getMetricByTimePeriod(
                      socialAccounts?.reduce((total, account) => total + parseInt(account.likes || "0"), 0) || 0
                    ).toString()
                  )}
                </div>
                <Progress 
                  value={selectedTimePeriod === "last-7-days" ? 68 : 
                         selectedTimePeriod === "last-30-days" ? 75 : 82} 
                  className="h-2 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  +{selectedTimePeriod === "last-7-days" ? "12" : 
                    selectedTimePeriod === "last-30-days" ? "18" : "24"}% from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumberWithCommas(
                    getMetricByTimePeriod(
                      socialAccounts?.reduce((total, account) => total + parseInt(account.comments || "0"), 0) || 0
                    ).toString()
                  )}
                </div>
                <Progress 
                  value={selectedTimePeriod === "last-7-days" ? 45 : 
                         selectedTimePeriod === "last-30-days" ? 56 : 63} 
                  className="h-2 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  +{selectedTimePeriod === "last-7-days" ? "4" : 
                    selectedTimePeriod === "last-30-days" ? "9" : "14"}% from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumberWithCommas(
                    getMetricByTimePeriod(
                      socialAccounts?.reduce((total, account) => total + parseInt(account.shares || "0"), 0) || 0
                    ).toString()
                  )}
                </div>
                <Progress 
                  value={selectedTimePeriod === "last-7-days" ? 32 : 
                         selectedTimePeriod === "last-30-days" ? 41 : 55} 
                  className="h-2 mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  +{selectedTimePeriod === "last-7-days" ? "8" : 
                    selectedTimePeriod === "last-30-days" ? "15" : "27"}% from previous period
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Top Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Your best content across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0">
                    <div className="bg-muted w-16 h-16 rounded-md flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {['instagram', 'facebook', 'twitter'][i]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(subDays(new Date(), i * 2), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium line-clamp-2">
                        {[
                          "Exciting news! We're launching our new collection next week. Stay tuned! #NewLaunch #ComingSoon",
                          "Here's a sneak peek behind the scenes of our latest photoshoot. Can you guess the theme?",
                          "What's your favorite piece from our Spring collection? Drop a comment below! 👇"
                        ][i]}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs">{(3200 - i * 800).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs">{(240 - i * 80).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs">{(120 - i * 30).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Connected Accounts Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h3 className="text-lg font-semibold">Error loading accounts</h3>
              <p className="text-sm text-muted-foreground">
                There was a problem loading your social media accounts. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/dashboard/social-media"] })}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : socialAccounts && socialAccounts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {socialAccounts.map((account) => {
            // Generate sample growth data for the charts (will be replaced with real data from API)
            const growthData = Array.from({ length: 7 }, (_, i) => ({
              date: format(subDays(new Date(), 6-i), "MMM d"),
              followers: parseInt(account.followers || "0") - Math.floor(Math.random() * 100) * (6-i)
            }));
            
            // Sample engagement data by content type
            const engagementData = [
              { name: 'Photos', value: 40 },
              { name: 'Videos', value: 30 },
              { name: 'Text', value: 20 },
              { name: 'Links', value: 10 },
            ];
            
            // Sample audience demographics
            const demographicData = [
              { name: '18-24', value: 25 },
              { name: '25-34', value: 35 },
              { name: '35-44', value: 20 },
              { name: '45-54', value: 15 },
              { name: '55+', value: 5 },
            ];
            
            // Colors for charts
            const ENGAGEMENT_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];
            const DEMOGRAPHIC_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A480CF'];
            
            // Platform-specific metrics and formatting
            let platformColor = "";
            let platformSpecificMetrics = <></>;
            
            switch(account.platform.toLowerCase()) {
              case 'instagram':
                platformColor = "bg-gradient-to-r from-purple-500 to-pink-500";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Likes</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.likes || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Comments</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.comments || "0")).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              case 'facebook':
                platformColor = "bg-blue-600";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.profileViews || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reach</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.impressions || "0")).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              case 'twitter':
                platformColor = "bg-blue-400";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Retweets</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.shares || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mentions</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.comments || "0")).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              case 'tiktok':
                platformColor = "bg-black";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Video Views</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.impressions || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shares</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.shares || "0")).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              case 'discord':
                platformColor = "bg-indigo-600";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.followers || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Online</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(Math.floor(parseInt(account.followers || "0") * 0.2)).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              case 'youtube':
                platformColor = "bg-red-600";
                platformSpecificMetrics = (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Views</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.impressions || "0")).toString()
                      )}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Videos</p>
                      <p className="text-2xl font-bold">{formatNumberWithCommas(
                        getMetricByTimePeriod(parseInt(account.posts || "0"), 0.1).toString()
                      )}</p>
                    </div>
                  </>
                );
                break;
                
              default:
                platformColor = "bg-gray-600";
            }
            
            return (
              <Card key={account.id} className="col-span-1 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full text-white ${platformColor}`}>
                        {platformIcons[account.platform.toLowerCase()] || <Share2 className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="capitalize">{account.platform}</CardTitle>
                        <CardDescription className="mt-1">
                          {account.accountName || account.accountId || "Connected Account"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={parseInt(account.growthRate || "0") > 0 ? "outline" : "secondary"}
                      className="ml-auto"
                    >
                      {parseInt(account.growthRate || "0") > 0 ? (
                        <span className="flex items-center text-green-600">
                          <ChevronUp className="h-3.5 w-3.5 mr-1" />
                          {account.growthRate}%
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-600">
                          <ChevronDown className="h-3.5 w-3.5 mr-1" />
                          {account.growthRate}%
                        </span>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="overview" className="border-none">
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Followers</p>
                          <p className="text-2xl font-bold">{formatNumberWithCommas(
                            getMetricByTimePeriod(parseInt(account.followers || "0")).toString()
                          )}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs font-normal py-0 h-5 bg-background"
                            >
                              <span className="flex items-center text-green-600">
                                <ChevronUp className="h-3 w-3 mr-0.5" />
                                {formatNumberWithCommas(
                                  Math.floor(
                                    parseInt(account.followers || "0") * 
                                    (selectedTimePeriod === "last-7-days" ? 0.05 : 
                                     selectedTimePeriod === "last-30-days" ? 0.12 : 0.25)
                                  ).toString()
                                )}
                              </span>
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              in the {selectedTimePeriod === "last-7-days" ? "last 7 days" : 
                              selectedTimePeriod === "last-30-days" ? "last 30 days" : "last 90 days"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Engagement</p>
                          <p className="text-2xl font-bold">{account.engagement || "0%"}</p>
                        </div>
                        {platformSpecificMetrics}
                      </div>
                      
                      <AccordionTrigger className="py-2">
                        <span className="text-sm font-medium">View Detailed Analytics</span>
                      </AccordionTrigger>
                      
                      <AccordionContent>
                        <div className="space-y-6 pt-2">
                          {/* Follower Growth Chart */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Follower Growth</h4>
                            <div className="h-[180px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                  <defs>
                                    <linearGradient id="followerGrowth" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="date" />
                                  <YAxis />
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                  <Tooltip />
                                  <Area 
                                    type="monotone" 
                                    dataKey="followers" 
                                    stroke="#8884d8" 
                                    fillOpacity={1} 
                                    fill="url(#followerGrowth)" 
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          {/* Additional Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Top Performing Content</h4>
                              <div className="h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={engagementData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={40}
                                      outerRadius={60}
                                      paddingAngle={5}
                                      dataKey="value"
                                    >
                                      {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={ENGAGEMENT_COLORS[index % ENGAGEMENT_COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Legend />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Audience Age</h4>
                              <div className="h-[180px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RechartsBarChart
                                    data={demographicData}
                                    layout="vertical"
                                  >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" scale="band" />
                                    <Tooltip formatter={(value) => `${value}%`} />
                                    <Bar dataKey="value" fill="#8884d8">
                                      {demographicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={DEMOGRAPHIC_COLORS[index % DEMOGRAPHIC_COLORS.length]} />
                                      ))}
                                    </Bar>
                                  </RechartsBarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                          
                          {/* Conversion Metrics */}
                          <div>
                            <h4 className="text-sm font-medium mb-2">Website Conversion Rate</h4>
                            <div className="flex items-center space-x-4">
                              <Progress value={parseFloat(account.conversionRate || "2")} className="h-2" />
                              <span className="text-sm font-medium">{account.conversionRate || "2"}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Percentage of followers who visit your website
                            </p>
                          </div>
                          
                          {/* Recommendations */}
                          <div className="bg-muted/40 p-3 rounded-md">
                            <h4 className="text-sm font-medium flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                              Growth Recommendations
                            </h4>
                            <p className="text-xs mt-1">
                              Post more {engagementData[0].name.toLowerCase()} content and engage with comments to increase your follower growth rate by up to 15%.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-0">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {format(new Date(account.lastFetched), "MMM d")}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="text-sm">
                        Last synced: {format(new Date(account.lastFetched), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 pb-8">
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <div className="p-3 rounded-full bg-primary/10">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">No accounts connected</h3>
              <p className="text-muted-foreground max-w-md">
                Connect your social media accounts to see analytics, track followers, and measure engagement.
              </p>
              <Button className="mt-4" onClick={() => setOpenDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {socialAccounts && socialAccounts.length > 0 && (
        <div className="mt-10">
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Compare metrics across all your platforms</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-3">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Performance charts and platform comparisons coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Audience Demographics</CardTitle>
                  <CardDescription>Insights about your followers</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Users className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Audience demographics and insights coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance</CardTitle>
                  <CardDescription>Analytics for your posts and content</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center gap-3">
                    <Megaphone className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Content performance analytics coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardLayout>
  );
}