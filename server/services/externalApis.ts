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

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Airport data service (using OurAirports CSV data)
export interface AirportData {
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  type: string;
  icao: string;
  continent: string;
}

export class AirportService {
  private airports: AirportData[] = [];
  private isLoaded: boolean = false;

  private async loadAirportsFromCSV(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const csvPath = path.join(__dirname, '../data/ourairports.csv');
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',');

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',');
        if (values.length < headers.length) continue;

        const airport: AirportData = {
          icao: values[0] || '',
          type: values[1] || '',
          name: values[2] || '',
          elevation: parseFloat(values[3]) || 0,
          continent: values[4] || '',
          country: values[6] || '',
          city: values[7] || '',
          code: values[9] || values[8] || values[0], // Prefer IATA, fallback to GPS or ICAO
          latitude: parseFloat(values[11]) || 0,
          longitude: parseFloat(values[12]) || 0,
        };

        // Only include airports with valid IATA codes for better UX
        if (airport.code && airport.code.length === 3 && airport.name) {
          this.airports.push(airport);
        }
      }

      this.isLoaded = true;
      console.log(`Loaded ${this.airports.length} airports from CSV`);
    } catch (error) {
      console.error('Error loading airports from CSV:', error);
      // Fallback to basic airport data
      this.loadFallbackAirports();
    }
  }

  private loadFallbackAirports(): void {
    this.airports = [
      {
        code: "JFK",
        icao: "KJFK",
        name: "John F. Kennedy International Airport",
        city: "New York",
        country: "United States",
        latitude: 40.6413,
        longitude: -73.7781,
        elevation: 13,
        type: "large_airport",
        continent: "NA"
      },
      {
        code: "LAX",
        icao: "KLAX",
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        country: "United States",
        latitude: 33.9428,
        longitude: -118.4081,
        elevation: 125,
        type: "large_airport",
        continent: "NA"
      },
      {
        code: "LHR",
        icao: "EGLL",
        name: "London Heathrow Airport",
        city: "London",
        country: "United Kingdom",
        latitude: 51.4706,
        longitude: -0.461941,
        elevation: 83,
        type: "large_airport",
        continent: "EU"
      },
      {
        code: "CDG",
        icao: "LFPG",
        name: "Charles de Gaulle International Airport",
        city: "Paris",
        country: "France",
        latitude: 49.012779,
        longitude: 2.55,
        elevation: 392,
        type: "large_airport",
        continent: "EU"
      },
      {
        code: "NRT",
        icao: "RJAA",
        name: "Narita International Airport",
        city: "Tokyo",
        country: "Japan",
        latitude: 35.7647,
        longitude: 140.3864,
        elevation: 135,
        type: "large_airport",
        continent: "AS"
      }
    ];
    this.isLoaded = true;
  }

  async searchAirports(query: string, limit: number = 10): Promise<AirportData[]> {
    await this.loadAirportsFromCSV();
    
    if (!query || query.length < 1) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Score-based ranking for better autosuggestion
    const scoredAirports = this.airports.map(airport => {
      let score = 0;
      
      // Exact code match gets highest priority
      if (airport.code.toLowerCase() === normalizedQuery) {
        score += 100;
      } else if (airport.code.toLowerCase().startsWith(normalizedQuery)) {
        score += 80;
      } else if (airport.code.toLowerCase().includes(normalizedQuery)) {
        score += 50;
      }
      
      // City name matching
      if (airport.city.toLowerCase() === normalizedQuery) {
        score += 90;
      } else if (airport.city.toLowerCase().startsWith(normalizedQuery)) {
        score += 70;
      } else if (airport.city.toLowerCase().includes(normalizedQuery)) {
        score += 40;
      }
      
      // Airport name matching
      if (airport.name.toLowerCase().includes(normalizedQuery)) {
        score += 30;
      }
      
      // Country matching
      if (airport.country.toLowerCase().includes(normalizedQuery)) {
        score += 20;
      }
      
      // Prefer larger airports
      if (airport.type === 'large_airport') {
        score += 10;
      } else if (airport.type === 'medium_airport') {
        score += 5;
      }
      
      return { airport, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.airport);
    
    return scoredAirports;
  }

  async getAirportByCode(code: string): Promise<AirportData | null> {
    await this.loadAirportsFromCSV();
    return this.airports.find(airport => 
      airport.code.toLowerCase() === code.toLowerCase() ||
      airport.icao.toLowerCase() === code.toLowerCase()
    ) || null;
  }

  async getAllAirports(): Promise<AirportData[]> {
    await this.loadAirportsFromCSV();
    return this.airports;
  }

  async getPopularAirports(limit: number = 20): Promise<AirportData[]> {
    await this.loadAirportsFromCSV();
    // Return major international airports
    return this.airports
      .filter(airport => airport.type === 'large_airport')
      .slice(0, limit);
  }
}

// Export service instances
export const flightTrackingService = new FlightTrackingService();
export const weatherService = new WeatherService();
export const airportService = new AirportService();