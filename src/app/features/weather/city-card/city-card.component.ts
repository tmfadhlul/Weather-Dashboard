import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../../core/models/weather.model';

@Component({
  selector: 'app-city-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.scss']
})
export class CityCardComponent {
  @Input() weatherData!: WeatherData;
  @Output() remove = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<number>();

  onRemove(): void {
    this.remove.emit(this.weatherData.id);
  }

  onRefresh(): void {
    this.refresh.emit(this.weatherData.id);
  }

  getWeatherIconUrl(): string {
    return `https://openweathermap.org/img/wn/${this.weatherData.icon}@2x.png`;
  }

  formatDescription(description: string): string {
    return description.charAt(0).toUpperCase() + description.slice(1);
  }
}
