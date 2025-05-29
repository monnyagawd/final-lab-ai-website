import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// Public Pages
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Packages from "./pages/packages";
import Checkout from "./pages/checkout";
import Subscribe from "./pages/subscribe";
import PaymentSuccess from "./pages/payment-success";
import ContactPage from "./pages/ContactPage";
import ScheduleConsultation from "./pages/ScheduleConsultation";
import ProductDetails from "./pages/ProductDetails";
import AuthPage from "./pages/AuthPage";
import AIPoweredDesign from "./pages/ai-powered-design";
import CustomDevelopment from "./pages/custom-development";
import HostingMaintenance from "./pages/hosting-maintenance";
import GetStarted from "./pages/GetStarted";
import Portfolio from "./pages/Portfolio";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import WebsiteTracking from "./pages/WebsiteTracking";
import WebsiteAnalytics from "./pages/WebsiteAnalytics";
import SocialMediaDashboard from "./pages/SocialMediaDashboard";
import PaymentsDashboard from "./pages/PaymentsDashboard";
import PaymentHistory from "./pages/payment-history";
import Fulfillment from "./pages/Fulfillment";
import Inventory from "./pages/Inventory";
import EcommerceDashboard from "./pages/EcommerceDashboard";
import Account from "./pages/Account";

import ChatBot from "./components/ChatBot";

// Version info for debugging
const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0";
const BUILD_DATE = new Date().toISOString();

// Log build info in non-production environments
if (import.meta.env.DEV) {
  console.info(`Lab AI - Web Application (v${APP_VERSION}, built: ${BUILD_DATE})`);
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/packages" component={Packages} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/schedule" component={ScheduleConsultation} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/ai-powered-design" component={AIPoweredDesign} />
      <Route path="/custom-development" component={CustomDevelopment} />
      <Route path="/hosting-maintenance" component={HostingMaintenance} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/portfolio" component={Portfolio} />
      
      {/* Protected Dashboard Routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/website-tracking" component={WebsiteTracking} />
      <ProtectedRoute path="/website-analytics/:id" component={WebsiteAnalytics} />
      <ProtectedRoute path="/dashboard/social-media" component={SocialMediaDashboard} />
      <ProtectedRoute path="/dashboard/ecommerce" component={EcommerceDashboard} />
      <ProtectedRoute path="/dashboard/payments" component={PaymentsDashboard} />
      <ProtectedRoute path="/dashboard/payment-history" component={PaymentHistory} />
      <ProtectedRoute path="/dashboard/fulfillment" component={Fulfillment} />
      <ProtectedRoute path="/dashboard/inventory" component={Inventory} />
      <ProtectedRoute path="/dashboard/account" component={Account} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
          <ChatBot />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
