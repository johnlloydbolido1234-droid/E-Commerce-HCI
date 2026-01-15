import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Heart, ArrowRight, Truck, RotateCcw, Shield, Leaf, Instagram, Twitter, Facebook, Mail, Filter, SlidersHorizontal, Grid3X3, LayoutList, Minus, Plus, Share2, ShieldCheck, ChevronLeft, Trash2, Check, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// ==================== DATA ====================
const products: Product[] = [
  { id: 1, name: "Classic Cotton Tee", price: 45, originalPrice: 60, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop", category: "Tops", description: "A timeless essential crafted from 100% organic cotton. Soft, breathable, and perfect for everyday wear.", rating: 4.8, reviews: 124, inStock: true, sizes: ["XS", "S", "M", "L", "XL"], colors: ["White", "Black", "Navy", "Sage"] },
  { id: 2, name: "Linen Blend Blazer", price: 185, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop", category: "Outerwear", description: "Elevate any outfit with this sophisticated linen-blend blazer.", rating: 4.9, reviews: 89, inStock: true, sizes: ["S", "M", "L", "XL"], colors: ["Sand", "Charcoal"] },
  { id: 3, name: "High-Rise Slim Jeans", price: 98, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop", category: "Bottoms", description: "The perfect everyday jean with a flattering high-rise silhouette.", rating: 4.7, reviews: 256, inStock: true, sizes: ["24", "25", "26", "27", "28", "29", "30", "31", "32"], colors: ["Indigo", "Black", "Light Wash"] },
  { id: 4, name: "Cashmere V-Neck Sweater", price: 220, originalPrice: 280, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop", category: "Tops", description: "Pure luxury in every stitch. This 100% cashmere sweater features a classic V-neck design.", rating: 4.9, reviews: 67, inStock: true, sizes: ["XS", "S", "M", "L"], colors: ["Camel", "Cream", "Burgundy"] },
  { id: 5, name: "Leather Crossbody Bag", price: 165, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop", category: "Accessories", description: "Handcrafted from full-grain Italian leather.", rating: 4.8, reviews: 142, inStock: true, colors: ["Cognac", "Black", "Olive"] },
  { id: 6, name: "Wool Overcoat", price: 350, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop", category: "Outerwear", description: "A statement piece for the colder months.", rating: 4.9, reviews: 45, inStock: true, sizes: ["S", "M", "L", "XL"], colors: ["Camel", "Black"] },
  { id: 7, name: "Silk Midi Skirt", price: 145, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=600&h=800&fit=crop", category: "Bottoms", description: "Fluid silk construction creates elegant movement.", rating: 4.6, reviews: 78, inStock: true, sizes: ["XS", "S", "M", "L"], colors: ["Champagne", "Navy", "Forest"] },
  { id: 8, name: "Minimalist Watch", price: 195, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop", category: "Accessories", description: "Clean lines meet precise Japanese movement.", rating: 4.8, reviews: 203, inStock: true, colors: ["Silver/Tan", "Gold/Black", "Rose Gold/Blush"] },
  { id: 9, name: "Organic Cotton Dress", price: 128, originalPrice: 160, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop", category: "Dresses", description: "Effortless elegance in certified organic cotton.", rating: 4.7, reviews: 91, inStock: true, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Terracotta", "Stone", "Black"] },
  { id: 10, name: "Suede Ankle Boots", price: 245, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop", category: "Shoes", description: "Italian suede construction with a stacked wooden heel.", rating: 4.9, reviews: 118, inStock: true, sizes: ["36", "37", "38", "39", "40", "41"], colors: ["Tan", "Black", "Olive"] },
  { id: 11, name: "Merino Wool Scarf", price: 75, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=800&fit=crop", category: "Accessories", description: "Luxuriously soft merino wool scarf.", rating: 4.7, reviews: 64, inStock: true, colors: ["Oatmeal", "Charcoal", "Rust"] },
  { id: 12, name: "Relaxed Linen Pants", price: 110, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop", category: "Bottoms", description: "Breathable linen pants with an easy, relaxed fit.", rating: 4.6, reviews: 87, inStock: true, sizes: ["XS", "S", "M", "L", "XL"], colors: ["Natural", "Olive", "Navy"] },
];

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Dresses", "Shoes", "Accessories"];

// ==================== CART CONTEXT ====================
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return updated;
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) toast.info(`${item.name} removed from cart`);
      return prev.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)));
  }, []);

  const clearCart = useCallback(() => { setItems([]); toast.info("Cart cleared"); }, []);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// ==================== NAVBAR ====================
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/products" },
  { name: "New Arrivals", path: "/products?category=new" },
  { name: "Sale", path: "/products?category=sale" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link to="/" className="font-serif text-xl md:text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity">LLOYDIE</Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={cn("text-sm font-medium transition-colors hover:text-primary relative py-1", location.pathname === link.path ? "text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground")}>{link.name}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Search"><Search className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Account"><User className="h-5 w-5" /></Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label={`Shopping cart with ${totalItems} items`}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium animate-scale-in">{totalItems}</span>}
              </Button>
            </Link>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (<Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={cn("text-base font-medium transition-colors py-2", location.pathname === link.path ? "text-foreground" : "text-muted-foreground")}>{link.name}</Link>))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// ==================== FOOTER ====================
const footerLinks = {
  shop: [{ name: "New Arrivals", path: "/products" }, { name: "Best Sellers", path: "/products" }, { name: "Sale", path: "/products" }, { name: "All Products", path: "/products" }],
  help: [{ name: "Contact Us", path: "#" }, { name: "Shipping Info", path: "#" }, { name: "Returns", path: "#" }, { name: "FAQ", path: "#" }],
  about: [{ name: "Our Story", path: "#" }, { name: "Sustainability", path: "#" }, { name: "Careers", path: "#" }, { name: "Press", path: "#" }],
};

const Footer = () => (
  <footer className="bg-secondary/50 border-t border-border mt-auto">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">LLOYDIE</Link>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm">Curated essentials for the modern wardrobe. Timeless design meets conscious craftsmanship.</p>
          <div className="mt-6">
            <h4 className="font-medium text-sm mb-3">Subscribe to our newsletter</h4>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="Enter your email" className="max-w-xs" aria-label="Email for newsletter" />
              <Button type="submit" size="icon" aria-label="Subscribe"><Mail className="h-4 w-4" /></Button>
            </form>
          </div>
        </div>
        <div><h4 className="font-medium text-sm mb-4">Shop</h4><ul className="space-y-3">{footerLinks.shop.map((link) => (<li key={link.name}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.name}</Link></li>))}</ul></div>
        <div><h4 className="font-medium text-sm mb-4">Help</h4><ul className="space-y-3">{footerLinks.help.map((link) => (<li key={link.name}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.name}</Link></li>))}</ul></div>
        <div><h4 className="font-medium text-sm mb-4">About</h4><ul className="space-y-3">{footerLinks.about.map((link) => (<li key={link.name}><Link to={link.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.name}</Link></li>))}</ul></div>
      </div>
      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Lloydie. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
        </div>
      </div>
    </div>
  </footer>
);

// ==================== LAYOUT ====================
const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// ==================== PRODUCT CARD ====================
const ProductCard = ({ product, className }: { product: Product; className?: string }) => {
  const { addToCart } = useCart();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  return (
    <article className={cn("group relative flex flex-col bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-card-hover", className)}>
      <Link to={`/products/${product.id}`} className="relative aspect-[3/4] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && <Badge variant="destructive" className="text-xs font-medium">-{discountPercent}%</Badge>}
          {!product.inStock && <Badge variant="secondary" className="text-xs font-medium">Sold Out</Badge>}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full shadow-md" aria-label="Add to wishlist"><Heart className="h-4 w-4" /></Button>
        </div>
        {product.inStock && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }} className="w-full gap-2" size="sm"><ShoppingBag className="h-4 w-4" />Quick Add</Button>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
        <Link to={`/products/${product.id}`}><h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">{product.name}</h3></Link>
        <div className="flex items-center gap-1 text-sm"><span className="text-primary">★</span><span className="text-muted-foreground">{product.rating} ({product.reviews})</span></div>
        <div className="flex items-center gap-2 mt-1"><span className="font-semibold">${product.price}</span>{hasDiscount && <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>}</div>
      </div>
    </article>
  );
};

// ==================== HOME PAGE COMPONENTS ====================
const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-secondary via-background to-accent/30">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl animate-fade-in">
          <span className="inline-block text-sm font-medium text-primary mb-4 tracking-wider uppercase">New Season Collection</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight text-foreground mb-6">Timeless Style, <span className="text-primary">Conscious</span> Craft</h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">Discover our curated collection of elevated essentials designed to last. Each piece thoughtfully crafted with premium materials and timeless silhouettes.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/products"><Button size="lg" className="gap-2 text-base px-8">Shop Collection<ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/products"><Button variant="outline" size="lg" className="text-base px-8">View Lookbook</Button></Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
            <div><p className="text-2xl font-serif font-semibold">15K+</p><p className="text-sm text-muted-foreground">Happy Customers</p></div>
            <div><p className="text-2xl font-serif font-semibold">500+</p><p className="text-sm text-muted-foreground">5-Star Reviews</p></div>
            <div><p className="text-2xl font-serif font-semibold">100%</p><p className="text-sm text-muted-foreground">Sustainable</p></div>
          </div>
        </div>
        <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop" alt="Fashion model" className="w-full h-full object-cover rounded-2xl shadow-2xl" />
          <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-card max-w-[200px]">
            <p className="text-sm font-medium mb-1">Featured Item</p>
            <p className="font-serif text-lg">Cashmere Sweater</p>
            <p className="text-primary font-semibold mt-2">$220</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [{ icon: Truck, title: "Free Shipping", description: "On orders over $100" }, { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" }, { icon: Shield, title: "Secure Payment", description: "100% secure checkout" }, { icon: Leaf, title: "Sustainable", description: "Eco-friendly packaging" }];
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((f) => (<div key={f.title} className="flex flex-col items-center text-center gap-3"><div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><f.icon className="h-5 w-5 text-primary" /></div><div><h3 className="font-medium text-foreground">{f.title}</h3><p className="text-sm text-muted-foreground">{f.description}</p></div></div>))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts = () => (
  <section className="py-16 md:py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div><span className="text-sm font-medium text-primary mb-2 block tracking-wider uppercase">Curated Selection</span><h2 className="text-3xl md:text-4xl font-serif font-semibold">Best Sellers</h2></div>
        <Link to="/products"><Button variant="ghost" className="gap-2">View All Products<ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{products.slice(0, 4).map((product, i) => (<div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}><ProductCard product={product} /></div>))}</div>
    </div>
  </section>
);

const Categories = () => {
  const cats = [{ name: "Tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop", count: 24 }, { name: "Bottoms", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=800&fit=crop", count: 18 }, { name: "Outerwear", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop", count: 12 }, { name: "Accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=800&fit=crop", count: 32 }];
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12"><span className="text-sm font-medium text-primary mb-2 block tracking-wider uppercase">Browse By</span><h2 className="text-3xl md:text-4xl font-serif font-semibold">Shop Categories</h2></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cats.map((cat, i) => (<Link key={cat.name} to={`/products?category=${cat.name}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}><img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground"><h3 className="font-serif text-xl md:text-2xl font-semibold mb-1">{cat.name}</h3><div className="flex items-center justify-between"><p className="text-sm opacity-80">{cat.count} items</p><ArrowRight className="h-5 w-5 transform translate-x-0 group-hover:translate-x-2 transition-transform" /></div></div></Link>))}
        </div>
      </div>
    </section>
  );
};

// ==================== PAGES ====================
const IndexPage = () => (<Layout><Hero /><Features /><FeaturedProducts /><Categories /></Layout>);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "newest": result.sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [selectedCategory, sortBy, priceRange]);

  const handleCategoryChange = (category: string) => { setSelectedCategory(category); if (category === "All") searchParams.delete("category"); else searchParams.set("category", category); setSearchParams(searchParams); };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8"><h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">{selectedCategory === "All" ? "All Products" : selectedCategory}</h1><p className="text-muted-foreground">{filteredProducts.length} products</p></div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="hidden lg:flex items-center gap-2">{categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? "default" : "ghost"} size="sm" onClick={() => handleCategoryChange(cat)}>{cat}</Button>))}</div>
          <Sheet><SheetTrigger asChild><Button variant="outline" size="sm" className="lg:hidden gap-2"><Filter className="h-4 w-4" />Filters</Button></SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6 space-y-6"><div><h3 className="font-medium mb-3">Category</h3><div className="flex flex-col gap-2">{categories.map((cat) => (<Button key={cat} variant={selectedCategory === cat ? "default" : "ghost"} size="sm" className="justify-start" onClick={() => handleCategoryChange(cat)}>{cat}</Button>))}</div></div><div><h3 className="font-medium mb-3">Price Range</h3><Slider value={priceRange} onValueChange={setPriceRange} max={400} step={10} className="mb-2" /><div className="flex justify-between text-sm text-muted-foreground"><span>${priceRange[0]}</span><span>${priceRange[1]}</span></div></div></div></SheetContent></Sheet>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3"><SlidersHorizontal className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Price:</span><div className="w-32"><Slider value={priceRange} onValueChange={setPriceRange} max={400} step={10} /></div><span className="text-sm text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span></div>
            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent><SelectItem value="featured">Featured</SelectItem><SelectItem value="newest">Newest</SelectItem><SelectItem value="price-low">Price: Low to High</SelectItem><SelectItem value="price-high">Price: High to Low</SelectItem><SelectItem value="rating">Top Rated</SelectItem></SelectContent></Select>
            <div className="hidden md:flex items-center gap-1 border border-border rounded-md"><Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}><Grid3X3 className="h-4 w-4" /></Button><Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}><LayoutList className="h-4 w-4" /></Button></div>
          </div>
        </div>
        {filteredProducts.length > 0 ? (<div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>{filteredProducts.map((product, i) => (<div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}><ProductCard product={product} /></div>))}</div>) : (<div className="text-center py-16"><p className="text-lg text-muted-foreground mb-4">No products found</p><Button onClick={() => handleCategoryChange("All")}>View All Products</Button></div>)}
      </div>
    </Layout>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return (<Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-serif mb-4">Product Not Found</h1><Button onClick={() => navigate("/products")}>Back to Shop</Button></div></Layout>);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6"><ol className="flex items-center gap-2 text-sm"><li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li><li className="text-muted-foreground">/</li><li><Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">Products</Link></li><li className="text-muted-foreground">/</li><li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li></ol></nav>
        <Button variant="ghost" size="sm" className="mb-4 md:hidden gap-1" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" />Back</Button>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-secondary"><img src={product.image} alt={product.name} className="w-full h-full object-cover" /></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-3"><Badge variant="secondary" className="uppercase text-xs tracking-wider">{product.category}</Badge><div className="flex items-center gap-1 text-sm"><span className="text-primary">★</span><span>{product.rating}</span><span className="text-muted-foreground">({product.reviews} reviews)</span></div></div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6"><span className="text-2xl font-semibold">${product.price}</span>{hasDiscount && <><span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span><Badge variant="destructive">Sale</Badge></>}</div>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>
            {product.colors && product.colors.length > 0 && (<div className="mb-6"><p className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground">{selectedColor}</span></p><div className="flex gap-2">{product.colors.map((color) => (<button key={color} onClick={() => setSelectedColor(color)} className={cn("px-4 py-2 text-sm border rounded-md transition-all", selectedColor === color ? "border-primary bg-primary/5" : "border-border hover:border-foreground/50")}>{color}</button>))}</div></div>)}
            {product.sizes && product.sizes.length > 0 && (<div className="mb-6"><div className="flex items-center justify-between mb-3"><p className="text-sm font-medium">Size: <span className="text-muted-foreground">{selectedSize}</span></p><button className="text-sm text-primary hover:underline">Size Guide</button></div><div className="flex flex-wrap gap-2">{product.sizes.map((size) => (<button key={size} onClick={() => setSelectedSize(size)} className={cn("min-w-[48px] h-10 px-3 text-sm border rounded-md transition-all", selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground/50")}>{size}</button>))}</div></div>)}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-border rounded-md"><Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="h-4 w-4" /></Button><span className="w-12 text-center font-medium">{quantity}</span><Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="h-4 w-4" /></Button></div>
              <Button className="flex-1 sm:max-w-xs" size="lg" onClick={() => addToCart(product, quantity, selectedSize, selectedColor)} disabled={!product.inStock}>{product.inStock ? "Add to Cart" : "Sold Out"}</Button>
              <Button variant="outline" size="icon" className="h-12 w-12"><Heart className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" className="h-12 w-12"><Share2 className="h-5 w-5" /></Button>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg"><div className="flex flex-col items-center text-center gap-1"><Truck className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">Free Shipping</span></div><div className="flex flex-col items-center text-center gap-1"><RotateCcw className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">30-Day Returns</span></div><div className="flex flex-col items-center text-center gap-1"><ShieldCheck className="h-5 w-5 text-primary" /><span className="text-xs text-muted-foreground">2-Year Warranty</span></div></div>
          </div>
        </div>
        <Tabs defaultValue="details" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0"><TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Details</TabsTrigger><TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Shipping & Returns</TabsTrigger><TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Reviews ({product.reviews})</TabsTrigger></TabsList>
          <TabsContent value="details" className="pt-6"><p className="text-muted-foreground">{product.description}</p><ul className="mt-4 space-y-2 text-muted-foreground"><li>Premium quality materials</li><li>Sustainably sourced and ethically made</li><li>Machine washable</li></ul></TabsContent>
          <TabsContent value="shipping" className="pt-6"><div className="space-y-4 text-muted-foreground"><p><strong className="text-foreground">Free Standard Shipping</strong> on orders over $100</p><p>Standard delivery: 5-7 business days</p><p><strong className="text-foreground">Returns</strong></p><p>Free returns within 30 days of purchase.</p></div></TabsContent>
          <TabsContent value="reviews" className="pt-6"><div className="text-center py-8 text-muted-foreground"><p>Reviews are not available in this demo.</p></div></TabsContent>
        </Tabs>
        {relatedProducts.length > 0 && (<section><h2 className="text-2xl font-serif font-semibold mb-6">You May Also Like</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{relatedProducts.map((p) => (<ProductCard key={p.id} product={p} />))}</div></section>)}
      </div>
    </Layout>
  );
};

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) return (<Layout><div className="container mx-auto px-4 py-16 md:py-24 text-center"><div className="max-w-md mx-auto"><div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6"><ShoppingBag className="h-12 w-12 text-muted-foreground" /></div><h1 className="text-2xl font-serif font-semibold mb-3">Your cart is empty</h1><p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p><Link to="/products"><Button size="lg" className="gap-2">Start Shopping<ArrowRight className="h-4 w-4" /></Button></Link></div></div></Layout>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8"><div><h1 className="text-3xl md:text-4xl font-serif font-semibold">Shopping Cart</h1><p className="text-muted-foreground mt-1">{totalItems} {totalItems === 1 ? "item" : "items"}</p></div><Button variant="ghost" onClick={() => navigate(-1)} className="gap-1"><ChevronLeft className="h-4 w-4" />Continue Shopping</Button></div>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2"><div className="space-y-6">{items.map((item) => (<article key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 md:gap-6 p-4 bg-card rounded-lg shadow-card"><Link to={`/products/${item.id}`} className="shrink-0"><img src={item.image} alt={item.name} className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-md" /></Link><div className="flex-1 flex flex-col"><div className="flex justify-between gap-2"><div><Link to={`/products/${item.id}`}><h3 className="font-medium hover:text-primary transition-colors">{item.name}</h3></Link><p className="text-sm text-muted-foreground mt-1">{item.selectedColor && <span>{item.selectedColor}</span>}{item.selectedColor && item.selectedSize && <span> / </span>}{item.selectedSize && <span>Size {item.selectedSize}</span>}</p></div><p className="font-semibold">${item.price * item.quantity}</p></div><div className="mt-auto flex items-center justify-between pt-4"><div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus className="h-3 w-3" /></Button><span className="w-8 text-center text-sm font-medium">{item.quantity}</span><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button></div><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1" onClick={() => removeFromCart(item.id)}><Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Remove</span></Button></div></div></article>))}</div></div>
          <div className="lg:col-span-1"><div className="sticky top-24 bg-card rounded-lg p-6 shadow-card"><h2 className="text-lg font-semibold mb-4">Order Summary</h2><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div></div>{shipping > 0 && <p className="text-xs text-muted-foreground mt-3 p-3 bg-secondary rounded-md">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>}<Separator className="my-4" /><div className="flex justify-between font-semibold text-lg mb-6"><span>Total</span><span>${total.toFixed(2)}</span></div><Link to="/checkout" className="block"><Button className="w-full" size="lg">Proceed to Checkout</Button></Link><p className="text-xs text-center text-muted-foreground mt-4">Secure checkout</p></div></div>
        </div>
      </div>
    </Layout>
  );
};

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const shipping = shippingMethod === "express" ? 15 : subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); clearCart(); toast.success("Order placed successfully!"); navigate("/"); }, 2000); };

  if (items.length === 0) return (<Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-serif mb-4">Your cart is empty</h1><Link to="/products"><Button>Continue Shopping</Button></Link></div></Layout>);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8"><Link to="/cart"><Button variant="ghost" size="sm" className="gap-1 mb-4"><ChevronLeft className="h-4 w-4" />Back to Cart</Button></Link><h1 className="text-3xl md:text-4xl font-serif font-semibold">Checkout</h1></div>
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">{["Shipping", "Payment", "Review"].map((label, i) => (<div key={label} className="flex items-center gap-2"><div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? "bg-success text-success-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{step > i + 1 ? <Check className="h-4 w-4" /> : i + 1}</div><span className={`text-sm whitespace-nowrap ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>{i < 2 && <div className="w-12 h-0.5 bg-border" />}</div>))}</div>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            {step === 1 && (<div className="space-y-6 animate-fade-in"><div><h2 className="text-xl font-semibold mb-4">Contact Information</h2><div className="space-y-4"><div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" className="mt-1" /></div></div></div><Separator /><div><h2 className="text-xl font-semibold mb-4">Shipping Address</h2><div className="grid gap-4"><div className="grid grid-cols-2 gap-4"><div><Label htmlFor="firstName">First Name</Label><Input id="firstName" placeholder="John" className="mt-1" /></div><div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" placeholder="Doe" className="mt-1" /></div></div><div><Label htmlFor="address">Address</Label><Input id="address" placeholder="123 Main Street" className="mt-1" /></div><div className="grid grid-cols-2 md:grid-cols-3 gap-4"><div><Label htmlFor="city">City</Label><Input id="city" placeholder="New York" className="mt-1" /></div><div><Label htmlFor="state">State</Label><Input id="state" placeholder="NY" className="mt-1" /></div><div><Label htmlFor="zip">ZIP</Label><Input id="zip" placeholder="10001" className="mt-1" /></div></div></div></div><Separator /><div><h2 className="text-xl font-semibold mb-4">Shipping Method</h2><RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3"><label htmlFor="standard" className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${shippingMethod === "standard" ? "border-primary bg-primary/5" : "border-border"}`}><div className="flex items-center gap-3"><RadioGroupItem value="standard" id="standard" /><div><p className="font-medium">Standard Shipping</p><p className="text-sm text-muted-foreground">5-7 business days</p></div></div><span className="font-medium">{subtotal >= 100 ? "Free" : "$10.00"}</span></label><label htmlFor="express" className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${shippingMethod === "express" ? "border-primary bg-primary/5" : "border-border"}`}><div className="flex items-center gap-3"><RadioGroupItem value="express" id="express" /><div><p className="font-medium">Express Shipping</p><p className="text-sm text-muted-foreground">2-3 business days</p></div></div><span className="font-medium">$15.00</span></label></RadioGroup></div><Button onClick={() => setStep(2)} className="w-full md:w-auto" size="lg">Continue to Payment</Button></div>)}
            {step === 2 && (<div className="space-y-6 animate-fade-in"><div><h2 className="text-xl font-semibold mb-4">Payment Method</h2><div className="p-4 border border-primary rounded-lg bg-primary/5 flex items-center gap-3 mb-6"><CreditCard className="h-5 w-5 text-primary" /><span className="font-medium">Credit / Debit Card</span></div><div className="space-y-4"><div><Label htmlFor="cardName">Name on Card</Label><Input id="cardName" placeholder="John Doe" className="mt-1" /></div><div><Label htmlFor="cardNumber">Card Number</Label><Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" /></div><div className="grid grid-cols-2 gap-4"><div><Label htmlFor="expiry">Expiry</Label><Input id="expiry" placeholder="MM/YY" className="mt-1" /></div><div><Label htmlFor="cvv">CVV</Label><Input id="cvv" placeholder="123" type="password" className="mt-1" /></div></div></div></div><div className="flex items-center gap-2 text-sm text-muted-foreground p-4 bg-secondary rounded-lg"><Lock className="h-4 w-4" /><span>Your payment is encrypted and secure</span></div><div className="flex gap-4"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)} size="lg">Review Order</Button></div></div>)}
            {step === 3 && (<div className="space-y-6 animate-fade-in"><h2 className="text-xl font-semibold">Review Your Order</h2><div className="space-y-4">{items.map((item) => (<div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-4 bg-card rounded-lg"><img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" /><div className="flex-1"><h3 className="font-medium">{item.name}</h3><p className="text-sm text-muted-foreground">Qty: {item.quantity}{item.selectedSize && ` • Size ${item.selectedSize}`}</p></div><p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p></div>))}</div><div className="flex gap-4"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={handlePlaceOrder} size="lg" disabled={isProcessing}>{isProcessing ? "Processing..." : "Place Order"}</Button></div></div>)}
          </div>
          <div className="lg:col-span-1"><div className="sticky top-24 bg-card rounded-lg p-6 shadow-card"><h2 className="text-lg font-semibold mb-4">Order Summary</h2><div className="space-y-3 text-sm mb-4">{items.map((item) => (<div key={item.id} className="flex justify-between"><span className="text-muted-foreground">{item.name} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>))}</div><Separator className="my-4" /><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div></div><Separator className="my-4" /><div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div></div></div>
        </div>
      </div>
    </Layout>
  );
};

const NotFoundPage = () => (<Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-4xl font-serif font-semibold mb-4">404</h1><p className="text-muted-foreground mb-8">Page not found</p><Link to="/"><Button>Go Home</Button></Link></div></Layout>);

// ==================== APP ====================
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
