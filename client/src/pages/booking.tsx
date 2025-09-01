import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { User, MapPin, CreditCard, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Aircraft } from "@shared/schema";

const passengerDetailsSchema = z.object({
  // Primary passenger
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  
  // Address
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  
  // Additional passengers
  additionalPassengers: z.string().optional(),
  
  // Special requests
  specialRequests: z.string().optional(),
  
  // Emergency contact
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyRelation: z.string().min(1, "Relationship is required"),
});

type PassengerDetails = z.infer<typeof passengerDetailsSchema>;

interface BookingPageProps {
  aircraft?: Aircraft;
  searchParams?: {
    departure?: string;
    arrival?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
  };
}

export default function Booking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [aircraft] = useState<Aircraft | null>(
    // In a real app, this would come from route params or state
    null
  );

  const form = useForm<PassengerDetails>({
    resolver: zodResolver(passengerDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      additionalPassengers: "",
      specialRequests: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: PassengerDetails) => {
      const bookingData = {
        userId: "user-123", // In real app, get from auth
        flightId: "flight-123", // In real app, get from flight creation
        totalAmount: aircraft?.hourlyRate || "10000.00",
        passengerDetails: data,
      };
      
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your private jet has been successfully booked.",
      });
      setLocation("/booking-confirmation");
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Unable to complete booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PassengerDetails) => {
    bookingMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Complete Your Booking
          </h1>
          <p className="text-xl text-muted-foreground">
            Please provide your details to finalize your private jet reservation
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Booking Progress</span>
              <span className="text-sm text-muted-foreground">{currentStep}/3</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <div className="flex justify-between mt-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-muted"}`}>
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="text-sm font-medium">Personal Details</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-muted"}`}>
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="text-sm font-medium">Address & Contact</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-white" : "bg-muted"}`}>
                  "3"
                </div>
                <span className="text-sm font-medium">Review & Confirm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step 1: Personal Details */}
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      {...form.register("firstName")}
                      data-testid="input-first-name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      {...form.register("lastName")}
                      data-testid="input-last-name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      {...form.register("email")}
                      data-testid="input-email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      {...form.register("phone")}
                      data-testid="input-phone"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("dateOfBirth")}
                    data-testid="input-date-of-birth"
                  />
                  {form.formState.errors.dateOfBirth && (
                    <p className="text-sm text-destructive">{form.formState.errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalPassengers">Additional Passengers</Label>
                  <Textarea
                    id="additionalPassengers"
                    placeholder="List additional passenger names (if any)"
                    {...form.register("additionalPassengers")}
                    data-testid="textarea-additional-passengers"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep} data-testid="button-next-step">
                    Continue to Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Address & Emergency Contact */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address & Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      {...form.register("address")}
                      data-testid="input-address"
                    />
                    {form.formState.errors.address && (
                      <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        {...form.register("city")}
                        data-testid="input-city"
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="Enter state"
                        {...form.register("state")}
                        data-testid="input-state"
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        placeholder="Enter ZIP code"
                        {...form.register("zipCode")}
                        data-testid="input-zip-code"
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-destructive">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select
                      value={form.watch("country")}
                      onValueChange={(value) => form.setValue("country", value)}
                    >
                      <SelectTrigger data-testid="select-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Enter emergency contact name"
                        {...form.register("emergencyName")}
                        data-testid="input-emergency-name"
                      />
                      {form.formState.errors.emergencyName && (
                        <p className="text-sm text-destructive">{form.formState.errors.emergencyName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="Enter emergency contact phone"
                        {...form.register("emergencyPhone")}
                        data-testid="input-emergency-phone"
                      />
                      {form.formState.errors.emergencyPhone && (
                        <p className="text-sm text-destructive">{form.formState.errors.emergencyPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Relationship *</Label>
                    <Input
                      id="emergencyRelation"
                      placeholder="e.g., Spouse, Parent, Sibling"
                      {...form.register("emergencyRelation")}
                      data-testid="input-emergency-relation"
                    />
                    {form.formState.errors.emergencyRelation && (
                      <p className="text-sm text-destructive">{form.formState.errors.emergencyRelation.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special dietary requirements, accessibility needs, or other requests"
                    {...form.register("specialRequests")}
                    data-testid="textarea-special-requests"
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step">
                    Back
                  </Button>
                  <Button type="button" onClick={nextStep} data-testid="button-review">
                    Review Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Review & Confirm Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p><strong>Name:</strong> {form.watch("firstName")} {form.watch("lastName")}</p>
                      <p><strong>Email:</strong> {form.watch("email")}</p>
                      <p><strong>Phone:</strong> {form.watch("phone")}</p>
                      <p><strong>Date of Birth:</strong> {form.watch("dateOfBirth")}</p>
                    </div>
                  </div>

                  {/* Address Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p>{form.watch("address")}</p>
                      <p>{form.watch("city")}, {form.watch("state")} {form.watch("zipCode")}</p>
                      <p>{form.watch("country")}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Emergency Contact</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <p><strong>{form.watch("emergencyName")}</strong> ({form.watch("emergencyRelation")})</p>
                    <p>{form.watch("emergencyPhone")}</p>
                  </div>
                </div>

                {/* Special Requests */}
                {form.watch("specialRequests") && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Special Requests</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p>{form.watch("specialRequests")}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Booking Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary">
                        ${aircraft ? parseFloat(aircraft.hourlyRate).toLocaleString() : "10,000"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is an estimated total. Final pricing will be confirmed after flight details review.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} data-testid="button-back-to-address">
                    Back to Address
                  </Button>
                  <Button
                    type="submit"
                    disabled={bookingMutation.isPending}
                    className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90"
                    data-testid="button-confirm-booking"
                  >
                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}