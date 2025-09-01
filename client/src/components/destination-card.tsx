import { Button } from "@/components/ui/button";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
  onExploreFlights?: (destination: Destination) => void;
}

export default function DestinationCard({ destination, onExploreFlights }: DestinationCardProps) {
  const handleExploreFlights = () => {
    onExploreFlights?.(destination);
  };

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <img
        src={destination.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3"}
        alt={`${destination.city}, ${destination.state ? destination.state + ', ' : ''}${destination.country}`}
        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-2xl font-bold text-white mb-2" data-testid={`destination-name-${destination.id}`}>
          {destination.city}, {destination.state && `${destination.state}, `}{destination.country}
        </h3>
        <p className="text-gray-200 mb-4" data-testid={`destination-description-${destination.id}`}>
          {destination.description}
        </p>
        <Button
          onClick={handleExploreFlights}
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-200"
          data-testid={`button-explore-flights-${destination.id}`}
        >
          Explore Flights
        </Button>
      </div>
    </div>
  );
}
