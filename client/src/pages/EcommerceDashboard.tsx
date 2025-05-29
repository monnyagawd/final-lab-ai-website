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
import {
  ShoppingCart,
  Store,
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  Truck,
  PlusCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ArrowUpRight,
  LayoutGrid,
  History,
  Settings,
  Globe,
  Database,
  HelpCircle
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define interfaces for the API response
interface EcommerceConnection {
  id: number;
  userId: number;
  platform: string;
  shopName: string;
  shopDomain: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  isConnected: boolean;
  lastSynced?: string;
  metadata?: Record<string, any>;
}

interface SalesData {
  platforms: {
    name: string;
    connected: boolean;
    data?: {
      totalSales: string;
      totalOrders: string;
      averageOrderValue: string;
      conversionRate: string;
      topProducts: {
        name: string;
        sales: string;
        quantity: number;
      }[];
      recentOrders: {
        id: string;
        total: string;
        customer: string;
        status: string;
        date: string;
      }[];
    };
  }[];
}

export default function EcommerceDashboard() {
  const { toast } = useToast();
  const [openConnectDialog, setOpenConnectDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopDomain, setShopDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Get e-commerce connections
  const {
    data: connections,
    isLoading: isLoadingConnections,
    isError: isErrorConnections,
  } = useQuery<EcommerceConnection[]>({
    queryKey: ["/api/ecommerce/connections"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Get sales data
  const {
    data: salesData,
    isLoading: isLoadingSales,
    isError: isErrorSales,
  } = useQuery<SalesData>({
    queryKey: ["/api/ecommerce/sales-data"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!connections && connections.length > 0,
  });

  // Mutation to connect e-commerce platform
  const connectPlatformMutation = useMutation({
    mutationFn: async (data: Partial<EcommerceConnection>) => {
      const res = await apiRequest("POST", "/api/ecommerce/connections", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ecommerce/connections"] });
      toast({
        title: "Platform connected",
        description: `Your ${selectedPlatform} store has been connected successfully.`,
      });
      setOpenConnectDialog(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Connection failed",
        description: error.message || `Could not connect your ${selectedPlatform} store.`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPlatform) {
      toast({
        title: "Missing platform",
        description: "Please select an e-commerce platform.",
        variant: "destructive",
      });
      return;
    }

    connectPlatformMutation.mutate({
      platform: selectedPlatform,
      shopName,
      shopDomain,
      apiKey,
      apiSecret,
      isConnected: true,
    });
  };

  const resetForm = () => {
    setSelectedPlatform("");
    setShopName("");
    setShopDomain("");
    setApiKey("");
    setApiSecret("");
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Create sample data for the sales chart
  const salesChartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
    { name: 'Jul', sales: 3490 },
  ];

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'shopify':
        return <ShoppingBag className="h-6 w-6" />;
      case 'woocommerce':
        return <ShoppingCart className="h-6 w-6" />;
      case 'magento':
        return <Store className="h-6 w-6" />;
      default:
        return <ShoppingCart className="h-6 w-6" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">E-commerce Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your online stores and track sales performance
        </p>
      </div>

      {/* Platform Connections */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>Manage your e-commerce platform connections</CardDescription>
            </div>
            <Dialog open={openConnectDialog} onOpenChange={setOpenConnectDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Connect Platform
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect E-commerce Platform</DialogTitle>
                  <DialogDescription>
                    Link your e-commerce platform to track sales and performance.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-2">
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
                            <SelectLabel>E-commerce Platforms</SelectLabel>
                            <SelectItem value="shopify">Shopify</SelectItem>
                            <SelectItem value="woocommerce">WooCommerce</SelectItem>
                            <SelectItem value="magento">Magento</SelectItem>
                            <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedPlatform && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="shopName">Shop Name</Label>
                          <Input
                            id="shopName"
                            placeholder="Your store name"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="shopDomain">Shop Domain</Label>
                          <Input
                            id="shopDomain"
                            placeholder="yourstorename.myshopify.com"
                            value={shopDomain}
                            onChange={(e) => setShopDomain(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            placeholder="API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apiSecret">API Secret</Label>
                          <Input
                            id="apiSecret"
                            placeholder="API Secret"
                            type="password"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                          />
                        </div>
                        
                        <div className="rounded-md bg-muted/50 p-4">
                          <div className="text-sm text-muted-foreground">
                            <p className="mb-2">How to find your API credentials:</p>
                            {selectedPlatform === "shopify" && (
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Go to your Shopify admin panel</li>
                                <li>Navigate to Apps &gt; App and Sales Channel Settings</li>
                                <li>Click "Develop Apps"</li>
                                <li>Create a new app or select an existing one</li>
                                <li>Generate API credentials under "API credentials"</li>
                              </ol>
                            )}
                            {selectedPlatform === "woocommerce" && (
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Go to your WordPress admin</li>
                                <li>Navigate to WooCommerce &gt; Settings &gt; Advanced &gt; REST API</li>
                                <li>Click "Add key"</li>
                                <li>Set permissions to "Read/Write" and generate</li>
                              </ol>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter className="mt-4">
                    <Button
                      type="submit"
                      disabled={connectPlatformMutation.isPending}
                    >
                      {connectPlatformMutation.isPending && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Connect Platform
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingConnections ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isErrorConnections ? (
            <div className="flex items-center justify-center p-6 text-center">
              <div>
                <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                <h3 className="font-medium">Failed to load connections</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please try refreshing the page.
                </p>
              </div>
            </div>
          ) : connections && connections.length > 0 ? (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="rounded-md bg-muted p-2">
                      {getPlatformIcon(connection.platform)}
                    </div>
                    <div>
                      <h3 className="font-medium">{connection.shopName}</h3>
                      <p className="text-sm text-muted-foreground">{connection.shopDomain}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={connection.isConnected ? "default" : "outline"}>
                      {connection.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No platforms connected</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md">
                Connect your e-commerce platform to track sales, orders, and performance metrics.
              </p>
              <Button onClick={() => setOpenConnectDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Connect Platform
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* If no connections, don't show the rest of the dashboard */}
      {(!connections || connections.length === 0) && !isLoadingConnections && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Connect a platform to view your dashboard</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your sales data, order history, and performance metrics will appear here once you connect an e-commerce platform.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
                <Card className="p-4">
                  <Store className="h-10 w-10 text-primary mb-2" />
                  <h4 className="font-medium">Sales Analytics</h4>
                  <p className="text-sm text-muted-foreground">Track revenue and performance</p>
                </Card>
                <Card className="p-4">
                  <ShoppingBag className="h-10 w-10 text-primary mb-2" />
                  <h4 className="font-medium">Order Management</h4>
                  <p className="text-sm text-muted-foreground">Manage and fulfill orders</p>
                </Card>
                <Card className="p-4">
                  <Database className="h-10 w-10 text-primary mb-2" />
                  <h4 className="font-medium">Product Insights</h4>
                  <p className="text-sm text-muted-foreground">See what's selling best</p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Dashboard Tabs - only show if there are connections */}
      {connections && connections.length > 0 && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            {isLoadingSales ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            ) : salesData && salesData.platforms.some(p => p.connected && p.data) ? (
              <>
                {/* Sales Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  {salesData.platforms.map(platform => {
                    if (!platform.connected || !platform.data) return null;
                    
                    return (
                      <Card key={platform.name}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(platform.data.totalSales)}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="inline h-3 w-3 text-emerald-500 mr-1" />
                            8% increase from last month
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {salesData.platforms.map(platform => {
                    if (!platform.connected || !platform.data) return null;
                    
                    return (
                      <Card key={`${platform.name}-orders`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{platform.data.totalOrders}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="inline h-3 w-3 text-emerald-500 mr-1" />
                            3% increase from last month
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {salesData.platforms.map(platform => {
                    if (!platform.connected || !platform.data) return null;
                    
                    return (
                      <Card key={`${platform.name}-aov`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(platform.data.averageOrderValue)}</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="inline h-3 w-3 text-emerald-500 mr-1" />
                            5% increase from last month
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {salesData.platforms.map(platform => {
                    if (!platform.connected || !platform.data) return null;
                    
                    return (
                      <Card key={`${platform.name}-cvr`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{platform.data.conversionRate}%</div>
                          <p className="text-xs text-muted-foreground mt-1">
                            <TrendingUp className="inline h-3 w-3 text-emerald-500 mr-1" />
                            1.2% increase from last month
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Sales Chart */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Sales Over Time</CardTitle>
                    <CardDescription>Monthly sales performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesChartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="salesColorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" />
                          <YAxis 
                            tickFormatter={(value) => 
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                notation: 'compact',
                                compactDisplay: 'short'
                              }).format(value)
                            } 
                          />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip 
                            formatter={(value) => 
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                              }).format(Number(value))
                            } 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="var(--color-primary)" 
                            fillOpacity={1} 
                            fill="url(#salesColorGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Orders and Top Products */}
                <div className="grid gap-8 md:grid-cols-2 mb-8">
                  {/* Top Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Products</CardTitle>
                      <CardDescription>Best-selling products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {salesData.platforms.map(platform => {
                        if (!platform.connected || !platform.data || !platform.data.topProducts) return null;
                        
                        return (
                          <div key={`${platform.name}-top-products`} className="space-y-4">
                            {platform.data.topProducts.map((product, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="font-medium">{product.name}</p>
                                  <div className="flex space-x-2 text-sm text-muted-foreground">
                                    <span>{formatCurrency(product.sales)}</span>
                                    <span>•</span>
                                    <span>{product.quantity} sold</span>
                                  </div>
                                </div>
                                <div className="w-24 flex items-center">
                                  <Progress 
                                    value={
                                      (parseFloat(product.sales) / 
                                      Math.max(...platform.data!.topProducts.map(p => parseFloat(p.sales)))) * 100
                                    } 
                                    className="h-2" 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest activity from your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {salesData.platforms.map(platform => {
                        if (!platform.connected || !platform.data || !platform.data.recentOrders) return null;
                        
                        return (
                          <div key={`${platform.name}-recent-orders`} className="space-y-4">
                            {platform.data.recentOrders.map((order, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className="font-medium">{order.id}</p>
                                  <div className="flex space-x-2 text-sm text-muted-foreground">
                                    <span>{order.customer}</span>
                                    <span>•</span>
                                    <span>{formatCurrency(order.total)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(order.date), "MMM d, h:mma")}
                                  </span>
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Orders
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">No sales data available</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                      We couldn't fetch sales data from your connected platforms. This could be due to API limits or insufficient permissions.
                    </p>
                    <Button variant="outline">Sync Data Manually</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage your store orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData && salesData.platforms.map(platform => {
                        if (!platform.connected || !platform.data || !platform.data.recentOrders) return null;
                        
                        return platform.data.recentOrders.map((order, index) => (
                          <TableRow key={`${platform.name}-order-${index}`}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{format(new Date(order.date), "MMM d, yyyy")}</TableCell>
                            <TableCell>{formatCurrency(order.total)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Package className="h-3.5 w-3.5 mr-1" />
                                Fulfill
                              </Button>
                            </TableCell>
                          </TableRow>
                        ));
                      })}
                      
                      {/* If no orders available */}
                      {(!salesData || !salesData.platforms.some(p => p.connected && p.data && p.data.recentOrders)) && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No orders found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {salesData && salesData.platforms.map(platform => {
                    if (!platform.connected || !platform.data || !platform.data.topProducts) return null;
                    
                    return platform.data.topProducts.map((product, index) => (
                      <Card key={`${platform.name}-product-${index}`}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="bg-muted h-24 w-24 rounded-md mb-4 flex items-center justify-center">
                              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{product.quantity} in stock</p>
                            <p className="font-bold">{formatCurrency(product.sales)}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
                        </CardFooter>
                      </Card>
                    ));
                  })}
                  
                  {/* If no products available */}
                  {(!salesData || !salesData.platforms.some(p => p.connected && p.data && p.data.topProducts)) && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-1">No products found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your connected store doesn't have any products or we're unable to fetch them.
                      </p>
                      <Button>Add Your First Product</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Platform</CardTitle>
                  <CardDescription>Distribution of sales across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    {salesData && salesData.platforms.some(p => p.connected && p.data) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salesData.platforms
                              .filter(p => p.connected && p.data)
                              .map(p => ({
                                name: p.name,
                                value: parseFloat(p.data!.totalSales)
                              }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="var(--color-primary)"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {salesData.platforms
                              .filter(p => p.connected && p.data)
                              .map((_, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={`hsl(${index * 60}, 70%, 50%)`} 
                                />
                              ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => 
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                              }).format(Number(value))
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center">
                        <p className="text-muted-foreground">No sales data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Distribution</CardTitle>
                  <CardDescription>Order count by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {salesData && salesData.platforms.some(p => p.connected && p.data) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesData.platforms
                            .filter(p => p.connected && p.data)
                            .map(p => ({
                              name: p.name,
                              orders: parseInt(p.data!.totalOrders)
                            }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="orders" fill="var(--color-primary)" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No order data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}