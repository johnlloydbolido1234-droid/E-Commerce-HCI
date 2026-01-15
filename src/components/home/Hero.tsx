import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-secondary via-background to-accent/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="max-w-xl animate-fade-in">
            <span className="inline-block text-sm font-medium text-primary mb-4 tracking-wider uppercase">
              New Season Collection
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-foreground mb-6">
              Timeless Style,{" "}
              <span className="text-primary">Conscious</span> Craft
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover our curated collection of elevated essentials designed to last. 
              Each piece thoughtfully crafted with premium materials and timeless silhouettes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="gap-2 text-base px-8">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg" className="text-base px-8">
                  View Lookbook
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-serif font-semibold">15K+</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-semibold">500+</p>
                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-semibold">100%</p>
                <p className="text-sm text-muted-foreground">Sustainable</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative h-full">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop"
                alt="Fashion model wearing elegant clothing from our collection"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card max-w-[200px]">
                <p className="text-sm font-medium mb-1">Featured Item</p>
                <p className="font-serif text-lg">Cashmere Sweater</p>
                <p className="text-primary font-semibold mt-2">$220</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
