import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityCardComponent } from './city-card.component';
import { WeatherData } from '../../../core/models/weather.model';

describe('CityCardComponent', () => {
  let component: CityCardComponent;
  let fixture: ComponentFixture<CityCardComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CityCardComponent);
    component = fixture.componentInstance;
    component.weatherData = mockWeatherData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit remove event with weather data id', () => {
    spyOn(component.remove, 'emit');
    
    component.onRemove();
    
    expect(component.remove.emit).toHaveBeenCalledWith(1);
  });

  it('should emit refresh event with weather data id', () => {
    spyOn(component.refresh, 'emit');
    
    component.onRefresh();
    
    expect(component.refresh.emit).toHaveBeenCalledWith(1);
  });

  it('should return correct weather icon URL', () => {
    const expectedUrl = 'https://openweathermap.org/img/wn/01d@2x.png';
    
    const result = component.getWeatherIconUrl();
    
    expect(result).toBe(expectedUrl);
  });

  it('should format description with first letter capitalized', () => {
    expect(component.formatDescription('clear sky')).toBe('Clear sky');
    expect(component.formatDescription('SUNNY')).toBe('SUNNY');
    expect(component.formatDescription('partly cloudy')).toBe('Partly cloudy');
  });

  it('should handle empty description', () => {
    expect(component.formatDescription('')).toBe('');
  });
});