import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-background pt-8 pb-4 border-t border-border">
      <div className="container mx-auto px-4">

        
        <div className="flex flex-col md:flex-row justify-center items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2025 Lab AI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
