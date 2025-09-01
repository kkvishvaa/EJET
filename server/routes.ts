import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightSearchSchema, insertFlightSchema, insertBookingSchema } from "@shared/schema";
import { flightTrackingService, weatherService, airportService } from "./services/externalApis";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Aircraft routes
  app.get("/api/aircraft", async (req, res) => {
    try {
      const aircraft = await storage.getAircraft();
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aircraft" });
    }
  });

  app.get("/api/aircraft/:id", async (req, res) => {
    try {
      const aircraft = await storage.getAircraftById(req.params.id);
      if (!aircraft) {
        return res.status(404).json({ message: "Aircraft not found" });
      }
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aircraft" });
    }
  });

  app.get("/api/aircraft/category/:category", async (req, res) => {
    try {
      const aircraft = await storage.getAircraftByCategory(req.params.category);
      res.json(aircraft);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch aircraft by category" });
    }
  });

  // Flight search route
  app.post("/api/flights/search", async (req, res) => {
    try {
      const searchData = flightSearchSchema.parse(req.body);
      const aircraft = await storage.searchFlights(searchData);
      res.json(aircraft);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to search flights" });
    }
  });

  // Flight routes
  app.post("/api/flights", async (req, res) => {
    try {
      const flightData = insertFlightSchema.parse(req.body);
      const flight = await storage.createFlight(flightData);
      res.status(201).json(flight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid flight data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create flight" });
    }
  });

  app.get("/api/flights/user/:userId", async (req, res) => {
    try {
      const flights = await storage.getFlightsByUser(req.params.userId);
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user flights" });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    try {
      const flight = await storage.getFlightById(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  app.patch("/api/flights/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const flight = await storage.updateFlightStatus(req.params.id, status);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flight status" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByUser(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/popular", async (req, res) => {
    try {
      const destinations = await storage.getPopularDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular destinations" });
    }
  });

  // External API integration routes
  app.get("/api/live-flights", async (req, res) => {
    try {
      const flights = await flightTrackingService.getLiveFlights();
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live flights" });
    }
  });

  app.get("/api/live-flights/:callsign", async (req, res) => {
    try {
      const flight = await flightTrackingService.getFlightByCallsign(req.params.callsign);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flight" });
    }
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const weather = await weatherService.getWeatherByCoordinates(
        parseFloat(lat as string),
        parseFloat(lon as string)
      );
      
      if (!weather) {
        return res.status(404).json({ message: "Weather data not available" });
      }
      
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Airport routes
  app.get("/api/airports", async (req, res) => {
    try {
      const { search, limit } = req.query;
      let airports;
      
      if (search) {
        const searchLimit = limit ? parseInt(limit as string) : 10;
        airports = await airportService.searchAirports(search as string, searchLimit);
      } else {
        airports = await airportService.getPopularAirports(20);
      }
      
      res.json(airports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch airports" });
    }
  });

  // Airport autosuggestion endpoint
  app.get("/api/airports/suggest", async (req, res) => {
    try {
      const { q, limit = 8 } = req.query;
      
      if (!q || (q as string).length < 1) {
        // Return popular airports when no query
        const popularAirports = await airportService.getPopularAirports(parseInt(limit as string));
        return res.json(popularAirports);
      }
      
      const suggestions = await airportService.searchAirports(
        q as string, 
        parseInt(limit as string)
      );
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get airport suggestions" });
    }
  });

  app.get("/api/airports/:code", async (req, res) => {
    try {
      const airport = await airportService.getAirportByCode(req.params.code);
      if (!airport) {
        return res.status(404).json({ message: "Airport not found" });
      }
      res.json(airport);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch airport" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
