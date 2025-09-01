import { Plane, Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <Plane className="inline mr-2 h-6 w-6" />
              JetCharter
            </h3>
            <p className="text-primary-foreground/80 max-w-xs">
              Your premier destination for luxury private jet charter services worldwide.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Flight Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Aircraft Fleet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Flight Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Empty Leg Deals
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Safety Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5" />
                <span>info@jetcharter.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 JetCharter. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
