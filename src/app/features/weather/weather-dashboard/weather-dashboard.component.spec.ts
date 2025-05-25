import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { WeatherDashboardComponent } from './weather-dashboard.component';
import { WeatherService } from '../../../core/services/weather.service';
import { WeatherData, GeocodingResult } from '../../../core/models/weather.model';

describe('WeatherDashboardComponent', () => {
  let component: WeatherDashboardComponent;
  let fixture: ComponentFixture<WeatherDashboardComponent>;
  let weatherServiceSpy: jasmine.SpyObj<WeatherService>;

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
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('WeatherService', ['getCurrentWeather', 'searchCities'], {
      loading$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [WeatherDashboardComponent, ReactiveFormsModule],
      providers: [
        { provide: WeatherService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherDashboardComponent);
    component = fixture.componentInstance;
    weatherServiceSpy = TestBed.inject(WeatherService) as jasmine.SpyObj<WeatherService>;

    weatherServiceSpy.getCurrentWeather.and.returnValue(of(mockWeatherData));
    weatherServiceSpy.searchCities.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form control with validators', () => {
    expect(component.cityControl).toBeDefined();
    expect(component.cityControl.hasError('required')).toBeTruthy();
    
    component.cityControl.setValue('a');
    expect(component.cityControl.hasError('minlength')).toBeTruthy();
    
    component.cityControl.setValue('123');
    expect(component.cityControl.hasError('pattern')).toBeTruthy();
    
    component.cityControl.setValue('London');
    expect(component.cityControl.valid).toBeTruthy();
  });

  it('should setup city search with debounce', fakeAsync(() => {
    weatherServiceSpy.searchCities.and.returnValue(of(mockGeocodingResults));
    
    component.cityControl.setValue('Lon');
    tick(300);
    
    expect(weatherServiceSpy.searchCities).toHaveBeenCalledWith('Lon');
    expect(component.showSuggestions).toBeTruthy();
  }));

  it('should not search for queries less than 2 characters', fakeAsync(() => {
    weatherServiceSpy.searchCities.calls.reset();
    component.cityControl.setValue('L');
    tick(300);
    
    expect(weatherServiceSpy.searchCities).not.toHaveBeenCalled();
    expect(component.showSuggestions).toBeFalsy();
  }));

  it('should add city successfully', fakeAsync(() => {
    weatherServiceSpy.getCurrentWeather.and.returnValue(of(mockWeatherData));
    
    component.cityControl.setValue('London');
    component.addCity();
    tick();
    
    expect(weatherServiceSpy.getCurrentWeather).toHaveBeenCalledWith('London');
    
    component.cities$.subscribe(cities => {
      expect(cities).toContain(mockWeatherData);
    });
    
    expect(component.cityControl.value).toBeNull();
  }));

  it('should not add duplicate city', (done) => {
    component['citiesSubject'].next([mockWeatherData]);
    
    component.cityControl.setValue('London');
    component.addCity();
    
    component.error$.subscribe(error => {
      expect(error).toBe('City already exists!');
      done(); 
    });
  });

  it('should remove city by index', () => {
    const cities = [mockWeatherData, { ...mockWeatherData, id: 2, name: 'Paris' }];
    component['citiesSubject'].next(cities);
    
    component.removeCity(0);
    
    component.cities$.subscribe(updatedCities => {
      expect(updatedCities.length).toBe(1);
      expect(updatedCities[0].name).toBe('Paris');
    });
  });

  it('should select city from suggestions', () => {
    spyOn(component, 'addCity');
    
    component.selectCity(mockGeocodingResults[0]);
    
    expect(component.cityControl.value).toBe('London');
    expect(component.showSuggestions).toBeFalsy();
    expect(component.addCity).toHaveBeenCalled();
  });

  it('should clear error', () => {
    component['errorSubject'].next('Some error');
    
    component.clearError();
    
    component.error$.subscribe(error => {
      expect(error).toBeNull();
    });
  });

  it('should show suggestions on input focus', () => {
    component.cityControl.setValue('London');
    
    component.onInputFocus();
    
    expect(component.showSuggestions).toBeTruthy();
  });

  it('should hide suggestions on input blur', fakeAsync(() => {
    component.showSuggestions = true;
    
    component.onInputBlur();
    tick(200);
    
    expect(component.showSuggestions).toBeFalsy();
  }));

  it('should validate input correctly', () => {
    expect(component.hasValidInput).toBeFalsy();
    
    component.cityControl.setValue('London');
    expect(component.hasValidInput).toBeTruthy();
    
    component.cityControl.setValue('  ');
    expect(component.hasValidInput).toBeFalsy();
  });

  it('should complete destroy subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});