import { useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { useLocation } from 'wouter';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing Stripe public key');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Package data with specific pricing options
const packages = {
  // Starter Site Options
  "starter-750": {
    name: "Basic Starter Package",
    price: 750,
    description: "Perfect for small businesses just getting started online."
  },
  "starter-1000": {
    name: "Enhanced Starter Package",
    price: 1000,
    description: "Perfect for small businesses just getting started online with additional features."
  },
  
  // Growth Site Options
  "growth-1500": {
    name: "Basic Growth Package",
    price: 1500,
    description: "Ideal for growing businesses with specific needs."
  },
  "growth-1750": {
    name: "Standard Growth Package",
    price: 1750,
    description: "Ideal for growing businesses with expanded features."
  },
  "growth-2000": {
    name: "Enhanced Growth Package",
    price: 2000,
    description: "Comprehensive solution for growing businesses with premium features."
  },
  
  // Pro Site Options
  "pro-2500": {
    name: "Basic Pro Package",
    price: 2500,
    description: "Advanced solution for established businesses."
  },
  "pro-3250": {
    name: "Standard Pro Package",
    price: 3250,
    description: "Comprehensive solution for established businesses with premium features."
  },
  "pro-4000": {
    name: "Premium Pro Package",
    price: 4000,
    description: "Full-featured solution for established businesses with all available features."
  },
  
  // Maintenance Plans
  "basic-49": {
    name: "Basic Maintenance Plan",
    price: 49,
    description: "Monthly maintenance with security updates and basic support."
  },
  "premium-99": {
    name: "Premium Maintenance Plan",
    price: 99,
    description: "Enhanced monthly maintenance with regular content updates."
  },
  "enterprise-199": {
    name: "Enterprise Maintenance Plan",
    price: 199,
    description: "Comprehensive monthly maintenance with unlimited updates."
  }
};

// Default to the basic starter package if no package is specified
const defaultPackage = "starter-750";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast({
        title: "Error",
        description: submitError.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/payment-success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase!",
      });
      setLocation("/payment-success");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <PaymentElement />
      <Button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full"
        size="lg"
        type="submit"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get the package and option from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packageParam = params.get("package");
    const optionParam = params.get("option");
    
    // If we have a specific option, use that
    if (optionParam && optionParam in packages) {
      setSelectedPackage(optionParam);
    } 
    // Otherwise, fallback to the general package
    else if (packageParam && packageParam in packages) {
      setSelectedPackage(packageParam);
    }
  }, []);

  // Create a payment intent as soon as the page loads
  useEffect(() => {
    const packageDetails = packages[selectedPackage as keyof typeof packages];
    
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: packageDetails.price,
        packageName: packageDetails.name
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message || "An unexpected error occurred",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [selectedPackage, toast]);

  const packageDetails = packages[selectedPackage as keyof typeof packages];
  const appearance: Appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#7c3aed',
    },
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground mb-8">Complete your purchase securely with Stripe</p>
            
            <div className="grid md:grid-cols-5 gap-8 mb-12">
              {/* Order Summary */}
              <div className="md:col-span-2 bg-card p-6 rounded-lg border border-border h-fit">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{packageDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">{packageDetails.description}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>${packageDetails.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${packageDetails.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Form */}
              <div className="md:col-span-3 bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                  </Elements>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-destructive">Unable to load payment form. Please try again later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}