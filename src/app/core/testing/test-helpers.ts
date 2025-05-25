import { WeatherData, GeocodingResult } from '../models/weather.model';

export class TestHelpers {
  static createMockWeatherData(overrides: Partial<WeatherData> = {}): WeatherData {
    return {
      id: 1,
      name: 'London',
      country: 'GB',
      temperature: 20,
      description: 'clear sky',
      icon: '01d',
      humidity: 65,
      windSpeed: 3.5,
      feelsLike: 22,
      timestamp: new Date(),
      ...overrides
    };
  }

  static createMockGeocodingResult(overrides: Partial<GeocodingResult> = {}): GeocodingResult {
    return {
      name: 'London',
      country: 'GB',
      state: 'England',
      lat: 51.5074,
      lon: -0.1278,
      ...overrides
    };
  }

  static mockLocalStorage() {
    const store: { [key: string]: string } = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      Object.keys(store).forEach(key => delete store[key]);
    });
  }

  // Additional mock data for complex scenarios
  static createMultipleMockCities(): WeatherData[] {
    return [
      this.createMockWeatherData({ id: 1, name: 'London', country: 'GB' }),
      this.createMockWeatherData({ id: 2, name: 'Paris', country: 'FR', temperature: 18 }),
      this.createMockWeatherData({ id: 3, name: 'Tokyo', country: 'JP', temperature: 25 }),
    ];
  }

  static createMockError(message: string = 'Test error'): Error {
    return new Error(message);
  }
}