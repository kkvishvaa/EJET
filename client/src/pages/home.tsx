import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import FlightSearchForm from "@/components/flight-search-form";
import AircraftCard from "@/components/aircraft-card";
import DestinationCard from "@/components/destination-card";
import FeatureCard from "@/components/feature-card";
import { Clock, Shield, Route, Award, Search, MapPin, CreditCard, BarChart3 } from "lucide-react";
import type { Aircraft, Destination } from "@shared/schema";

export default function Home() {
  const { data: aircraft = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft"],
  });

  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["/api/destinations/popular"],
  });

  const featuredAircraft = aircraft.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Luxury Private Jet
                  <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Charter Service
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-200 max-w-2xl">
                  Experience unparalleled luxury and convenience with our premium private jet fleet. 
                  Book your next flight in minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-secondary text-secondary-foreground px-8 py-4 text-lg font-semibold hover:bg-secondary/90 transition-all duration-200 transform hover:scale-105"
                  data-testid="button-explore-fleet"
                >
                  Explore Fleet
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-8 py-4 text-lg font-semibold hover:bg-white/20 transition-all duration-200"
                  data-testid="button-watch-video"
                >
                  Watch Video
                </Button>
              </div>
            </div>
            
            <div className="animate-scale-in">
              <FlightSearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose JetCharter
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the ultimate in luxury travel with our comprehensive private jet services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-white" />}
              title="24/7 Availability"
              description="Book flights anytime with our round-the-clock booking system and customer support."
              gradient="from-primary to-accent"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="Safety First"
              description="All aircraft undergo rigorous safety inspections and our pilots are highly experienced."
              gradient="from-secondary to-accent"
            />
            <FeatureCard
              icon={<Route className="h-8 w-8 text-white" />}
              title="Global Network"
              description="Access to thousands of airports worldwide with flexible routing options."
              gradient="from-accent to-primary"
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-white" />}
              title="Luxury Service"
              description="Premium amenities and personalized service for an unforgettable experience."
              gradient="from-primary to-secondary"
            />
          </div>
        </div>
      </section>

      {/* Aircraft Fleet */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Premium Fleet
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our carefully curated selection of luxury aircraft
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAircraft.map((jet) => (
              <AircraftCard key={jet.id} aircraft={jet} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg font-semibold hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-105"
              data-testid="button-view-complete-fleet"
            >
              View Complete Fleet
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover exclusive destinations accessed through our premium private jet service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Complete Private Aviation Solutions
                </h2>
                <p className="text-xl text-muted-foreground">
                  From flight search to real-time tracking, we provide a comprehensive platform 
                  for all your private jet travel needs.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Flight Search</h3>
                    <p className="text-muted-foreground">Filter by aircraft type, passenger count, and route preferences to find the perfect flight.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Flight Tracking</h3>
                    <p className="text-muted-foreground">Monitor your flight status with live tracking and receive updates throughout your journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Secure Payment Processing</h3>
                    <p className="text-muted-foreground">Complete your booking with confidence using our encrypted payment system.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">Access comprehensive analytics and booking history through your personal dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Professional dashboard interface"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
