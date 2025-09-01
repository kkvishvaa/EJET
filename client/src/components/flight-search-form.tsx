import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { flightSearchSchema, type FlightSearch } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AirportSearch from "@/components/airport-search";
import { Search, PlaneIcon as PlaneTakeoff, PlaneIcon as PlaneLanding, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FlightSearchFormProps {
  onSearchResults?: (results: any[]) => void;
}

export default function FlightSearchForm({ onSearchResults }: FlightSearchFormProps) {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const form = useForm<FlightSearch>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      departure: "",
      arrival: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      tripType: "oneway",
      category: undefined,
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: FlightSearch) => {
      const response = await apiRequest("POST", "/api/flights/search", data);
      return response.json();
    },
    onSuccess: (results) => {
      setSearchResults(results);
      onSearchResults?.(results);
      toast({
        title: "Search Complete",
        description: `Found ${results.length} available aircraft`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: "Unable to search flights. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FlightSearch) => {
    searchMutation.mutate(data);
  };

  const tripType = form.watch("tripType");

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md border-white/20 shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground mb-2">
          Book Your Flight
        </CardTitle>
        <p className="text-muted-foreground">
          Find and book the perfect private jet for your journey
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Trip Type</Label>
            <RadioGroup
              value={tripType}
              onValueChange={(value) => form.setValue("tripType", value as "oneway" | "roundtrip")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oneway" id="oneway" data-testid="radio-oneway" />
                <Label htmlFor="oneway" className="font-medium cursor-pointer">One Way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="roundtrip" id="roundtrip" data-testid="radio-roundtrip" />
                <Label htmlFor="roundtrip" className="font-medium cursor-pointer">Round Trip</Label>
              </div>
            </RadioGroup>
          </div>

          {/* From/To Airports */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure" className="text-sm font-medium text-foreground">From</Label>
              <AirportSearch
                placeholder="Departure airport"
                value={form.watch("departure")}
                onSelect={(value) => form.setValue("departure", value)}
                testId="input-departure"
              />
              {form.formState.errors.departure && (
                <p className="text-sm text-destructive">{form.formState.errors.departure.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival" className="text-sm font-medium text-foreground">To</Label>
              <AirportSearch
                placeholder="Arrival airport"
                value={form.watch("arrival")}
                onSelect={(value) => form.setValue("arrival", value)}
                testId="input-arrival"
              />
              {form.formState.errors.arrival && (
                <p className="text-sm text-destructive">{form.formState.errors.arrival.message}</p>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate" className="text-sm font-medium text-foreground">Departure Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  id="departureDate"
                  type="date"
                  className="pl-12 py-4 border-border focus:ring-2 focus:ring-primary focus:border-primary"
                  {...form.register("departureDate")}
                  data-testid="input-departure-date"
                />
              </div>
              {form.formState.errors.departureDate && (
                <p className="text-sm text-destructive">{form.formState.errors.departureDate.message}</p>
              )}
            </div>
            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <Label htmlFor="returnDate" className="text-sm font-medium text-foreground">Return Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    id="returnDate"
                    type="date"
                    className="pl-12 py-4 border-border focus:ring-2 focus:ring-primary focus:border-primary"
                    {...form.register("returnDate")}
                    data-testid="input-return-date"
                  />
                </div>
                {form.formState.errors.returnDate && (
                  <p className="text-sm text-destructive">{form.formState.errors.returnDate.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Passengers and Aircraft */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Passengers</Label>
              <Select
                value={form.watch("passengers").toString()}
                onValueChange={(value) => form.setValue("passengers", parseInt(value))}
              >
                <SelectTrigger className="py-4 border-border focus:ring-2 focus:ring-primary" data-testid="select-passengers">
                  <div className="flex items-center">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground" />
                    <SelectValue placeholder="Select passengers" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Passenger</SelectItem>
                  <SelectItem value="2">2 Passengers</SelectItem>
                  <SelectItem value="3">3 Passengers</SelectItem>
                  <SelectItem value="4">4 Passengers</SelectItem>
                  <SelectItem value="5">5 Passengers</SelectItem>
                  <SelectItem value="6">6 Passengers</SelectItem>
                  <SelectItem value="7">7 Passengers</SelectItem>
                  <SelectItem value="8">8 Passengers</SelectItem>
                  <SelectItem value="9">9 Passengers</SelectItem>
                  <SelectItem value="10">10+ Passengers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Aircraft Category</Label>
              <Select
                value={form.watch("category") || "any"}
                onValueChange={(value) => form.setValue("category", value === "any" ? undefined : value as any)}
              >
                <SelectTrigger className="py-4 border-border focus:ring-2 focus:ring-primary" data-testid="select-category">
                  <SelectValue placeholder="Any Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Category</SelectItem>
                  <SelectItem value="light">Light Jets</SelectItem>
                  <SelectItem value="midsize">Midsize Jets</SelectItem>
                  <SelectItem value="heavy">Heavy Jets</SelectItem>
                  <SelectItem value="ultra">Ultra Long Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={searchMutation.isPending}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 font-semibold text-lg hover:from-primary/90 hover:to-accent/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            data-testid="button-search-flights"
          >
            <Search className="mr-2 h-5 w-5" />
            {searchMutation.isPending ? "Searching..." : "Search Flights"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
