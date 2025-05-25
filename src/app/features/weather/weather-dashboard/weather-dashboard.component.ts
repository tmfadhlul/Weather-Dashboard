import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { WeatherService } from '../../../core/services/weather.service';
import { StorageService } from '../../../core/services/storage.service';
import { WeatherData, GeocodingResult } from '../../../core/models/weather.model';
import { BehaviorSubject, Subject, interval, from, EMPTY } from 'rxjs';
import { takeUntil, switchMap, catchError, concatMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent implements OnDestroy {
  private weatherService = inject(WeatherService);
  private storageService = inject(StorageService);
  private destroy$ = new Subject<void>();
  private citiesSubject = new BehaviorSubject<WeatherData[]>([]);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private searchResults = new BehaviorSubject<GeocodingResult[]>([]);
  
  searchResults$ = this.searchResults.asObservable();
  showSuggestions = false;

  cities$ = this.storageService.cities$;
  error$ = this.errorSubject.asObservable();
  loading$ = this.weatherService.loading$;

  cityControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(/^[a-zA-Z\s-'\.]+$/)
  ]);

  constructor() {
    this.setupAutoRefresh();
    this.setupCitySearch();
  }

  private setupAutoRefresh(): void {
    // Update weather data every 2 hours
    interval(7200000).pipe(
      takeUntil(this.destroy$),
      switchMap(() => {
        let currentCities: WeatherData[] = [];
        this.storageService.cities$.pipe(takeUntil(this.destroy$)).subscribe(cities => {
          currentCities = cities;
        });

        if (currentCities.length === 0) return EMPTY;

        return from(currentCities).pipe(
          concatMap(city => this.weatherService.getCurrentWeather(city.name)),
          catchError(error => {
            this.errorSubject.next('Failed to update weather data');
            return EMPTY;
          })
        );
      })
    ).subscribe(updatedCity => {
      if (updatedCity) {
        this.storageService.removeCity(updatedCity.id);
        this.storageService.addCity(updatedCity);
      }
    });
  }

  private setupCitySearch(): void {
    this.cityControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) {
          this.searchResults.next([]);
          this.showSuggestions = false;
          return EMPTY;
        }
        return this.weatherService.searchCities(query);
      })
    ).subscribe(results => {
      this.searchResults.next(results);
      this.showSuggestions = results.length > 0;
    });
  }

  addCity(): void {
    if (this.cityControl.valid && this.cityControl.value) {
      const cityName = this.cityControl.value.trim();
      let currentCities: WeatherData[] = [];
      this.storageService.cities$.pipe(takeUntil(this.destroy$)).subscribe(cities => {
        currentCities = cities;
      });

      const cityExists = currentCities.some(city =>
        city.name.toLowerCase() === cityName.toLowerCase()
      );

      if (!cityExists) {
        this.weatherService.getCurrentWeather(cityName).pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            this.errorSubject.next(error.message || 'Failed to fetch weather data');
            return EMPTY;
          })
        ).subscribe(weatherData => {
          this.storageService.addCity(weatherData);
          this.cityControl.reset();
          this.errorSubject.next(null);
          this.showSuggestions = false;
        });
      } else {
        this.errorSubject.next('City already exists!');
      }
    }
  }

  removeCity(index: number): void {
    this.storageService.cities$.pipe(takeUntil(this.destroy$)).subscribe(cities => {
      if (cities[index]) {
        this.storageService.removeCity(cities[index].id);
      }
    });
  }

  selectCity(result: GeocodingResult): void {
    this.cityControl.setValue(result.name);
    this.showSuggestions = false;
    this.addCity();
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  onInputFocus(): void {
    const query = this.cityControl.value;
    if (query && query.length >= 2) {
      this.showSuggestions = true;
    }
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  get hasValidInput(): boolean {
    return this.cityControl.valid && !!this.cityControl.value?.trim();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}