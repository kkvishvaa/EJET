import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBookingSchema, type InsertBooking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, User, Phone, Mail, MapPin, Calendar, Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingFormProps {
  flightId: string;
  aircraftModel: string;
  route: string;
  totalAmount: string;
  onBookingComplete: (bookingId: string) => void;
}

export default function BookingForm({ 
  flightId, 
  aircraftModel, 
  route, 
  totalAmount, 
  onBookingComplete 
}: BookingFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      flightId,
      totalAmount,
      paymentStatus: "pending",
      status: "pending",
      passengerDetails: {
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        passportNumber: "",
        nationality: "",
      },
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      specialRequests: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Confirmed!",
        description: "Your private jet reservation has been successfully created.",
      });
      onBookingComplete(booking.id);
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Unable to complete booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    bookingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-4 ${
                    step < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-20 mt-2">
          <span className={`text-sm ${currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Personal Info
          </span>
          <span className={`text-sm ${currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Billing Details
          </span>
          <span className={`text-sm ${currentStep >= 3 ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Review & Payment
          </span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...form.register("passengerDetails.name")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("passengerDetails.email")}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    {...form.register("passengerDetails.phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("passengerDetails.dateOfBirth")}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    placeholder="Enter passport number"
                    {...form.register("passengerDetails.passportNumber")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    placeholder="Enter your nationality"
                    {...form.register("passengerDetails.nationality")}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Continue to Billing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Billing Address */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Enter street address"
                  {...form.register("billingAddress.street")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    {...form.register("billingAddress.city")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    placeholder="Enter state or province"
                    {...form.register("billingAddress.state")}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="Enter ZIP or postal code"
                    {...form.register("billingAddress.zipCode")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select onValueChange={(value) => form.setValue("billingAddress.country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or dietary requirements..."
                  {...form.register("specialRequests")}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button type="button" onClick={nextStep}>
                  Review Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Flight Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Flight Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Aircraft</span>
                    <span className="font-semibold">{aircraftModel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-semibold">{route}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Flight ID</span>
                    <span className="font-semibold">{flightId}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-primary">{totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Secure Payment Processing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your payment information is encrypted and processed securely. 
                      A confirmation will be sent to your email address.
                    </p>
                  </div>

                  <div className="text-center">
                    <Badge variant="secondary" className="mb-4">
                      Demo Mode - No actual payment required
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={bookingMutation.isPending}
                className="bg-gradient-to-r from-primary to-accent text-white"
              >
                {bookingMutation.isPending ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
