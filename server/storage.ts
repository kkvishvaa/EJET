import { type User, type InsertUser, type Aircraft, type InsertAircraft, type Flight, type InsertFlight, type Booking, type InsertBooking, type Destination, type InsertDestination, type FlightSearch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Aircraft
  getAircraft(): Promise<Aircraft[]>;
  getAircraftById(id: string): Promise<Aircraft | undefined>;
  getAircraftByCategory(category: string): Promise<Aircraft[]>;
  createAircraft(aircraft: InsertAircraft): Promise<Aircraft>;

  // Flights
  searchFlights(search: FlightSearch): Promise<Aircraft[]>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  getFlightsByUser(userId: string): Promise<Flight[]>;
  getFlightById(id: string): Promise<Flight | undefined>;
  updateFlightStatus(id: string, status: string): Promise<Flight | undefined>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<Booking | undefined>;

  // Destinations
  getDestinations(): Promise<Destination[]>;
  getPopularDestinations(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private aircraft: Map<string, Aircraft>;
  private flights: Map<string, Flight>;
  private bookings: Map<string, Booking>;
  private destinations: Map<string, Destination>;

  constructor() {
    this.users = new Map();
    this.aircraft = new Map();
    this.flights = new Map();
    this.bookings = new Map();
    this.destinations = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Aircraft
    const sampleAircraft: Aircraft[] = [
      {
        id: randomUUID(),
        model: "Citation CJ3+",
        category: "light",
        manufacturer: "Cessna",
        passengers: 7,
        range: 2040,
        speed: 478,
        hourlyRate: "3500.00",
        description: "Perfect for short to medium-range flights with luxury amenities.",
        imageUrl: "/jet1.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Hawker 800XP",
        category: "midsize",
        manufacturer: "Hawker Beechcraft",
        passengers: 8,
        range: 2540,
        speed: 514,
        hourlyRate: "4800.00",
        description: "Ideal for coast-to-coast flights with spacious cabin comfort.",
        imageUrl: "/jet2.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Gulfstream G650",
        category: "heavy",
        manufacturer: "Gulfstream",
        passengers: 14,
        range: 7000,
        speed: 652,
        hourlyRate: "8500.00",
        description: "Ultra-long-range luxury for international travel with unmatched comfort.",
        imageUrl: "/jet3.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Bombardier Global 7500",
        category: "ultra",
        manufacturer: "Bombardier",
        passengers: 19,
        range: 7700,
        speed: 690,
        hourlyRate: "12000.00",
        description: "The world's largest and longest-range business jet with four distinct living spaces.",
        imageUrl: "/jet4.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Phenom 300E",
        category: "light",
        manufacturer: "Embraer",
        passengers: 9,
        range: 2010,
        speed: 521,
        hourlyRate: "3200.00",
        description: "Outstanding performance and fuel efficiency for light jet category.",
        imageUrl: "/jet5.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Citation Latitude",
        category: "midsize",
        manufacturer: "Cessna",
        passengers: 9,
        range: 2700,
        speed: 513,
        hourlyRate: "5500.00",
        description: "Spacious cabin with advanced avionics and superior comfort.",
        imageUrl: "/jet6.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Falcon 900EX",
        category: "heavy",
        manufacturer: "Dassault",
        passengers: 12,
        range: 4500,
        speed: 590,
        hourlyRate: "7800.00",
        description: "Tri-jet reliability with intercontinental range and luxurious appointments.",
        imageUrl: "/jet7.png",
        available: true,
      },
      {
        id: randomUUID(),
        model: "Citation X+",
        category: "heavy",
        manufacturer: "Cessna",
        passengers: 12,
        range: 3408,
        speed: 717,
        hourlyRate: "9200.00",
        description: "The fastest civilian aircraft with cutting-edge technology and speed.",
        imageUrl: "/jet8.png",
        available: true,
      },
    ];

    sampleAircraft.forEach(aircraft => this.aircraft.set(aircraft.id, aircraft));

    // Sample Destinations
    const sampleDestinations: Destination[] = [
      {
        id: randomUUID(),
        name: "Miami International Airport",
        city: "Miami",
        state: "FL",
        country: "USA",
        airportCode: "MIA",
        description: "Luxury beaches and vibrant nightlife",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Aspen/Pitkin County Airport",
        city: "Aspen",
        state: "CO",
        country: "USA",
        airportCode: "ASE",
        description: "World-class skiing and mountain luxury",
        imageUrl: "https://images.unsplash.com/photo-1551524164-687a55dd1126?ixlib=rb-4.0.3",
        popular: true,
      },
      {
        id: randomUUID(),
        name: "Napa County Airport",
        city: "Napa",
        state: "CA",
        country: "USA",
        airportCode: "APC",
        description: "Premium wine country experiences",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        popular: true,
      },
    ];

    sampleDestinations.forEach(destination => this.destinations.set(destination.id, destination));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Aircraft
  async getAircraft(): Promise<Aircraft[]> {
    return Array.from(this.aircraft.values()).filter(aircraft => aircraft.available);
  }

  async getAircraftById(id: string): Promise<Aircraft | undefined> {
    return this.aircraft.get(id);
  }

  async getAircraftByCategory(category: string): Promise<Aircraft[]> {
    return Array.from(this.aircraft.values()).filter(
      aircraft => aircraft.category === category && aircraft.available
    );
  }

  async createAircraft(insertAircraft: InsertAircraft): Promise<Aircraft> {
    const id = randomUUID();
    const aircraft: Aircraft = { ...insertAircraft, id };
    this.aircraft.set(id, aircraft);
    return aircraft;
  }

  // Flights
  async searchFlights(search: FlightSearch): Promise<Aircraft[]> {
    let results = Array.from(this.aircraft.values()).filter(aircraft => aircraft.available);
    
    if (search.category) {
      results = results.filter(aircraft => aircraft.category === search.category);
    }
    
    results = results.filter(aircraft => aircraft.passengers >= search.passengers);
    
    return results;
  }

  async createFlight(insertFlight: InsertFlight): Promise<Flight> {
    const id = randomUUID();
    const flight: Flight = { 
      ...insertFlight, 
      id,
      createdAt: new Date(),
    };
    this.flights.set(id, flight);
    return flight;
  }

  async getFlightsByUser(userId: string): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(flight => flight.userId === userId);
  }

  async getFlightById(id: string): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async updateFlightStatus(id: string, status: string): Promise<Flight | undefined> {
    const flight = this.flights.get(id);
    if (flight) {
      flight.status = status;
      this.flights.set(id, flight);
    }
    return flight;
  }

  // Bookings
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
    return booking;
  }

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getPopularDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(destination => destination.popular);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }
}

export const storage = new MemStorage();
