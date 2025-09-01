import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AircraftCard from "@/components/aircraft-card";
import WeatherWidget from "@/components/weather-widget";
import { Percent, Clock, MapPin, Plane, TrendingDown, Star, Calendar } from "lucide-react";
import type { Aircraft } from "@shared/schema";

// Mock empty leg deals data structure
interface EmptyLegDeal {
  id: string;
  aircraft: Aircraft;
  departure: string;
  arrival: string;
  departureDate: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  seatsAvailable: number;
}

export default function Deals() {
  const { data: aircraft = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft"],
  });

  // Generate mock empty leg deals from available aircraft
  const emptyLegDeals: EmptyLegDeal[] = aircraft.slice(0, 6).map((jet, index) => {
    const routes = [
      { departure: "New York (JFK)", arrival: "Miami (MIA)" },
      { departure: "Los Angeles (LAX)", arrival: "Las Vegas (LAS)" },
      { departure: "Chicago (ORD)", arrival: "Aspen (ASE)" },
      { departure: "Dallas (DFW)", arrival: "Austin (AUS)" },
      { departure: "Boston (BOS)", arrival: "Nantucket (ACK)" },
      { departure: "San Francisco (SFO)", arrival: "Napa (APC)" },
    ];
    
    const route = routes[index] || routes[0];
    const originalPrice = parseFloat(jet.hourlyRate) * 3; // 3-hour flight
    const discount = 30 + (index * 10); // 30-70% discount
    const dealPrice = originalPrice * (1 - discount / 100);
    
    return {
      id: `deal-${jet.id}`,
      aircraft: jet,
      ...route,
      departureDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      originalPrice,
      dealPrice,
      discount,
      seatsAvailable: Math.floor(jet.passengers * 0.7),
    };
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Empty Leg Deals
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save up to 70% on private jet flights with our exclusive empty leg deals. 
            Book these one-way flights at incredible discounts.
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">What are Empty Leg Deals?</h3>
                <p className="text-muted-foreground">
                  Empty leg flights occur when private jets need to return to their home base or reposition for the next charter. 
                  These flights are offered at significant discounts, sometimes up to 70% off regular charter prices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flight Conditions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Current Flight Conditions
            </h2>
            <p className="text-muted-foreground">
              Check weather conditions for deal destinations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WeatherWidget 
              latitude={40.6413} 
              longitude={-73.7781} 
              location="New York (JFK)"
              className="h-fit"
            />
            <WeatherWidget 
              latitude={25.7617} 
              longitude={-80.1918} 
              location="Miami (MIA)"
              className="h-fit"
            />
            <WeatherWidget 
              latitude={36.0840} 
              longitude={-115.1537} 
              location="Las Vegas (LAS)"
              className="h-fit"
            />
          </div>
        </div>

        {/* Deals Grid */}
        {emptyLegDeals.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Plane className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Deals Available</h3>
              <p>Check back soon for new empty leg opportunities.</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {emptyLegDeals.map((deal) => (
              <Card key={deal.id} className="group overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                {/* Aircraft Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={deal.aircraft.imageUrl || "/jet1.png"}
                    alt={`${deal.aircraft.manufacturer} ${deal.aircraft.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">
                      -{deal.discount}% OFF
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      Empty Leg
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2" data-testid={`deal-aircraft-${deal.id}`}>
                    {deal.aircraft.manufacturer} {deal.aircraft.model}
                  </h3>
                  
                  {/* Route */}
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground" data-testid={`deal-route-${deal.id}`}>
                      {deal.departure} → {deal.arrival}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground" data-testid={`deal-date-${deal.id}`}>
                      {new Date(deal.departureDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through" data-testid={`deal-original-price-${deal.id}`}>
                        ${deal.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-2xl font-bold text-primary" data-testid={`deal-price-${deal.id}`}>
                        ${deal.dealPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deal.seatsAvailable} seats available
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90"
                    data-testid={`button-book-deal-${deal.id}`}
                  >
                    Book This Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't Miss Out on Future Deals</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Subscribe to our deal alerts and be the first to know about new empty leg opportunities. 
              Get exclusive access to the best private jet deals.
            </p>
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              data-testid="button-subscribe-deals"
            >
              Subscribe to Deal Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
