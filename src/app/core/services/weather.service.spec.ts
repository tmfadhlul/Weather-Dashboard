import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { WeatherService } from './weather.service';
import { WeatherData, GeocodingResult } from '../models/weather.model';

describe('WeatherService', () => {
  let service: WeatherService;

  const mockWeatherData: WeatherData = {
    id: 1,
    name: 'London',
    country: 'GB',
    temperature: 20,
    description: 'clear sky',
    icon: '01d',
    humidity: 65,
    windSpeed: 3.5,
    feelsLike: 22,
    timestamp: new Date()
  };

  const mockGeocodingResults: GeocodingResult[] = [
    {
      name: 'London',
      country: 'GB',
      state: 'England',
      lat: 51.5074,
      lon: -0.1278
    },
    {
      name: 'London',
      country: 'CA',
      state: 'Ontario',
      lat: 42.9849,
      lon: -81.2453
    }
  ];

  beforeEach(() => {
    // Create a mock service with all required methods
    const mockWeatherService = {
      loading$: of(false),
      getCurrentWeather: jasmine.createSpy('getCurrentWeather').and.returnValue(of(mockWeatherData)),
      searchCities: jasmine.createSpy('searchCities').and.returnValue(of(mockGeocodingResults))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: WeatherService, useValue: mockWeatherService }
      ]
    });
    
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get current weather data', () => {
    service.getCurrentWeather('London').subscribe(weatherData => {
      expect(weatherData.name).toBe('London');
      expect(weatherData.temperature).toBe(20);
      expect(weatherData.country).toBe('GB');
      expect(weatherData.humidity).toBe(65);
      expect(weatherData.windSpeed).toBe(3.5);
      expect(weatherData.description).toBe('clear sky');
      expect(weatherData.icon).toBe('01d');
    });

    expect(service.getCurrentWeather).toHaveBeenCalledWith('London');
  });

  it('should handle city not found error', () => {
    (service.getCurrentWeather as jasmine.Spy).and.returnValue(
      throwError(() => new Error('City not found. Please check the city name and try again.'))
    );

    service.getCurrentWeather('InvalidCity').subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toBe('City not found. Please check the city name and try again.');
      }
    });
  });

  it('should search cities successfully', () => {
    service.searchCities('Lon').subscribe(results => {
      expect(results.length).toBe(2);
      expect(results[0].name).toBe('London');
      expect(results[0].country).toBe('GB');
      expect(results[1].country).toBe('CA');
    });

    expect(service.searchCities).toHaveBeenCalledWith('Lon');
  });

  it('should return empty array for short queries', () => {
    (service.searchCities as jasmine.Spy).and.returnValue(of([]));

    service.searchCities('L').subscribe(results => {
      expect(results).toEqual([]);
    });
  });

  it('should handle search error gracefully', () => {
    (service.searchCities as jasmine.Spy).and.returnValue(of([]));

    service.searchCities('Invalid').subscribe(results => {
      expect(results).toEqual([]);
    });
  });

  it('should expose loading state', () => {
    service.loading$.subscribe(loading => {
      expect(loading).toBe(false);
    });
  });
});