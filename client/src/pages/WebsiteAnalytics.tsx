import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, ArrowLeft, Globe, Users, MousePointer, Clock, Activity, 
  Link as LinkIcon, User, Zap, BarChart4, Calendar, Smartphone, 
  Monitor, Tablet, Laptop, Chrome, Box, AlertTriangle,
  HardDrive, MapPin, Clock3, TrendingUp, TrendingDown, Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { addDays, format, formatDistance, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, 
  Cell, LineChart, Line 
} from "recharts";

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

interface WebsiteAnalytics {
  uniqueVisitors: number;
  pageViewCount: number;
  bounceRate: number;
  averageSessionDuration: number;
  visitorsByDevice: Array<{ device: string; count: number; percentage: number }>;
  visitorsByBrowser: Array<{ browser: string; count: number; percentage: number }>;
  visitorsByLocation: Array<{ location: string; count: number; percentage: number }>;
  trafficByHour: Array<{ hour: number; count: number }>;
  trafficByDay: Array<{ date: string; visitors: number; pageViews: number }>;
  topPages: Array<{ url: string; count: number; bounceRate: number; avgTime: number }>;
  topReferrers: Array<{ url: string; count: number; percentage: number }>;
  events: Array<{ name: string; count: number; value: number }>;
  conversionRate: number;
  comparisonStats: {
    visitorsChange: number;
    pageViewsChange: number;
    bounceRateChange: number;
    durationChange: number;
  };
  timeframe: {
    start: string;
    end: string;
  };
}

export default function WebsiteAnalytics() {
  const { id } = useParams();
  const websiteId = Number(id);
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Fetch website details
  const { data: website, isLoading: websiteLoading, error: websiteError } = useQuery({
    queryKey: [`/api/tracked-websites/${websiteId}`],
    enabled: !!user && !!websiteId,
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: [`/api/tracked-websites/${websiteId}/analytics`, dateRange],
    queryFn: async () => {
      const url = new URL(`/api/tracked-websites/${websiteId}/analytics`, window.location.origin);
      if (dateRange.from) url.searchParams.append('start', dateRange.from.toISOString());
      if (dateRange.to) url.searchParams.append('end', dateRange.to.toISOString());
      
      const res = await fetch(url.toString(), {
        credentials: 'include'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to fetch analytics data' }));
        throw new Error(errorData.message || 'Failed to fetch analytics data');
      }
      return await res.json();
    },
    enabled: !!user && !!websiteId && !!website,
  });

  const isLoading = websiteLoading || analyticsLoading;
  const error = websiteError || analyticsError;

  // Format domain for display
  const formatDomain = (domain: string) => {
    try {
      const url = new URL(domain);
      return url.hostname;
    } catch (e) {
      return domain;
    }
  };

  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      return new URL(url).pathname || url;
    } catch (e) {
      return url;
    }
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range && range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
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
      <div className="container max-w-5xl py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/website-tracking")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Websites
        </Button>
        
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="container max-w-5xl py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/website-tracking")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Websites
        </Button>
        
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Website Not Found</AlertTitle>
          <AlertDescription>
            The website you're looking for doesn't exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show empty state message if no analytics data
  const hasNoData = analytics && analytics.pageViewCount === 0;

  // Helper function to format time in minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get trend icons based on percentage change
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  // Charts colors
  const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];
  
  // Prepare device data for pie chart - only show real data
  const prepareDeviceData = (data: any) => {
    if (!data || !data.visitorsByDevice || !data.visitorsByDevice.length) {
      return [];
    }
    return data.visitorsByDevice.map((item: any) => ({
      name: item.device,
      value: item.count,
    }));
  };

  // Prepare hourly traffic data for bar chart - only show real data
  const prepareHourlyData = (data: any) => {
    if (!data || !data.trafficByHour || !data.trafficByHour.length) {
      return [];
    }
    return data.trafficByHour;
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" className="mb-2 -ml-3" onClick={() => navigate("/website-tracking")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Websites
          </Button>
          <h1 className="text-3xl font-bold">{website.name}</h1>
          <a 
            href={website.domain} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:underline flex items-center mt-1"
          >
            <Globe className="h-4 w-4 mr-1" />
            {formatDomain(website.domain)}
          </a>
        </div>
        <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
      </div>

      {/* Show helpful message when no data is available */}
      {hasNoData && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Analytics Data Yet</AlertTitle>
          <AlertDescription>
            No visitors have been tracked for this website yet. Make sure the tracking script is properly installed on your website to start collecting data.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MousePointer className="h-5 w-5 mr-2 text-primary" />
                <div className="text-2xl font-bold">
                  {analytics?.pageViewCount || 0}
                </div>
              </div>
              {analytics?.comparisonStats && (
                <div className="flex items-center">
                  {getTrendIcon(analytics.comparisonStats.pageViewsChange)}
                  <span className={`text-sm ml-1 ${
                    analytics.comparisonStats.pageViewsChange > 0 
                      ? 'text-green-500' 
                      : analytics.comparisonStats.pageViewsChange < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    {Math.abs(analytics.comparisonStats.pageViewsChange)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <div className="text-2xl font-bold">
                  {analytics?.uniqueVisitors || 0}
                </div>
              </div>
              {analytics?.comparisonStats && (
                <div className="flex items-center">
                  {getTrendIcon(analytics.comparisonStats.visitorsChange)}
                  <span className={`text-sm ml-1 ${
                    analytics.comparisonStats.visitorsChange > 0 
                      ? 'text-green-500' 
                      : analytics.comparisonStats.visitorsChange < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    {Math.abs(analytics.comparisonStats.visitorsChange)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                <div className="text-2xl font-bold">
                  {analytics?.bounceRate ? `${analytics.bounceRate}%` : '0%'}
                </div>
              </div>
              {analytics?.comparisonStats && (
                <div className="flex items-center">
                  {/* For bounce rate, lower is better, so we invert the icon logic */}
                  {analytics.comparisonStats.bounceRateChange > 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : analytics.comparisonStats.bounceRateChange < 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : null}
                  <span className={`text-sm ml-1 ${
                    analytics.comparisonStats.bounceRateChange > 0 
                      ? 'text-red-500' 
                      : analytics.comparisonStats.bounceRateChange < 0 
                        ? 'text-green-500' 
                        : ''
                  }`}>
                    {Math.abs(analytics.comparisonStats.bounceRateChange)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. previous period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div className="text-2xl font-bold">
                  {analytics?.averageSessionDuration 
                    ? formatTime(analytics.averageSessionDuration) 
                    : '0:00'}
                </div>
              </div>
              {analytics?.comparisonStats && (
                <div className="flex items-center">
                  {getTrendIcon(analytics.comparisonStats.durationChange)}
                  <span className={`text-sm ml-1 ${
                    analytics.comparisonStats.durationChange > 0 
                      ? 'text-green-500' 
                      : analytics.comparisonStats.durationChange < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    {Math.abs(analytics.comparisonStats.durationChange)}%
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs. previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Over Time Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visitors and page views over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.trafficByDay || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => value.substring(0, 6)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  name="Visitors"
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  name="Page Views"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorPageViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Device Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Distribution</CardTitle>
                <CardDescription>Visitors by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDeviceData(analytics)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                      >
                        {prepareDeviceData(analytics).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} visitors`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {analytics?.visitorsByDevice?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {analytics.visitorsByDevice.map((device: any, index: number) => (
                      <div key={index} className="flex flex-col items-center p-2 rounded-md border">
                        {device.device === 'Desktop' ? (
                          <Monitor className="h-6 w-6 mb-1 text-muted-foreground" />
                        ) : device.device === 'Mobile' ? (
                          <Smartphone className="h-6 w-6 mb-1 text-muted-foreground" />
                        ) : (
                          <Tablet className="h-6 w-6 mb-1 text-muted-foreground" />
                        )}
                        <p className="text-sm font-medium">{device.device}</p>
                        <p className="text-xs text-muted-foreground">{device.percentage}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Traffic by Hour */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traffic by Hour</CardTitle>
                <CardDescription>When your visitors are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={prepareHourlyData(analytics)}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${value}:00`}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value} visitors`, 'Visitors']} />
                      <Bar dataKey="count" name="Visitors" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  <Clock3 className="h-4 w-4 inline-block mr-1 mb-1" />
                  Peak traffic: {analytics?.trafficByHour ? (
                    (() => {
                      const peakHour = [...(analytics.trafficByHour || [])].sort((a, b) => b.count - a.count)[0];
                      return peakHour ? `${peakHour.hour}:00 - ${peakHour.hour + 1}:00` : 'Not enough data';
                    })()
                  ) : 'Not enough data'}
                </p>
              </CardContent>
            </Card>
            
            {/* Browser Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browser Distribution</CardTitle>
                <CardDescription>Visitors by browser type</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.visitorsByBrowser && analytics.visitorsByBrowser.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.visitorsByBrowser.map((browser: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {browser.browser === 'Chrome' ? (
                              <Chrome className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : browser.browser === 'Firefox' ? (
                              <Box className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : browser.browser === 'Safari' ? (
                              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : (
                              <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">{browser.browser}</span>
                          </div>
                          <span className="text-sm">{browser.count} visitors ({browser.percentage}%)</span>
                        </div>
                        <Progress value={browser.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No browser data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Geographical Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geographical Distribution</CardTitle>
                <CardDescription>Visitors by location</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.visitorsByLocation && analytics.visitorsByLocation.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.visitorsByLocation.map((location: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm font-medium">{location.location}</span>
                          </div>
                          <span className="text-sm">{location.count} visitors ({location.percentage}%)</span>
                        </div>
                        <Progress value={location.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No location data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topPages && analytics.topPages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-medium text-sm">#</th>
                        <th className="text-left py-2 px-4 font-medium text-sm">Page</th>
                        <th className="text-right py-2 px-4 font-medium text-sm">Views</th>
                        <th className="text-right py-2 px-4 font-medium text-sm">Bounce Rate</th>
                        <th className="text-right py-2 px-4 font-medium text-sm">Avg. Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topPages.map((page, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4 text-sm text-muted-foreground">{index + 1}</td>
                          <td className="py-2 px-4">
                            <div className="flex items-center">
                              <span className="text-sm font-medium truncate max-w-xs">
                                {formatUrl(page.url)}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-right text-sm font-medium">
                            {page.count}
                          </td>
                          <td className="py-2 px-4 text-right text-sm">
                            <Badge variant={page.bounceRate > 70 ? "destructive" : page.bounceRate > 40 ? "secondary" : "default"}>
                              {page.bounceRate}%
                            </Badge>
                          </td>
                          <td className="py-2 px-4 text-right text-sm">
                            {formatTime(page.avgTime)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No page views recorded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Referrers Tab */}
        <TabsContent value="referrers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Referrers</CardTitle>
              <CardDescription>Sources that drive traffic to your site</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topReferrers && analytics.topReferrers.length > 0 ? (
                <div className="space-y-6">
                  {/* Pie Chart for Referrer Distribution */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.topReferrers.map((ref: any) => ({ name: ref.url, value: ref.count }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name.substring(0, 15)}${name.length > 15 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {analytics.topReferrers.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} referrals`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Table of Referrers */}
                  <div className="overflow-x-auto mt-6">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-sm">#</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Source</th>
                          <th className="text-right py-2 px-4 font-medium text-sm">Visitors</th>
                          <th className="text-right py-2 px-4 font-medium text-sm">% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topReferrers.map((referrer, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4 text-sm text-muted-foreground">{index + 1}</td>
                            <td className="py-2 px-4">
                              <div className="flex items-center">
                                <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm font-medium truncate max-w-xs">
                                  {referrer.url}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-right text-sm font-medium">
                              {referrer.count}
                            </td>
                            <td className="py-2 px-4 text-right text-sm">
                              <Badge variant="outline">
                                {referrer.percentage}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No referrers recorded yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Visitors Tab */}
        <TabsContent value="visitors">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Conversion Rate Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                <CardDescription>Percentage of visitors who complete a goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Percent className="h-6 w-6 text-muted-foreground" />
                      <span className="text-3xl font-bold ml-2">
                        {analytics?.conversionRate ? analytics.conversionRate.toFixed(1) : '0.0'}
                      </span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="stroke-muted-foreground/10 fill-none" 
                        cx="50" cy="50" r="40" 
                        strokeWidth="10" 
                      />
                      <circle 
                        className="stroke-primary fill-none" 
                        cx="50" cy="50" r="40" 
                        strokeWidth="10" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (analytics?.conversionRate || 0) / 100)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mt-2">
                      Goal completions: {analytics?.events?.find((e: any) => e.name === 'conversion')?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Engagement Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visitor Engagement</CardTitle>
                <CardDescription>How engaged are your visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Avg. Pages per Session</div>
                      <div className="text-sm font-medium">
                        {analytics?.pageViewCount && analytics?.uniqueVisitors 
                          ? (analytics.pageViewCount / analytics.uniqueVisitors).toFixed(1)
                          : '0.0'}
                      </div>
                    </div>
                    <Progress 
                      value={analytics?.pageViewCount && analytics?.uniqueVisitors 
                        ? Math.min((analytics.pageViewCount / analytics.uniqueVisitors) * 20, 100)
                        : 0
                      } 
                      className="h-2" 
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Returning Visitors</div>
                      <div className="text-sm font-medium">
                        {analytics?.visitorsByDevice?.[0]?.percentage || 0}%
                      </div>
                    </div>
                    <Progress 
                      value={analytics?.visitorsByDevice?.[0]?.percentage || 0} 
                      className="h-2" 
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">Avg. Session Duration</div>
                      <div className="text-sm font-medium">
                        {analytics?.averageSessionDuration 
                          ? formatTime(analytics.averageSessionDuration) 
                          : '0:00'}
                      </div>
                    </div>
                    <Progress 
                      value={analytics?.averageSessionDuration 
                        ? Math.min((analytics.averageSessionDuration / 300) * 100, 100)
                        : 0
                      } 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Events</CardTitle>
              <CardDescription>User interactions tracked with custom events</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.events && analytics.events.length > 0 ? (
                <div className="space-y-8">
                  {/* Bar Chart for Events */}
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={analytics.events}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Occurrences" fill="#3b82f6" />
                        {analytics.events.some(e => e.value > 0) && (
                          <Bar dataKey="value" name="Value" fill="#10b981" />
                        )}
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Table of Events */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 font-medium text-sm">#</th>
                          <th className="text-left py-2 px-4 font-medium text-sm">Event Name</th>
                          <th className="text-right py-2 px-4 font-medium text-sm">Count</th>
                          <th className="text-right py-2 px-4 font-medium text-sm">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.events.map((event, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4 text-sm text-muted-foreground">{index + 1}</td>
                            <td className="py-2 px-4">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm font-medium truncate max-w-xs">
                                  {event.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-4 text-right text-sm font-medium">
                              {event.count}
                            </td>
                            <td className="py-2 px-4 text-right text-sm">
                              {event.value ? `$${event.value.toFixed(2)}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No custom events recorded yet
                </div>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground border-t px-6 py-4">
              <div className="space-y-2">
                <p>To track custom events, use the <code>trackEvent</code> method:</p>
                <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                  <code>
                    {`window.labAIAnalytics.trackEvent('event_name', { 
  action: 'click',
  category: 'button',
  label: 'signup',
  value: 10 // optional numeric value
});`}
                  </code>
                </pre>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Separator className="mb-6" />
        <div className="text-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 inline-block mr-1 mb-1" />
          Data shown for period: {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}