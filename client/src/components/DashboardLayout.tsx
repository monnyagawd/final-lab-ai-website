import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Bell,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Share2,
  User,
  X,
  CreditCard,
  Globe,
  ExternalLink,
  Package,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Website Analytics",
      icon: <LineChart className="h-5 w-5" />,
      href: "/website-tracking",
    },
    {
      title: "Social Media",
      icon: <Share2 className="h-5 w-5" />,
      href: "/dashboard/social-media",
    },
    {
      title: "E-commerce",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/dashboard/ecommerce",
    },
    {
      title: "Balance",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/payments",
    },
    {
      title: "Fulfillment",
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/fulfillment",
    },
    {
      title: "Inventory",
      icon: <Package className="h-5 w-5" />,
      href: "/dashboard/inventory",
    },
    {
      title: "My Website",
      icon: <Globe className="h-5 w-5" />,
      href: "/dashboard/website",
    },
    {
      title: "Account",
      icon: <User className="h-5 w-5" />,
      href: "/dashboard/account",
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ""}`.trim() 
    : user?.username || "User";

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 bg-card shadow-md z-10">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="font-bold text-xl text-primary">Lab AI</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-background border-b sticky top-0 z-10">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="font-bold text-xl text-primary">Lab AI</span>
          </div>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-2">
                <span className="font-bold text-xl text-primary">Lab AI</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Separator className="my-2" />
              <nav className="flex-1">
                <div className="space-y-1 py-4">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          location === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="py-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Content area */}
      <div className="md:pl-64">
        {/* Top bar with user info */}
        <div className="hidden md:flex justify-between items-center bg-background p-4 border-b sticky top-0 z-10">
          <div className="text-lg font-semibold">
            {navItems.find((item) => item.href === location)?.title || "Dashboard"}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium">{userName}</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-4 md:p-6">{children}</div>
      </div>

      {/* User has a website section */}
      {user?.websiteUrl && (
        <div className="fixed bottom-4 right-4 z-20">
          <div className="bg-card shadow-lg rounded-lg p-4 flex items-center space-x-3">
            <div>
              <p className="text-sm font-medium">Your website is live</p>
              <p className="text-xs text-muted-foreground">{user.websiteUrl}</p>
            </div>
            <Button size="sm" variant="default" asChild>
              <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}