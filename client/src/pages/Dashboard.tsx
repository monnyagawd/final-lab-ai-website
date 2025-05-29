import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { getQueryFn } from "@/lib/queryClient";
import { WebsiteAnalytics, SocialMediaAccount, Notification } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Users,
  Clock,
  MousePointerClick,
  LineChart,
  Share2,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  BarChart4,
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  Package,
  ShoppingCart,
  PackageCheck,
  Boxes
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();

  // Get website analytics
  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
  } = useQuery<WebsiteAnalytics>({
    queryKey: ["/api/dashboard/analytics"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Get social media accounts
  const {
    data: socialMediaData,
    isLoading: isLoadingSocial,
  } = useQuery<SocialMediaAccount[]>({
    queryKey: ["/api/dashboard/social-media"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  // Get notifications
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
  } = useQuery<Notification[]>({
    queryKey: ["/api/dashboard/notifications"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
  });

  const getAnalyticsChangeIndicator = (value: string, isPositive: boolean = true) => {
    const Component = isPositive ? ArrowUpRight : ArrowDownRight;
    const color = isPositive ? "text-green-500" : "text-red-500";
    return (
      <span className={`inline-flex items-center text-sm font-medium ${color}`}>
        <Component className="w-4 h-4 mr-1" />
        {value}
      </span>
    );
  };

  const formatNumberWithCommas = (numStr: string) => {
    const num = parseInt(numStr, 10);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  const platformIcons: Record<string, React.ReactNode> = {
    twitter: <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white">X</div>,
    instagram: <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white">IG</div>,
    facebook: <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">FB</div>,
    tiktok: <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">TT</div>,
    discord: <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">DS</div>,
  };

  return (
    <DashboardLayout>
      {/* Welcome message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || user?.username}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your digital presence and latest activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumberWithCommas(analyticsData?.pageViews || "0")}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getAnalyticsChangeIndicator("12% increase", true)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumberWithCommas(analyticsData?.uniqueVisitors || "0")}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getAnalyticsChangeIndicator("8% increase", true)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analyticsData?.bounceRate || "0"}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getAnalyticsChangeIndicator("3% decrease", false)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analyticsData?.avgTimeOnSite || "0"}m</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {getAnalyticsChangeIndicator("9% increase", true)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Website Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Website Status</CardTitle>
                <CardDescription>Current status of your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${user?.websiteStatus === "online" ? "bg-green-500" : "bg-amber-500"}`}></div>
                  <div>
                    <p className="font-medium">{user?.websiteStatus === "online" ? "Online" : "In Development"}</p>
                    <p className="text-sm text-muted-foreground">{user?.websiteName || "Your Website"}</p>
                  </div>
                </div>
                {user?.websiteUrl && (
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Website
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingNotifications ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(notificationsData || []).slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-amber-500' :
                          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!notificationsData || notificationsData.length === 0) && (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </div>
                )}
                <Button variant="link" size="sm" asChild className="mt-2 px-0">
                  <Link href="/dashboard/notifications">
                    View all activity <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Fulfillment Card */}
            <Card className="overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                  Fulfillment
                </CardTitle>
                <CardDescription>Manage your orders and shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ship products, generate labels, and track status for all your orders in one place.
                </p>
                <Button asChild>
                  <Link href="/dashboard/fulfillment">
                    <Package className="h-4 w-4 mr-2" />
                    Go to Fulfillment
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Inventory Tracker Card */}
            <Card className="overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Boxes className="h-5 w-5 mr-2 text-primary" />
                  Inventory Tracker
                </CardTitle>
                <CardDescription>Track and manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep track of your stock levels, add new products, and get alerts for low inventory.
                </p>
                <Button asChild>
                  <Link href="/dashboard/inventory">
                    <PackageCheck className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/analytics">
                      <BarChart4 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/social-media">
                      <Share2 className="h-4 w-4 mr-2" />
                      Manage Social
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/inventory">
                      <Boxes className="h-4 w-4 mr-2" />
                      Inventory
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/fulfillment">
                      <Package className="h-4 w-4 mr-2" />
                      Fulfillment
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/packages">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Our Services
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Website tab */}
        <TabsContent value="website" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Analytics Overview */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>Your website performance metrics</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/analytics">
                    <LineChart className="h-4 w-4 mr-2" />
                    Detailed Analytics
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingAnalytics ? (
                  <div className="h-40 flex items-center justify-center">
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Top Referrers</p>
                        <ul className="text-sm space-y-1">
                          {analyticsData?.topReferrers ? (
                            analyticsData.topReferrers.split(',').map((referrer, index) => (
                              <li key={index} className="text-muted-foreground">{referrer}</li>
                            ))
                          ) : (
                            <li className="text-muted-foreground">No data available</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Top Pages</p>
                        <ul className="text-sm space-y-1">
                          {analyticsData?.topPages ? (
                            analyticsData.topPages.split(',').map((page, index) => (
                              <li key={index} className="text-muted-foreground">{page}</li>
                            ))
                          ) : (
                            <li className="text-muted-foreground">No data available</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {format(new Date(analyticsData?.lastUpdated || new Date()), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Media tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media Accounts</CardTitle>
                <CardDescription>Connected platforms and performance</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/social-media">
                  <Share2 className="h-4 w-4 mr-2" />
                  Manage Accounts
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingSocial ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : socialMediaData && socialMediaData.length > 0 ? (
                <div className="space-y-4">
                  {socialMediaData.map((account) => (
                    <div key={account.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {platformIcons[account.platform.toLowerCase()] || (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Share2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium capitalize">{account.platform}</p>
                          <p className="text-sm text-muted-foreground">{account.accountName || account.accountId || "Connected Account"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumberWithCommas(account.followers || "0")}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Share2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No social accounts connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect your social media accounts to track performance
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/social-media">Connect Accounts</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Latest Notifications</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/notifications">
              <Bell className="h-4 w-4 mr-2" />
              View All
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          {isLoadingNotifications ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : notificationsData && notificationsData.length > 0 ? (
            <div className="divide-y">
              {notificationsData.slice(0, 5).map((notification) => (
                <div key={notification.id} className={`p-4 ${!notification.isRead ? 'bg-muted/30' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full mt-1 ${
                      notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                      notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                      notification.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you when there's new activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}