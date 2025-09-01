import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Plane, AlertCircle } from "lucide-react";
import type { Flight } from "@shared/schema";

export default function Track() {
  const [flightId, setFlightId] = useState("");
  const [searchedFlightId, setSearchedFlightId] = useState("");

  const { data: flight, isLoading, error } = useQuery<Flight>({
    queryKey: ["/api/flights", searchedFlightId],
    enabled: !!searchedFlightId,
  });

  const handleSearch = () => {
    if (flightId.trim()) {
      setSearchedFlightId(flightId.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Flight Tracking
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your private jet flight in real-time with live updates and status information.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Your Flight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter flight ID or booking reference"
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
                className="flex-1"
                data-testid="input-flight-id"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={!flightId.trim() || isLoading}
                data-testid="button-track-flight"
              >
                {isLoading ? "Tracking..." : "Track Flight"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flight Information */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Flight Not Found</h3>
                  <p className="text-sm">Please check your flight ID and try again.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {flight && (
          <div className="space-y-6">
            {/* Flight Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Flight Status</span>
                  <Badge className={getStatusColor(flight.status || "pending")}>
                    {flight.status?.toUpperCase() || "PENDING"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Plane className="h-5 w-5 text-primary rotate-45" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Departure</p>
                        <p className="font-semibold" data-testid="flight-departure">
                          {flight.departure}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Arrival</p>
                        <p className="font-semibold" data-testid="flight-arrival">
                          {flight.arrival}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Departure Date</p>
                        <p className="font-semibold" data-testid="flight-departure-date">
                          {new Date(flight.departureDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {flight.returnDate && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Return Date</p>
                          <p className="font-semibold" data-testid="flight-return-date">
                            {new Date(flight.returnDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight Details */}
            <Card>
              <CardHeader>
                <CardTitle>Flight Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Flight ID</p>
                    <p className="font-semibold" data-testid="flight-id">{flight.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Passengers</p>
                    <p className="font-semibold" data-testid="flight-passengers">{flight.passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trip Type</p>
                    <p className="font-semibold capitalize" data-testid="flight-trip-type">
                      {flight.tripType === "oneway" ? "One Way" : "Round Trip"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Live Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Flight Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        Your flight has been confirmed and aircraft assigned.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(flight.createdAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Booking Created</p>
                      <p className="text-sm text-muted-foreground">
                        Flight booking has been successfully created.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(flight.createdAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!searchedFlightId && (
          <Card className="p-12 text-center bg-muted/30">
            <div className="text-muted-foreground">
              <Plane className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Track Your Flight</h3>
              <p className="max-w-md mx-auto">
                Enter your flight ID or booking reference above to get real-time updates on your private jet journey.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
