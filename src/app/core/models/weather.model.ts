export interface WeatherData {
  id: number;
  name: string;
  country: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  timestamp: Date;
}

export interface WeatherApiResponse {
  id: number;
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface GeocodingApiResponse {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}