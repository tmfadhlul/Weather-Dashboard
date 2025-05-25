import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { WeatherData } from '../models/weather.model';

describe('StorageService', () => {
  let service: StorageService;
  let localStorageSpy: jasmine.Spy;

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

  const mockWeatherData2: WeatherData = {
    id: 2,
    name: 'Paris',
    country: 'FR',
    temperature: 18,
    description: 'partly cloudy',
    icon: '02d',
    humidity: 70,
    windSpeed: 2.5,
    feelsLike: 19,
    timestamp: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load cities from localStorage on initialization', () => {
    const storedCities = JSON.stringify([mockWeatherData]);
    localStorageSpy.and.returnValue(storedCities);
    
    service = new StorageService();
    
    service.cities$.subscribe(cities => {
      expect(cities.length).toBe(1);
      expect(cities[0].name).toBe('London');
    });
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorageSpy.and.returnValue('invalid json');
    spyOn(console, 'error');
    
    expect(() => new StorageService()).not.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it('should add city if it does not exist', () => {
    service.addCity(mockWeatherData);
    
    service.cities$.subscribe(cities => {
      expect(cities).toContain(mockWeatherData);
      expect(cities.length).toBe(1);
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'weather-dashboard-cities',
      JSON.stringify([mockWeatherData])
    );
  });

  it('should not add duplicate city', () => {
    service.addCity(mockWeatherData);
    service.addCity(mockWeatherData); 
    
    service.cities$.subscribe(cities => {
      expect(cities.length).toBe(1);
    });
  });

  it('should remove city by id', () => {
    service.addCity(mockWeatherData);
    service.addCity(mockWeatherData2);
    
    service.removeCity(1);
    
    service.cities$.subscribe(cities => {
      expect(cities.length).toBe(1);
      expect(cities[0].name).toBe('Paris');
    });
  });

  it('should handle localStorage getItem error during initialization', () => {
    localStorageSpy.and.throwError('Storage error');
    spyOn(console, 'error');
    
    expect(() => new StorageService()).not.toThrow();
    expect(console.error).toHaveBeenCalledWith('Error loading cities from storage:', jasmine.any(Error));
  });

  it('should update cities and save to storage', () => {
    const cities = [mockWeatherData, mockWeatherData2];
    
    service['updateCities'](cities);
    
    service.cities$.subscribe(currentCities => {
      expect(currentCities).toEqual(cities);
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'weather-dashboard-cities',
      JSON.stringify(cities)
    );
  });
});
