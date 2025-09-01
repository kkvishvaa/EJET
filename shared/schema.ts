import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aircraft = pgTable("aircraft", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  model: text("model").notNull(),
  category: text("category").notNull(), // light, midsize, heavy, ultra
  manufacturer: text("manufacturer").notNull(),
  passengers: integer("passengers").notNull(),
  range: integer("range").notNull(), // nautical miles
  speed: integer("speed").notNull(), // mph
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
});

export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  aircraftId: varchar("aircraft_id").references(() => aircraft.id),
  departure: text("departure").notNull(),
  arrival: text("arrival").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  returnDate: timestamp("return_date"),
  passengers: integer("passengers").notNull(),
  tripType: text("trip_type").notNull(), // oneway, roundtrip
  status: text("status").default("pending"), // pending, confirmed, completed, cancelled
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  flightId: varchar("flight_id").references(() => flights.id),
  userId: varchar("user_id").references(() => users.id),
  status: text("status").default("pending"), // pending, confirmed, paid, cancelled
  paymentStatus: text("payment_status").default("pending"), // pending, completed, failed
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  airportCode: text("airport_code").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  popular: boolean("popular").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAircraftSchema = createInsertSchema(aircraft).omit({
  id: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Search schemas
export const flightSearchSchema = z.object({
  departure: z.string().min(1, "Departure location is required"),
  arrival: z.string().min(1, "Arrival location is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1, "At least 1 passenger required").max(20, "Maximum 20 passengers"),
  tripType: z.enum(["oneway", "roundtrip"]),
  category: z.enum(["light", "midsize", "heavy", "ultra"]).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Aircraft = typeof aircraft.$inferSelect;
export type InsertAircraft = z.infer<typeof insertAircraftSchema>;

export type Flight = typeof flights.$inferSelect;
export type InsertFlight = z.infer<typeof insertFlightSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type FlightSearch = z.infer<typeof flightSearchSchema>;
