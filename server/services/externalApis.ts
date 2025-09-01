import fetch from "node-fetch";

// OpenSky Network API for live flight tracking
export interface FlightTrackingData {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  on_ground: boolean;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  geo_altitude: number;
}

export class FlightTrackingService {
  private baseUrl = "https://opensky-network.org/api";

  async getLiveFlights(): Promise<FlightTrackingData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/states/all`);
      const data = await response.json() as any;
      
      if (!data.states) return [];
      
      return data.states.slice(0, 20).map((state: any[]) => ({
        icao24: state[0],
        callsign: state[1]?.trim() || "Unknown",
        origin_country: state[2],
        time_position: state[3],
        last_contact: state[4],
        longitude: state[5],
        latitude: state[6],
        baro_altitude: state[7],
        on_ground: state[8],
        velocity: state[9],
        true_track: state[10],
        vertical_rate: state[11],
        geo_altitude: state[13],
      }));
    } catch (error) {
      console.error("Error fetching live flights:", error);
      return [];
    }
  }

  async getFlightByCallsign(callsign: string): Promise<FlightTrackingData | null> {
    try {
      const flights = await this.getLiveFlights();
      return flights.find(flight => 
        flight.callsign.toLowerCase().includes(callsign.toLowerCase())
      ) || null;
    } catch (error) {
      console.error("Error fetching flight by callsign:", error);
      return null;
    }
  }
}

// OpenMeteo API for weather data
export interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  description: string;
}

export class WeatherService {
  private baseUrl = "https://api.open-meteo.com/v1";

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
      );
      const data = await response.json() as any;
      
      if (!data.current_weather) return null;
      
      const current = data.current_weather;
      return {
        temperature: current.temperature,
        windspeed: current.windspeed,
        winddirection: current.winddirection,
        weathercode: current.weathercode,
        description: this.getWeatherDescription(current.weathercode),
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  private getWeatherDescription(code: number): string {
    const weatherCodes: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm",
    };
    
    return weatherCodes[code] || "Unknown weather condition";
  }
}

// Airport data service (using sample data - would integrate with OurAirports CSV)
export interface AirportData {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export class AirportService {
  // Sample major airports - in production, this would load from OurAirports CSV
  private airports: AirportData[] = [
    {
      code: "JFK",
      name: "John F. Kennedy International Airport",
      city: "New York",
      country: "United States",
      latitude: 40.6413,
      longitude: -73.7781,
      elevation: 13,
    },
    {
      code: "LAX",
      name: "Los Angeles International Airport",
      city: "Los Angeles",
      country: "United States",
      latitude: 33.9428,
      longitude: -118.4081,
      elevation: 125,
    },
    {
      code: "MIA",
      name: "Miami International Airport",
      city: "Miami",
      country: "United States",
      latitude: 25.7956,
      longitude: -80.2906,
      elevation: 8,
    },
    {
      code: "ORD",
      name: "O'Hare International Airport",
      city: "Chicago",
      country: "United States",
      latitude: 41.9742,
      longitude: -87.9073,
      elevation: 672,
    },
    {
      code: "LAS",
      name: "McCarran International Airport",
      city: "Las Vegas",
      country: "United States",
      latitude: 36.0840,
      longitude: -115.1537,
      elevation: 2181,
    },
  ];

  async searchAirports(query: string): Promise<AirportData[]> {
    const normalizedQuery = query.toLowerCase();
    return this.airports.filter(airport => 
      airport.code.toLowerCase().includes(normalizedQuery) ||
      airport.name.toLowerCase().includes(normalizedQuery) ||
      airport.city.toLowerCase().includes(normalizedQuery)
    );
  }

  async getAirportByCode(code: string): Promise<AirportData | null> {
    return this.airports.find(airport => 
      airport.code.toLowerCase() === code.toLowerCase()
    ) || null;
  }

  async getAllAirports(): Promise<AirportData[]> {
    return this.airports;
  }
}

// Export service instances
export const flightTrackingService = new FlightTrackingService();
export const weatherService = new WeatherService();
export const airportService = new AirportService();