
export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
}

export interface Tips {
  babies: string;
  kids: string;
  young_adults: string;
  older_adults: string;
}

export interface WeatherApiResponse {
  weather: WeatherData;
  tips: Tips;
}

export type AppStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';
