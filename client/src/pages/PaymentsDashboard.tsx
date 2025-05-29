import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import {
  CreditCard,
  DollarSign,
  Clock,
  ArrowDownUp,
  Download,
  ExternalLink,
  Wallet,
  CreditCardIcon,
  Building2,
  Loader2,
  CalendarIcon,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  ShoppingCart,
  BarChart4,
  ChevronUp,
  LineChart,
  Percent,
  RefreshCw
} from "lucide-react";
import { format, subDays, addMonths } from "date-fns";
import { Link } from "wouter";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

type StripeBalanceResponse = {
  customer: any;
  balance: {
    available: Array<{ amount: number; currency: string }>;
    pending: Array<{ amount: number; currency: string }>;
  };
};

export default function PaymentsDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [showBankDialog, setShowBankDialog] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("4242");

  // Bank account options
  const bankAccounts = [
    { id: 1, last4: "4242", bankName: "Chase" },
    { id: 2, last4: "5678", bankName: "Bank of America" },
    { id: 3, last4: "9012", bankName: "Wells Fargo" }
  ];

  // Get Stripe balance data
  const {
    data: stripeData,
    isLoading,
    isError,
    refetch
  } = useQuery<StripeBalanceResponse>({
    queryKey: ["/api/stripe/balance"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user?.stripeCustomerId,
    retry: 1,
  });
  
  // Create a mutation for initiating transfers
  const transferMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/stripe/transfer", { amount });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Transfer initiated",
        description: "Your funds are on their way to your bank account",
        variant: "default",
      });
      refetch(); // Refresh balance data after transfer
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number, currency = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Sample payment history data (for visual representation)
  const paymentHistory = [
    {
      id: "pi_1234567890",
      date: new Date("2025-04-15"),
      amount: 1750.00,
      status: "succeeded",
      description: "Growth Plan (Monthly)",
    },
    {
      id: "pi_0987654321",
      date: new Date("2025-03-15"),
      amount: 750.00,
      status: "succeeded", 
      description: "Starter Plan (Annual)",
    },
    {
      id: "pi_5678901234",
      date: new Date("2025-02-28"),
      amount: 250.00,
      status: "succeeded",
      description: "Add-on: SEO Optimization",
    },
  ];

  // Sample upcoming payment data
  const upcomingPayment = {
    date: new Date("2025-05-15"),
    amount: 1750.00,
    description: "Growth Plan (Monthly)",
  };
  
  // Sample website revenue data for the charts
  const revenueData = [
    { month: 'Jan', revenue: 2100, visitors: 1250, orders: 42 },
    { month: 'Feb', revenue: 2400, visitors: 1380, orders: 48 },
    { month: 'Mar', revenue: 2200, visitors: 1300, orders: 45 },
    { month: 'Apr', revenue: 2800, visitors: 1500, orders: 56 },
    { month: 'May', revenue: 3200, visitors: 1800, orders: 64 },
    { month: 'Jun', revenue: 3500, visitors: 2000, orders: 72 },
    { month: 'Jul', revenue: 3800, visitors: 2200, orders: 75 },
    { month: 'Aug', revenue: 4100, visitors: 2400, orders: 83 },
    { month: 'Sep', revenue: 4350, visitors: 2500, orders: 88 },
    { month: 'Oct', revenue: 4700, visitors: 2700, orders: 94 },
    { month: 'Nov', revenue: 5100, visitors: 2900, orders: 102 },
    { month: 'Dec', revenue: 5350, visitors: 3100, orders: 110 },
  ];
  
  // Sample revenue breakdown by product/service
  const productRevenueData = [
    { name: 'Web Design', value: 42 },
    { name: 'SEO Services', value: 28 },
    { name: 'Content Creation', value: 18 },
    { name: 'Maintenance', value: 12 },
  ];
  
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];
  
  // Calculate year-to-date revenue
  const ytdRevenue = revenueData.slice(0, 10).reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate projected annual revenue
  const projectedAnnualRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate monthly growth rate
  const lastMonthRevenue = revenueData[9].revenue;
  const prevMonthRevenue = revenueData[8].revenue;
  const growthRate = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Balance & Revenue</h1>
        <p className="text-muted-foreground">
          Track your website revenue, manage Stripe balance, and view payment history
        </p>
      </div>

      {!user?.stripeCustomerId ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <div className="p-3 rounded-full bg-primary/10">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">No payment method connected</h3>
              <p className="text-muted-foreground max-w-md">
                Connect a payment method to manage your subscriptions and make purchases through your dashboard.
              </p>
              <Button asChild className="mt-4">
                <Link href="/packages">View Our Packages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stripe Balance */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : isError ? (
                  <div className="text-red-500 text-sm">Error loading balance</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {stripeData && stripeData.balance && stripeData.balance.available && stripeData.balance.available.length > 0
                      ? formatCurrency(stripeData.balance.available[0].amount / 100)
                      : "$0.00"}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Funds available for withdrawal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-28" />
                ) : isError ? (
                  <div className="text-red-500 text-sm">Error loading balance</div>
                ) : (
                  <div className="text-2xl font-bold">
                    {stripeData && stripeData.balance && stripeData.balance.pending && stripeData.balance.pending.length > 0
                      ? formatCurrency(stripeData.balance.pending[0].amount / 100)
                      : "$0.00"}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Funds pending clearance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(upcomingPayment.amount)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Due on {format(upcomingPayment.date, "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Website Revenue</TabsTrigger>
          <TabsTrigger value="balance">Stripe Balance</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        
        {/* Website Revenue */}
        <TabsContent value="revenue" className="space-y-4">
          {/* Revenue Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total YTD Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(ytdRevenue)}</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  <span>+{growthRate.toFixed(1)}% from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {revenueData.reduce((sum, item) => sum + item.orders, 0)}
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  From all channels
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(revenueData.reduce((sum, item) => sum + item.orders, 0) / 
                    revenueData.reduce((sum, item) => sum + item.visitors, 0) * 100).toFixed(1)}%
                </div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Visitors to customers
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projected Annual</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(projectedAnnualRevenue)}</div>
                <div className="pt-1 text-xs text-muted-foreground">
                  Based on current trends
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue Graph */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue and visitor trends for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'revenue') return formatCurrency(value);
                      return value;
                    }}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    activeDot={{ r: 8 }}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="visitors"
                    name="Visitors"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Revenue by Product/Service and Recent Orders */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue by Product/Service */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>
                  Breakdown of revenue by service category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productRevenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {productRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Monthly Order Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Order Trends</CardTitle>
                <CardDescription>
                  Monthly order volume
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" name="Orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Insights</CardTitle>
              <CardDescription>
                Key metrics and recommendations for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/40">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Growth Opportunities
                  </h3>
                  <p className="text-sm mt-1">
                    Your conversion rate of {(revenueData.reduce((sum, item) => sum + item.orders, 0) / 
                    revenueData.reduce((sum, item) => sum + item.visitors, 0) * 100).toFixed(1)}% is above industry average.
                    Focus on increasing traffic to capitalize on your strong conversion rate.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/40">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Customer Demographics
                  </h3>
                  <p className="text-sm mt-1">
                    Your highest converting demographic is business professionals aged 35-44.
                    Consider creating targeted content for this audience.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/40">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-purple-500" />
                    Seasonal Trends
                  </h3>
                  <p className="text-sm mt-1">
                    Your revenue consistently peaks in Q4. Plan marketing campaigns and product launches
                    to align with this seasonal pattern.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Full Revenue Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Stripe Balance */}
        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Stripe Balance</CardTitle>
                <CardDescription>Manage your Stripe account balance and transfers</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 mx-auto mb-3 text-destructive" />
                  <h3 className="text-lg font-medium mb-1">Unable to load Stripe balance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There was an error connecting to your Stripe account. Please try again later.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => refetch()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  {/* Balance Cards */}
                  <div className="grid gap-4 md:grid-cols-2 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {stripeData && stripeData.balance && stripeData.balance.available && stripeData.balance.available.length > 0
                            ? formatCurrency(stripeData.balance.available[0].amount / 100)
                            : "$0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Available for immediate transfer to your bank account
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {stripeData && stripeData.balance && stripeData.balance.pending && stripeData.balance.pending.length > 0
                            ? formatCurrency(stripeData.balance.pending[0].amount / 100)
                            : "$0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Will be available within 2-7 business days
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Transfer Section */}
                  <div className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Transfer Funds</h3>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Ready for transfer
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Bank Account</div>
                          <div className="text-sm text-muted-foreground">
                            Ending in •••• {selectedBank}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Select Bank Account</DialogTitle>
                              <DialogDescription>
                                Choose the bank account for your transfer
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-4">
                              {bankAccounts.map((account) => (
                                <div
                                  key={account.id}
                                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                                    selectedBank === account.last4 ? "border-primary bg-primary/5" : ""
                                  }`}
                                  onClick={() => setSelectedBank(account.last4)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                      <Building2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{account.bankName}</div>
                                      <div className="text-sm text-muted-foreground">
                                        Ending in •••• {account.last4}
                                      </div>
                                    </div>
                                  </div>
                                  {selectedBank === account.last4 && (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transfer Amount</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                          <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-lg text-right ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="0.00"
                            value={transferAmount}
                            onChange={(e) => {
                              // Allow only numbers and decimals
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              // Ensure we only have one decimal point
                              const parts = value.split('.');
                              if (parts.length > 2) {
                                const decimalPart = parts.slice(1).join('');
                                setTransferAmount(`${parts[0]}.${decimalPart}`);
                              } else {
                                setTransferAmount(value);
                              }
                            }}
                            onFocus={(e) => {
                              // Select all text when focused for easy editing
                              e.target.select();
                            }}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (stripeData?.balance?.available?.[0]?.amount) {
                              setTransferAmount((stripeData.balance.available[0].amount / 100).toFixed(2));
                            }
                          }}
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Button 
                        className="w-full mt-2"
                        disabled={transferMutation.isPending || !transferAmount || parseFloat(transferAmount) <= 0}
                        onClick={() => {
                          const amount = parseFloat(transferAmount);
                          if (amount > 0) {
                            transferMutation.mutate(amount);
                          }
                        }}
                      >
                        {transferMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Transfer to Bank Account"
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Standard transfers typically arrive in 1-2 business days
                      </p>
                    </div>
                  </div>
                  
                  {/* Recent Transfers */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Recent Transfers</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <div className="font-medium">Transfer to Bank</div>
                          <div className="text-sm text-muted-foreground">
                            {format(subDays(new Date(), 14), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(1250.00)}</div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Complete
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <div className="font-medium">Transfer to Bank</div>
                          <div className="text-sm text-muted-foreground">
                            {format(subDays(new Date(), 45), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(950.00)}</div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            Complete
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href="https://dashboard.stripe.com/login" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Stripe Dashboard
                </a>
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
              ) : paymentHistory.length > 0 ? (
                <div className="space-y-2">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{payment.description}</span>
                          {payment.status === "succeeded" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(payment.date, "MMM d, yyyy")} · {payment.id}
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ArrowDownUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No payment history</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't made any payments yet.
                  </p>
                  <Button asChild>
                    <Link href="/packages">View Our Packages</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            {paymentHistory.length > 0 && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
                </Button>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.stripeCustomerId ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <CreditCardIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">Credit Card</div>
                          <div className="text-sm text-muted-foreground">
                            •••• •••• •••• 4242 • Expires 12/25
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">Edit</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="mt-2">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No payment methods</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add a payment method to make purchases and manage subscriptions.
                  </p>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription */}
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your plan and subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.stripeSubscriptionId ? (
                <div className="p-6 border rounded-lg space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Growth Plan</h3>
                      <p className="text-muted-foreground">Monthly subscription</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(1750)}/month</div>
                      <span className="text-sm px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Plan Features</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Custom Website Design</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Social Media Integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Analytics Dashboard</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>24/7 Support</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Billing Information</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next payment:</span>
                          <span>{format(upcomingPayment.date, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Payment method:</span>
                          <span>•••• 4242</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Billing cycle:</span>
                          <span>Monthly</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="destructive">Cancel Subscription</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-1">No active subscription</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to one of our plans to get access to premium features and support.
                  </p>
                  <Button asChild>
                    <Link href="/packages">View Plans</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}