import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface AirportSearchProps {
  placeholder?: string;
  onSelect: (airport: string) => void;
  value: string;
  testId?: string;
}

export default function AirportSearch({ placeholder, onSelect, value, testId }: AirportSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: airports = [] } = useQuery<Airport[]>({
    queryKey: ["/api/airports", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/airports?search=${encodeURIComponent(searchQuery)}`
        : "/api/airports";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch airports");
      return response.json();
    },
    enabled: searchQuery.length >= 2,
  });

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    onSelect(inputValue);
    setShowSuggestions(inputValue.length >= 2);
  };

  const handleAirportSelect = (airport: Airport) => {
    const airportString = `${airport.city} (${airport.code})`;
    onSelect(airportString);
    setSearchQuery(airportString);
    setShowSuggestions(false);
  };

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 py-4 border-border focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid={testId}
        />
      </div>

      {showSuggestions && airports.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-2">
            <div className="max-h-60 overflow-y-auto">
              {airports.slice(0, 5).map((airport) => (
                <Button
                  key={airport.code}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleAirportSelect(airport)}
                  data-testid={`airport-option-${airport.code}`}
                >
                  <div>
                    <div className="font-medium">
                      {airport.city} ({airport.code})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {airport.name}, {airport.country}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
