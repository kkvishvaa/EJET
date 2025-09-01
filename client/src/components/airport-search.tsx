import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  type: string;
  icao: string;
  continent: string;
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: airports = [], isLoading } = useQuery<Airport[]>({
    queryKey: ["airport-suggestions", searchQuery],
    queryFn: async () => {
      const url = searchQuery.trim() 
        ? `/api/airports/suggest?q=${encodeURIComponent(searchQuery)}&limit=8`
        : "/api/airports/suggest?limit=8";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch airports");
      return response.json();
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    onSelect(inputValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleAirportSelect = (airport: Airport) => {
    const airportString = `${airport.city} (${airport.code})`;
    onSelect(airportString);
    setSearchQuery(airportString);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || airports.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < airports.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : airports.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && airports[selectedIndex]) {
          handleAirportSelect(airports[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getAirportIcon = (type: string) => {
    switch (type) {
      case 'large_airport':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'medium_airport':
        return <Plane className="w-4 h-4 text-green-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 py-4 border-border focus:ring-2 focus:ring-primary focus:border-primary"
          data-testid={testId}
          autoComplete="off"
        />
      </div>

      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Searching airports...</span>
                </div>
              </div>
            ) : airports.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery.trim() ? 'No airports found' : 'Start typing to search airports'}
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {airports.map((airport: Airport, index: number) => (
                  <Button
                    key={`${airport.code}-${airport.icao}`}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-auto p-3 text-left hover:bg-gray-50",
                      selectedIndex === index && "bg-blue-50"
                    )}
                    onClick={() => handleAirportSelect(airport)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    data-testid={`airport-option-${airport.code}`}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      {getAirportIcon(airport.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-600 text-sm">
                            {airport.code}
                          </span>
                          <span className="text-xs text-gray-500 uppercase">
                            {airport.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {airport.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {airport.city}, {airport.country}
                          {airport.icao && airport.icao !== airport.code && (
                            <span className="ml-2">({airport.icao})</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
