import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import AnimatedElement from '@/components/AnimatedElement';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <AnimatedElement className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Lab AI Inc
              </h1>
              <p className="text-xl text-muted-foreground">
                Reach out and let's discuss how we can help bring your digital vision to life.
              </p>
            </AnimatedElement>
            
            <ContactSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}