import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Wind, Thermometer, MapPin, Eye, Droplets } from "lucide-react";

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  description: string;
}

interface WeatherWidgetProps {
  latitude?: number;
  longitude?: number;
  location?: string;
  className?: string;
}

export default function WeatherWidget({ 
  latitude = 40.6413, 
  longitude = -73.7781, 
  location = "JFK Area",
  className = ""
}: WeatherWidgetProps) {
  const { data: weatherData, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/weather", latitude.toString(), longitude.toString()],
    queryFn: async () => {
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      return response.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-3"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Weather data unavailable</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2 || code === 3) return "⛅";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "🌨️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95 && code <= 99) return "⛈️";
    return "🌤️";
  };

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Cloud className="h-5 w-5" />
          Current Weather - {location}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getWeatherIcon(weatherData.weathercode)}</div>
            <div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {weatherData.temperature}°C
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                {weatherData.description}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Live
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-600" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {weatherData.windspeed} km/h
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                {getWindDirection(weatherData.winddirection)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {weatherData.winddirection}°
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                Wind Dir
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <div className="text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100">
                Good
              </div>
              <div className="text-blue-600 dark:text-blue-400">
                Visibility
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            ℹ️ Weather conditions are updated every 5 minutes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
