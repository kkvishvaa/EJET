import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AircraftCard from "@/components/aircraft-card";
import { Search, Filter } from "lucide-react";
import type { Aircraft } from "@shared/schema";

export default function Jets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("hourlyRate");

  const { data: aircraft = [], isLoading } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft"],
  });

  // Get aircraft by category for statistics
  const { data: lightJets = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft/category/light"],
  });

  const { data: midsizeJets = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft/category/midsize"],
  });

  const { data: heavyJets = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft/category/heavy"],
  });

  const { data: ultraJets = [] } = useQuery<Aircraft[]>({
    queryKey: ["/api/aircraft/category/ultra"],
  });

  const filteredAircraft = aircraft
    .filter((jet) => {
      const matchesSearch = 
        jet.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jet.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || jet.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hourlyRate":
          return parseFloat(a.hourlyRate) - parseFloat(b.hourlyRate);
        case "passengers":
          return b.passengers - a.passengers;
        case "range":
          return b.range - a.range;
        case "speed":
          return b.speed - a.speed;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading aircraft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Aircraft Fleet
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of luxury private jets, from light jets for short trips to ultra-long-range aircraft for international travel.
          </p>
        </div>

        {/* Fleet Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {lightJets.length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Light Jets</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Short & Regional</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {midsizeJets.length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 font-medium">Midsize Jets</div>
              <div className="text-xs text-green-600 dark:text-green-400">Mid-Range</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {heavyJets.length}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Heavy Jets</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Long-Range</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {ultraJets.length}
              </div>
              <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">Ultra Jets</div>
              <div className="text-xs text-amber-600 dark:text-amber-400">Ultra Long-Range</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search aircraft..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-aircraft"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="light">Light Jets</SelectItem>
                  <SelectItem value="midsize">Midsize Jets</SelectItem>
                  <SelectItem value="heavy">Heavy Jets</SelectItem>
                  <SelectItem value="ultra">Ultra Long Range</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort-by">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourlyRate">Price (Low to High)</SelectItem>
                  <SelectItem value="passengers">Passengers (High to Low)</SelectItem>
                  <SelectItem value="range">Range (High to Low)</SelectItem>
                  <SelectItem value="speed">Speed (High to Low)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setSortBy("hourlyRate");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAircraft.length} of {aircraft.length} aircraft
          </p>
        </div>

        {/* Aircraft Grid */}
        {filteredAircraft.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Aircraft Found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAircraft.map((jet) => (
              <AircraftCard key={jet.id} aircraft={jet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
