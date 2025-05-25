import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'weather-dashboard-cities';
  private citiesSubject = new BehaviorSubject<WeatherData[]>([]);

  public cities$ = this.citiesSubject.asObservable();

  constructor() {
    this.loadCitiesFromStorage();
  }

  addCity(weatherData: WeatherData): void {
    const currentCities = this.citiesSubject.value;
    const cityExists = currentCities.some(city => city.id === weatherData.id);

    if (!cityExists) {
      const updatedCities = [...currentCities, weatherData];
      this.updateCities(updatedCities);
    }
  }

  removeCity(cityId: number): void {
    const currentCities = this.citiesSubject.value;
    const updatedCities = currentCities.filter(city => city.id !== cityId);
    this.updateCities(updatedCities);
  }

  private updateCities(cities: WeatherData[]): void {
    this.citiesSubject.next(cities);
    this.saveCitiesToStorage(cities);
  }

  private loadCitiesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const cities = JSON.parse(stored) as WeatherData[];
        this.citiesSubject.next(cities);
      }
    } catch (error) {
      console.error('Error loading cities from storage:', error);
    }
  }

  private saveCitiesToStorage(cities: WeatherData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cities));
    } catch (error) {
      console.error('Error saving cities to storage:', error);
    }
  }
}
