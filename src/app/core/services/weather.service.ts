import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, retry, shareReplay, finalize } from 'rxjs/operators';
import { environment } from '../../../environtments/environtment.prod';
import { WeatherData, WeatherApiResponse, GeocodingResult, GeocodingApiResponse } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private readonly API_KEY = environment.weatherApiKey;
  private readonly API_URL = environment.weatherApiUrl;
  private readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0';
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  getCurrentWeather(cityName: string): Observable<WeatherData> {
    this.loadingSubject.next(true);
    
    const url = `${this.API_URL}/weather?q=${cityName}&appid=${this.API_KEY}&units=metric`;
    
    return this.http.get<WeatherApiResponse>(url).pipe(
      retry(2),
      map(response => this.transformWeatherData(response)),
      shareReplay(1),
      catchError(this.handleError),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  searchCities(query: string): Observable<GeocodingResult[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const url = `${this.GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.API_KEY}`;
    
    return this.http.get<GeocodingApiResponse[]>(url).pipe(
      map(response => response.map(item => this.transformGeocodingData(item))),
      catchError(() => of([])) // Return empty array on error for search
    );
  }

  private transformWeatherData(response: WeatherApiResponse): WeatherData {
    return {
      id: response.id,
      name: response.name,
      country: response.sys.country,
      temperature: Math.round(response.main.temp),
      description: response.weather[0].description,
      icon: response.weather[0].icon,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      feelsLike: Math.round(response.main.feels_like),
      timestamp: new Date()
    };
  }

  private transformGeocodingData(response: GeocodingApiResponse): GeocodingResult {
    return {
      name: response.name,
      country: response.country,
      state: response.state,
      lat: response.lat,
      lon: response.lon
    };
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An error occurred while fetching weather data';
    
    if (error.status === 404) {
      errorMessage = 'City not found. Please check the city name and try again.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    }
    
    return throwError(() => new Error(errorMessage));
  };
}