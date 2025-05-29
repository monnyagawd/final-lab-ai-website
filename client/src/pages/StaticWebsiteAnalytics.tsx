import { useState } from "react";
import { 
  ArrowLeft, Globe, Users, MousePointer, Clock, 
  Chrome, AlertTriangle, TrendingUp, TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays, format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";

// This is a static version with hardcoded data for hosting on Netlify

export default function StaticWebsiteAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Static website data
  const website = {
    id: 1,
    name: "Example Business Website",
    domain: "https://example.com",
    trackingId: "abc123def456",
    isActive: true
  };

  // Static analytics data
  const analytics = {
    uniqueVisitors: 128,
    pageViewCount: 256,
    bounceRate: 42.5,
    averageSessionDuration: 124,
    visitorsByDevice: [
      { device: "Desktop", count: 76, percentage: 59.4 },
      { device: "Mobile", count: 42, percentage: 32.8 },
      { device: "Tablet", count: 10, percentage: 7.8 }
    ],
    visitorsByBrowser: [
      { browser: "Chrome", count: 68, percentage: 53.1 },
      { browser: "Safari", count: 32, percentage: 25.0 },
      { browser: "Firefox", count: 18, percentage: 14.1 },
      { browser: "Edge", count: 10, percentage: 7.8 }
    ],
    visitorsByLocation: [
      { location: "United States", count: 86, percentage: 67.2 },
      { location: "United Kingdom", count: 15, percentage: 11.7 },
      { location: "Canada", count: 12, percentage: 9.4 },
      { location: "Australia", count: 8, percentage: 6.3 },
      { location: "Germany", count: 7, percentage: 5.4 }
    ],
    trafficByHour: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 15) + (i > 8 && i < 22 ? 10 : 2)
    })),
    trafficByDay: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const trend = Math.sin(i * 0.2) * 0.5 + 1; // Create a sine wave trend
      return {
        date: format(date, 'MMM dd'),
        visitors: Math.floor((Math.random() * 10 + 30) * trend),
        pageViews: Math.floor((Math.random() * 20 + 50) * trend)
      };
    }),
    topPages: [
      { url: "/", count: 95, bounceRate: 35.2, avgTime: 145 },
      { url: "/products", count: 68, bounceRate: 28.7, avgTime: 210 },
      { url: "/about", count: 42, bounceRate: 65.1, avgTime: 78 },
      { url: "/contact", count: 31, bounceRate: 22.4, avgTime: 185 },
      { url: "/blog", count: 20, bounceRate: 48.9, avgTime: 163 }
    ],
    topReferrers: [
      { url: "google.com", count: 75, percentage: 58.6 },
      { url: "facebook.com", count: 24, percentage: 18.8 },
      { url: "twitter.com", count: 15, percentage: 11.7 },
      { url: "linkedin.com", count: 10, percentage: 7.8 },
      { url: "instagram.com", count: 4, percentage: 3.1 }
    ],
    events: [
      { name: "page_view", count: 256, value: 0 },
      { name: "button_click", count: 87, value: 0 },
      { name: "form_submit", count: 35, value: 0 },
      { name: "purchase", count: 12, value: 1250 },
      { name: "signup", count: 28, value: 0 }
    ],
    conversionRate: 3.2,
    comparisonStats: {
      visitorsChange: 12.4,
      pageViewsChange: 16.7,
      bounceRateChange: -2.8,
      durationChange: 8.5
    }
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

  // Handle date range change 
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range && range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

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

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Button variant="ghost" className="mb-2 -ml-3" onClick={() => {}}>
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
                  {analytics.pageViewCount}
                </div>
              </div>
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
                  {analytics.uniqueVisitors}
                </div>
              </div>
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
                  {analytics.bounceRate}%
                </div>
              </div>
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
                  {formatTime(analytics.averageSessionDuration)}
                </div>
              </div>
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
                data={analytics.trafficByDay}
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

      {/* Visitor Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Device Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Visitors by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.visitorsByDevice}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="device"
                    label={({device, percentage}) => `${device}: ${percentage}%`}
                    labelLine={false}
                  >
                    {analytics.visitorsByDevice.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Browser Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Browser Distribution</CardTitle>
            <CardDescription>Visitors by browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.visitorsByBrowser}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="browser"
                    label={({browser, percentage}) => `${browser}: ${percentage}%`}
                    labelLine={false}
                  >
                    {analytics.visitorsByBrowser.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Visitors by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.visitorsByLocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="location"
                    label={({location, percentage}) => `${location}: ${percentage}%`}
                    labelLine={false}
                  >
                    {analytics.visitorsByLocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Traffic Pattern */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Hourly Traffic Pattern</CardTitle>
          <CardDescription>Visitors by hour of day (based on your timezone)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={analytics.trafficByHour}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [`${value} visitors`, `${props.payload.hour}:00`]}
                  labelFormatter={() => 'Hour'} 
                />
                <Bar dataKey="count" name="Visitors" fill="#3b82f6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-6">Page</div>
                <div className="col-span-2 text-right">Views</div>
                <div className="col-span-2 text-right">Bounce</div>
                <div className="col-span-2 text-right">Avg. Time</div>
              </div>
              
              {analytics.topPages.map((page, index) => (
                <div key={index} className="grid grid-cols-12 text-sm py-2 border-b border-muted last:border-0">
                  <div className="col-span-6 truncate font-medium">{page.url}</div>
                  <div className="col-span-2 text-right">{page.count}</div>
                  <div className="col-span-2 text-right">{page.bounceRate}%</div>
                  <div className="col-span-2 text-right">{formatTime(page.avgTime)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Sources driving traffic to your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-8">Source</div>
                <div className="col-span-2 text-right">Visits</div>
                <div className="col-span-2 text-right">Share</div>
              </div>
              
              {analytics.topReferrers.map((referrer, index) => (
                <div key={index} className="grid grid-cols-12 text-sm py-2 border-b border-muted last:border-0">
                  <div className="col-span-8 truncate font-medium">{referrer.url}</div>
                  <div className="col-span-2 text-right">{referrer.count}</div>
                  <div className="col-span-2 text-right">{referrer.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>User interactions tracked on your site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground pb-2 border-b">
              <div className="col-span-6">Event</div>
              <div className="col-span-3 text-right">Count</div>
              <div className="col-span-3 text-right">Value</div>
            </div>
            
            {analytics.events.map((event, index) => (
              <div key={index} className="grid grid-cols-12 text-sm py-2 border-b border-muted last:border-0">
                <div className="col-span-6 truncate font-medium capitalize">{event.name.replace(/_/g, ' ')}</div>
                <div className="col-span-3 text-right">{event.count}</div>
                <div className="col-span-3 text-right">
                  {event.value > 0 ? `$${event.value.toLocaleString()}` : '-'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}