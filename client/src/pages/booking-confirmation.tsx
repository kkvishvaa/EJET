import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plane, Calendar, Users, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function BookingConfirmation() {
  // In a real app, this would come from the booking context or API
  const bookingDetails = {
    bookingId: "JC-2024-001",
    confirmationCode: "ABC123XYZ",
    status: "Confirmed",
    aircraft: {
      model: "Gulfstream G650",
      manufacturer: "Gulfstream",
    },
    passenger: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    flight: {
      departure: "New York (JFK)",
      arrival: "Los Angeles (LAX)",
      departureDate: "2024-12-20",
      departureTime: "10:00 AM",
      estimatedFlight: "6 hours",
      passengers: 4,
    },
    totalAmount: "$25,000",
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your private jet reservation has been successfully confirmed
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-6">
          {/* Confirmation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Booking Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="text-lg font-bold text-primary" data-testid="booking-id">
                    {bookingDetails.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmation Code</p>
                  <p className="text-lg font-bold text-primary" data-testid="confirmation-code">
                    {bookingDetails.confirmationCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {bookingDetails.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aircraft</p>
                      <p className="font-semibold" data-testid="aircraft-details">
                        {bookingDetails.aircraft.manufacturer} {bookingDetails.aircraft.model}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Route</p>
                      <p className="font-semibold" data-testid="flight-route">
                        {bookingDetails.flight.departure} → {bookingDetails.flight.arrival}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Departure</p>
                      <p className="font-semibold" data-testid="departure-details">
                        {new Date(bookingDetails.flight.departureDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {bookingDetails.flight.departureTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passengers</p>
                      <p className="font-semibold" data-testid="passenger-count">
                        {bookingDetails.flight.passengers} passengers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <CardTitle>Primary Passenger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold" data-testid="passenger-name">
                      {bookingDetails.passenger.name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold" data-testid="passenger-email">
                      {bookingDetails.passenger.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold" data-testid="passenger-phone">
                      {bookingDetails.passenger.phone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Amount Paid:</span>
                  <span className="text-3xl font-bold text-primary" data-testid="total-amount">
                    {bookingDetails.totalAmount}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Payment processed successfully. Receipt has been sent to your email.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a detailed confirmation email with your itinerary and important travel information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Flight Coordination</p>
                    <p className="text-sm text-muted-foreground">
                      Our flight operations team will contact you 24-48 hours before departure to confirm final details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Airport Instructions</p>
                    <p className="text-sm text-muted-foreground">
                      Detailed airport and terminal information will be provided closer to your departure date.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/track">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-track-flight">
                Track Your Flight
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-view-dashboard">
                View Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90" data-testid="button-book-another">
                Book Another Flight
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}