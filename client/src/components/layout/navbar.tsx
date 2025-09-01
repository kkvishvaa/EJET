import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plane, Menu } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/jets", label: "Jets" },
    { href: "/search", label: "Search" },
    { href: "/track", label: "Track" },
    { href: "/deals", label: "Deals" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href}>
      <button
        className={`font-medium transition-colors duration-200 ${
          location === href
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
        data-testid={`nav-link-${label.toLowerCase()}`}
      >
        {label}
      </button>
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer">
                <Plane className="inline mr-2 h-8 w-8 text-primary" />
                EcoJets
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-book-now"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <button
                        className={`w-full text-left py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                          location === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                        onClick={() => setIsOpen(false)}
                        data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </button>
                    </Link>
                  ))}
                  <Button
                    className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="mobile-button-book-now"
                  >
                    Book Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
