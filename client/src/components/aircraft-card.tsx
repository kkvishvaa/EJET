import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Navigation, Zap } from "lucide-react";
import { useLocation } from "wouter";
import type { Aircraft } from "@shared/schema";

interface AircraftCardProps {
  aircraft: Aircraft;
  onViewDetails?: (aircraft: Aircraft) => void;
  onBook?: (aircraft: Aircraft) => void;
}

const categoryColors = {
  light: "bg-secondary text-secondary-foreground",
  midsize: "bg-accent text-accent-foreground",
  heavy: "bg-primary text-primary-foreground",
  ultra: "bg-gradient-to-r from-primary to-accent text-white",
};

const categoryLabels = {
  light: "Light Jet",
  midsize: "Midsize Jet",
  heavy: "Heavy Jet",
  ultra: "Ultra Long Range",
};

export default function AircraftCard({ aircraft, onViewDetails, onBook }: AircraftCardProps) {
  const [, setLocation] = useLocation();

  const handleViewDetails = () => {
    onViewDetails?.(aircraft);
  };

  const handleBook = () => {
    if (onBook) {
      onBook(aircraft);
    } else {
      // Navigate to booking page with aircraft details
      setLocation(`/booking?aircraft=${aircraft.id}`);
    }
  };

  return (
    <Card className="group overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={aircraft.imageUrl || "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3"}
          alt={`${aircraft.manufacturer} ${aircraft.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={categoryColors[aircraft.category as keyof typeof categoryColors]}>
            {categoryLabels[aircraft.category as keyof typeof categoryLabels]}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2" data-testid={`aircraft-model-${aircraft.id}`}>
          {aircraft.manufacturer} {aircraft.model}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid={`aircraft-description-${aircraft.id}`}>
          {aircraft.description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground" data-testid={`aircraft-passengers-${aircraft.id}`}>
              {aircraft.passengers}
            </p>
            <p className="text-muted-foreground">Passengers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground" data-testid={`aircraft-range-${aircraft.id}`}>
              {aircraft.range.toLocaleString()}
            </p>
            <p className="text-muted-foreground">Range (nm)</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground" data-testid={`aircraft-speed-${aircraft.id}`}>
              {aircraft.speed}
            </p>
            <p className="text-muted-foreground">Speed (mph)</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary" data-testid={`aircraft-rate-${aircraft.id}`}>
            ${parseFloat(aircraft.hourlyRate).toLocaleString()}/hr
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleViewDetails}
              data-testid={`button-view-details-${aircraft.id}`}
            >
              View Details
            </Button>
            <Button
              onClick={handleBook}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-book-${aircraft.id}`}
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
