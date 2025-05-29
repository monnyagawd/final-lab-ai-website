import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Truck,
  ShoppingCart,
  FileText,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
  Clipboard,
  ClipboardCheck,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  ChevronsUpDown,
} from "lucide-react";

// Styles for status badges
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case "processing":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Shipped</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
    case "canceled":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Canceled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Format currency values
const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(amount));
};

// Format dates to be more readable
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Component for generating shipping label
function GenerateLabelDialog({ 
  isOpen, 
  onClose, 
  shipmentId, 
  onSubmit 
}: { 
  isOpen: boolean;
  onClose: () => void;
  shipmentId: number | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Shipping Label</DialogTitle>
          <DialogDescription>
            Provide information to generate a shipping label.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrier">Shipping Carrier</Label>
                <Select name="carrier" defaultValue="usps">
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Package Weight (lbs)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  defaultValue="1.0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Package Dimensions (inches)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length" className="text-xs">Length</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    defaultValue="12"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="width" className="text-xs">Width</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    step="0.1"
                    defaultValue="9"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">Height</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    step="0.1"
                    defaultValue="6"
                    required
                  />
                </div>
              </div>
            </div>
            
            <input type="hidden" name="shipmentId" value={shipmentId || ''} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Generate Label</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Component for printing shipping label
function PrintLabelDialog({ 
  isOpen, 
  onClose, 
  labelData, 
  onPrint,
  onViewLabel
}: { 
  isOpen: boolean;
  onClose: () => void;
  labelData: any;
  onPrint: () => void;
  onViewLabel: () => void;
}) {
  if (!labelData) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Print Shipping Label</DialogTitle>
          <DialogDescription>
            Prepare the shipping label for printing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">{labelData.carrierName}</h3>
                <p className="text-sm text-muted-foreground mb-2">Tracking #: {labelData.trackingNumber}</p>
              </div>
              <div className="border-t pt-2 mt-2">
                <p className="font-medium">Ship To:</p>
                <p>{labelData.recipientName}</p>
                <p className="text-sm">{labelData.recipientAddress}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will open a print-friendly shipping label in a new window. You can then use your browser's print function to print the label.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onViewLabel}>
            Preview Label
          </Button>
          <Button onClick={onPrint}>
            Print Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main Fulfillment Component
export default function Fulfillment() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [isGenerateLabelOpen, setIsGenerateLabelOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedLabelData, setSelectedLabelData] = useState<{
    url: string;
    trackingNumber: string;
    carrierName: string;
    recipientName: string;
    recipientAddress: string;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  // Fetch all orders
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => apiRequest("GET", "/api/orders").then(res => res.json()),
  });
  
  // Fetch order details when an order is selected
  const {
    data: orderDetails,
    isLoading: orderDetailsLoading,
    error: orderDetailsError,
  } = useQuery({
    queryKey: ["/api/orders", selectedOrderId],
    queryFn: () => {
      if (!selectedOrderId) return null;
      return apiRequest("GET", `/api/orders/${selectedOrderId}`).then(res => res.json());
    },
    enabled: !!selectedOrderId,
  });
  
  // Fetch shipping providers
  const {
    data: shippingProviders,
    isLoading: providersLoading,
  } = useQuery({
    queryKey: ["/api/shipping-providers"],
    queryFn: () => apiRequest("GET", "/api/shipping-providers").then(res => res.json()),
  });
  
  // Mutation for updating order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrderId] });
      }
      toast({
        title: "Order Updated",
        description: "The order status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for creating a shipment
  const createShipmentMutation = useMutation({
    mutationFn: async (shipmentData: any) => {
      const response = await apiRequest("POST", "/api/shipments", shipmentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrderId] });
      }
      setIsCreateShipmentOpen(false);
      toast({
        title: "Shipment Created",
        description: "The shipment has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Shipment Creation Failed",
        description: "Failed to create shipment. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mutation for generating a shipping label
  const generateLabelMutation = useMutation({
    mutationFn: async (labelData: any) => {
      const response = await apiRequest("POST", "/api/shipping/generate-label", labelData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrderId] });
      }
      setIsGenerateLabelOpen(false);
      toast({
        title: "Shipping Label Generated",
        description: "The shipping label has been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Label Generation Failed",
        description: "Failed to generate shipping label. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Filter orders based on status and search term
  const filteredOrders = orders?.filter((order: any) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  // Handle selecting an order to view details
  const handleOrderSelect = (orderId: number) => {
    setSelectedOrderId(orderId);
  };
  
  // Handle order status change
  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };
  
  // Handle shipment creation
  const handleCreateShipment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const shipmentData = {
      orderId: selectedOrderId,
      carrier: formData.get("carrier") as string,
      shippingMethod: formData.get("shippingMethod") as string,
      packageWeight: formData.get("packageWeight") as string,
      dimensions: JSON.stringify({
        length: formData.get("length"),
        width: formData.get("width"),
        height: formData.get("height"),
        unit: "in"
      }),
      shippingCost: formData.get("shippingCost") as string,
      status: "pending"
    };
    
    createShipmentMutation.mutate(shipmentData);
  };
  
  // Handle generating a shipping label
  const handleGenerateLabel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const labelData = {
      shipmentId: selectedShipmentId,
      carrier: formData.get("carrier") as string,
      weight: formData.get("weight") as string,
      dimensions: JSON.stringify({
        length: formData.get("length"),
        width: formData.get("width"),
        height: formData.get("height"),
        unit: "in"
      }),
    };
    
    generateLabelMutation.mutate(labelData);
  };
  
  // Function to open print preview dialog
  const openPrintDialog = (shipment: any, order: any) => {
    setSelectedLabelData({
      url: shipment.labelUrl,
      trackingNumber: shipment.trackingNumber,
      carrierName: shipment.carrier,
      recipientName: order.customerName,
      recipientAddress: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingZip}`
    });
    setIsPrintDialogOpen(true);
  };

  // Function to get label HTML template
  const getLabelHtml = (labelData: any) => {
    if (!labelData) return '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - ${labelData.trackingNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .label-container {
            width: 4in;
            height: 6in;
            border: 1px solid #000;
            padding: 0.25in;
            margin: 20px auto;
            position: relative;
          }
          .logo {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .section {
            margin-bottom: 15px;
          }
          .section-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #666;
          }
          .section-content {
            font-size: 14px;
            font-weight: bold;
          }
          .address {
            font-size: 16px;
            line-height: 1.4;
          }
          .barcode {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
            border: 1px solid #ddd;
          }
          .tracking {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .footer {
            font-size: 10px;
            text-align: center;
            margin-top: 20px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .print-button {
              display: none;
            }
          }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background: #4a6ee0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="logo">YOUR BRAND NAME</div>
          
          <div class="section">
            <div class="section-title">Ship To:</div>
            <div class="address">
              ${labelData.recipientName}<br>
              ${labelData.recipientAddress}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Carrier:</div>
            <div class="section-content">${labelData.carrierName}</div>
          </div>

          <div class="barcode">
            |||||||||||||||||||||||||||||||||
          </div>

          <div class="tracking">
            ${labelData.trackingNumber}
          </div>

          <div class="footer">
            Thank you for your purchase!<br>
            Questions? Contact support@yourbrand.com
          </div>
        </div>
        <button class="print-button" onclick="window.print(); return false;">Print Label</button>
      </body>
      </html>
    `;
  };

  // Function to directly view the shipping label
  const viewShippingLabel = () => {
    if (!selectedLabelData) return;
    
    const labelHtml = getLabelHtml(selectedLabelData);
    const blob = new Blob([labelHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    toast({
      title: "Shipping Label Opened",
      description: `Label for ${selectedLabelData.trackingNumber} opened in new tab.`,
    });
  };

  // Function to print the label
  const printLabel = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !selectedLabelData) return;

    // Use the template function
    const labelHtml = getLabelHtml(selectedLabelData);

    printWindow.document.open();
    printWindow.document.write(labelHtml);
    printWindow.document.close();

    setIsPrintDialogOpen(false);
    
    toast({
      title: "Shipping Label Ready",
      description: `Label for ${selectedLabelData.trackingNumber} opened in new window.`,
    });
  };

  if (ordersLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-12 w-12 animate-spin text-primary" />
            <p className="text-xl font-medium">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (ordersError) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-xl font-medium">Failed to load orders</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/orders"] })}>
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Fulfillment</h1>
        <p className="text-muted-foreground mt-2">Manage your orders and shipments</p>
      </div>
      
      {/* Fulfillment Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders to Fulfill</p>
                <h3 className="text-2xl font-bold mt-1">
                  {orders?.filter((order: any) => order.status === "processing" || order.status === "pending").length || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {orders?.filter((order: any) => order.status === "pending").length || 0} pending, {orders?.filter((order: any) => order.status === "processing").length || 0} processing
                </p>
              </div>
              <ShoppingCart className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders Shipped</p>
                <h3 className="text-2xl font-bold mt-1">
                  {orders?.filter((order: any) => order.status === "shipped").length || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </div>
              <Truck className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders Delivered</p>
                <h3 className="text-2xl font-bold mt-1">
                  {orders?.filter((order: any) => order.status === "delivered").length || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Returns</p>
                <h3 className="text-2xl font-bold mt-1">
                  {orders?.filter((order: any) => order.status === "returned").length || 0}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </div>
              <Package className="h-10 w-10 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Orders</h2>
            </div>
            
            {/* Filters and Search */}
            <div className="p-4 border-b flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Order List */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredOrders?.length > 0 ? (
                <div className="divide-y">
                  {filteredOrders.map((order: any) => {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    
                    const orderDate = new Date(order.updatedAt);
                    const isNew = orderDate > yesterday;
                    
                    return (
                      <div
                        key={order.id}
                        className={`p-4 cursor-pointer hover:bg-accent transition-colors duration-200 ${selectedOrderId === order.id ? 'bg-accent' : ''}`}
                        onClick={() => handleOrderSelect(order.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{order.orderNumber}</p>
                              {isNew && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{formatDate(order.orderDate)}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No orders found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="lg:col-span-2">
          {!selectedOrderId ? (
            <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-lg border">
              <div className="text-center p-8">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No order selected</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Select an order from the list to view its details and manage fulfillment
                </p>
              </div>
            </div>
          ) : orderDetailsLoading ? (
            <div className="h-[400px] flex items-center justify-center bg-card rounded-lg border">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading order details...</p>
              </div>
            </div>
          ) : orderDetailsError ? (
            <div className="h-[400px] flex items-center justify-center bg-destructive/10 rounded-lg border">
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-destructive">Failed to load order details</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (selectedOrderId) {
                      queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrderId] });
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Order #{orderDetails.order.orderNumber}</CardTitle>
                      <CardDescription>Placed on {formatDate(orderDetails.order.orderDate)}</CardDescription>
                    </div>
                    <div>
                      {getStatusBadge(orderDetails.order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Customer Information</h4>
                          <p className="font-medium">{orderDetails.order.customerName}</p>
                          <p className="text-sm">{orderDetails.order.customerEmail}</p>
                          {orderDetails.order.customerPhone && (
                            <p className="text-sm">{orderDetails.order.customerPhone}</p>
                          )}
                          {orderDetails.order.customerNotes && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Customer Notes:</p>
                              <p className="text-sm text-muted-foreground">{orderDetails.order.customerNotes}</p>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                          <p className="text-sm">{orderDetails.order.shippingAddress}</p>
                          <p className="text-sm">
                            {orderDetails.order.shippingCity}, {orderDetails.order.shippingState} {orderDetails.order.shippingZip}
                          </p>
                          <p className="text-sm">{orderDetails.order.shippingCountry}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Order Summary</h4>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">Subtotal</p>
                            <p className="text-sm font-medium">{formatCurrency(orderDetails.order.subtotal || "0.00")}</p>
                          </div>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">Shipping</p>
                            <p className="text-sm font-medium">{formatCurrency(orderDetails.order.shippingCost || "0.00")}</p>
                          </div>
                          {orderDetails.order.taxAmount && (
                            <div className="flex justify-between mb-1">
                              <p className="text-sm">Tax</p>
                              <p className="text-sm font-medium">{formatCurrency(orderDetails.order.taxAmount)}</p>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t">
                            <p className="text-sm font-medium">Total</p>
                            <p className="text-sm font-bold">{formatCurrency(orderDetails.order.totalAmount)}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Payment Information</h4>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">Status</p>
                            <Badge variant={orderDetails.order.paymentStatus === "paid" ? "success" : "outline"}>
                              {orderDetails.order.paymentStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between mb-1">
                            <p className="text-sm">Method</p>
                            <p className="text-sm">{orderDetails.order.paymentMethod || "Credit Card"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="text-base font-medium mb-4">Order Items</h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orderDetails.items?.map((item: any) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {item.imageUrl ? (
                                    <div className="h-10 w-10 rounded-md border overflow-hidden">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
                                        className="h-full w-full object-cover" 
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center">
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.sku && (
                                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.total || (Number(item.price) * item.quantity).toString())}</TableCell>
                            </TableRow>
                          ))}
                          {!orderDetails.items?.length && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6">
                                <p className="text-muted-foreground">No items in this order</p>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* Fulfillment Information */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium">Fulfillment</h3>
                      {(orderDetails.order.status === "pending" || orderDetails.order.status === "processing") && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setSelectedOrderId(orderDetails.order.id);
                            setIsCreateShipmentOpen(true);
                          }}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Create Shipment
                        </Button>
                      )}
                    </div>
                    
                    {orderDetails.shipments?.length > 0 ? (
                      <div className="space-y-4">
                        {orderDetails.shipments.map((shipment: any) => (
                          <div key={shipment.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">Shipment #{shipment.id}</h4>
                                  {getStatusBadge(shipment.status)}
                                </div>
                                <p className="text-sm">
                                  Carrier: <span className="font-medium">{shipment.carrier}</span>
                                </p>
                                {shipment.trackingNumber && (
                                  <p className="text-sm mt-1">
                                    Tracking #: <span className="font-medium">{shipment.trackingNumber}</span>
                                  </p>
                                )}
                                {shipment.shippedAt && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Shipped on {formatDate(shipment.shippedAt)}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {shipment.trackingNumber ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => openPrintDialog(shipment, orderDetails.order)}
                                  >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print Label
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    onClick={() => {
                                      setSelectedShipmentId(shipment.id);
                                      setIsGenerateLabelOpen(true);
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Label
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-md p-6 text-center">
                        <div className="flex flex-col items-center">
                          <Package className="h-10 w-10 text-muted-foreground/50 mb-4" />
                          <h4 className="text-base font-medium">No shipments yet</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Create a shipment to fulfill this order
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-6 border-t">
                  <div className="flex gap-2">
                    <Select
                      value={orderDetails.order.status}
                      onValueChange={(value) => handleStatusChange(orderDetails.order.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Order Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/orders", selectedOrderId] });
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleStatusChange(orderDetails.order.id, "canceled")}
                          >
                            Yes, cancel order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Shipment Dialog */}
      <Dialog open={isCreateShipmentOpen} onOpenChange={setIsCreateShipmentOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Shipment</DialogTitle>
            <DialogDescription>
              Enter shipment details to create a new shipment for this order.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateShipment}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier">Shipping Carrier</Label>
                  <Select name="carrier" defaultValue="usps">
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Shipping Method</Label>
                  <Select name="shippingMethod" defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">Express</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="packageWeight">Package Weight (lbs)</Label>
                  <Input
                    id="packageWeight"
                    name="packageWeight"
                    type="number"
                    step="0.1"
                    defaultValue="1.0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                  <Input
                    id="shippingCost"
                    name="shippingCost"
                    type="number"
                    step="0.01"
                    defaultValue="5.99"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Package Dimensions (inches)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length" className="text-xs">Length</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      step="0.1"
                      defaultValue="12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-xs">Width</Label>
                    <Input
                      id="width"
                      name="width"
                      type="number"
                      step="0.1"
                      defaultValue="9"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      step="0.1"
                      defaultValue="6"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Shipment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Generate Label Dialog component */}
      <GenerateLabelDialog
        isOpen={isGenerateLabelOpen}
        onClose={() => setIsGenerateLabelOpen(false)}
        shipmentId={selectedShipmentId}
        onSubmit={handleGenerateLabel}
      />
      
      {/* Print Label Dialog component */}
      <PrintLabelDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        labelData={selectedLabelData}
        onPrint={printLabel}
        onViewLabel={viewShippingLabel}
      />
    </DashboardLayout>
  );
}