import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

// Public Pages
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ChatBot from "./components/ChatBot";

// Static Dashboard Pages for Netlify deployment
import StaticWebsiteAnalytics from "./pages/StaticWebsiteAnalytics";

// Version info for debugging
const APP_VERSION = "1.0.0-static";
const BUILD_DATE = new Date().toISOString();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about-us" component={AboutUs} />
      
      {/* Static Demo Routes */}
      <Route path="/website-analytics/demo" component={StaticWebsiteAnalytics} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function StaticApp() {
  return (
    <ErrorBoundary>
      <Router />
      <Toaster />
      <ChatBot />
    </ErrorBoundary>
  );
}

export default StaticApp;