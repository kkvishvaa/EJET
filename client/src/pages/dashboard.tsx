import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plane, 
  CreditCard, 
  TrendingUp, 
  MapPin, 
  Clock,
  DollarSign,
  BarChart3
} from "lucide-react";
import type { Flight, Booking } from "@shared/schema";

// Mock user ID for demo purposes
const MOCK_USER_ID = "user-123";

export default function Dashboard() {
  const { data: flights = [] } = useQuery<Flight[]>({
    queryKey: ["/api/flights/user", MOCK_USER_ID],
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/user", MOCK_USER_ID],
  });

  // Calculate statistics
  const totalFlights = flights.length;
  const upcomingFlights = flights.filter(f => new Date(f.departureDate) > new Date()).length;
  const totalSpent = bookings.reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your flights, bookings, and account preferences
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Flights</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-flights">
                    {totalFlights}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Plane className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Flights</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-upcoming-flights">
                    {upcomingFlights}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-total-spent">
                    ${totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold text-foreground" data-testid="stat-bookings">
                    {bookings.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="flights" data-testid="tab-flights">My Flights</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Flights Tab */}
          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Flights</CardTitle>
              </CardHeader>
              <CardContent>
                {flights.length === 0 ? (
                  <div className="text-center py-8">
                    <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Flights Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Book your first private jet flight to see it here.
                    </p>
                    <Button data-testid="button-book-first-flight">Book Your First Flight</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flights.slice(0, 5).map((flight) => (
                      <div
                        key={flight.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Plane className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium" data-testid={`flight-route-${flight.id}`}>
                                {flight.departure} → {flight.arrival}
                              </span>
                              <Badge className={getStatusColor(flight.status || "pending")}>
                                {flight.status?.toUpperCase() || "PENDING"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span data-testid={`flight-date-${flight.id}`}>
                                {new Date(flight.departureDate).toLocaleDateString()}
                              </span>
                              <span>{flight.passengers} passengers</span>
                              <span className="capitalize">{flight.tripType === "oneway" ? "One Way" : "Round Trip"}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-track-flight-${flight.id}`}
                        >
                          Track Flight
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Bookings Yet</h3>
                    <p className="text-muted-foreground">
                      Your booking history will appear here once you complete a reservation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium" data-testid={`booking-id-${booking.id}`}>
                                Booking #{booking.id.slice(-8)}
                              </span>
                              <Badge className={getStatusColor(booking.status || "pending")}>
                                {booking.status?.toUpperCase() || "PENDING"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span data-testid={`booking-amount-${booking.id}`}>
                                ${parseFloat(booking.totalAmount).toLocaleString()}
                              </span>
                              <span>{booking.paymentStatus}</span>
                              <span data-testid={`booking-date-${booking.id}`}>
                                {new Date(booking.createdAt!).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid={`button-view-booking-${booking.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Spending Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Spent</span>
                      <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average per Flight</span>
                      <span className="font-semibold">
                        ${totalFlights > 0 ? (totalSpent / totalFlights).toLocaleString() : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">This Year</span>
                      <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Flight Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Flights</span>
                      <span className="font-semibold">{totalFlights}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Upcoming</span>
                      <span className="font-semibold">{upcomingFlights}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-semibold">
                        {flights.filter(f => f.status === "completed").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flights.slice(0, 3).map((flight, index) => (
                    <div key={flight.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">
                          Flight {flight.departure} → {flight.arrival}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.status === "completed" ? "Completed" : "Scheduled"} • {" "}
                          {new Date(flight.departureDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {flights.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No recent activity to display.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
