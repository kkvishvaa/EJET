import { useState } from "react";
import { Card } from "@/components/ui/card";
import FlightSearchForm from "@/components/flight-search-form";
import AircraftCard from "@/components/aircraft-card";
import { AlertCircle, Search as SearchIcon } from "lucide-react";
import type { Aircraft } from "@shared/schema";

export default function Search() {
  const [searchResults, setSearchResults] = useState<Aircraft[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchResults = (results: Aircraft[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Search Flights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find the perfect private jet for your journey with our advanced search filters.
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <FlightSearchForm onSearchResults={handleSearchResults} />
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-8">
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Search Results
              </h2>
              <p className="text-muted-foreground mb-6">
                Found {searchResults.length} available aircraft for your search criteria
              </p>

              {searchResults.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Flights Available</h3>
                    <p className="max-w-md mx-auto">
                      We couldn't find any aircraft matching your search criteria. 
                      Try adjusting your departure/arrival locations, dates, or passenger count.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((aircraft) => (
                    <AircraftCard
                      key={aircraft.id}
                      aircraft={aircraft}
                      onBook={(aircraft) => {
                        // TODO: Implement booking flow
                        console.log("Book aircraft:", aircraft);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <Card className="p-12 text-center bg-muted/30">
            <div className="text-muted-foreground">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Ready to Search</h3>
              <p className="max-w-md mx-auto">
                Enter your travel details above to find available private jets for your journey.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
