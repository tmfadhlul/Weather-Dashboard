import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-weather-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.scss']
})
export class WeatherDashboardComponent {
  cityControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.pattern(/^[a-zA-Z\s-'\.]+$/)
  ]);

  cities: any[] = [];

  addCity(): void {
    if (this.cityControl.valid && this.cityControl.value) {
      const cityName = this.cityControl.value.trim();

      const cityExists = this.cities.some(city =>
        city.name.toLowerCase() === cityName.toLowerCase()
      );

      if (!cityExists) {
        this.cities.push({
          name: cityName,
          temperature: Math.floor(Math.random() * 30) + 5,
          description: this.getRandomWeatherDescription(),
          humidity: Math.floor(Math.random() * 40) + 40, 
          windSpeed: Math.floor(Math.random() * 10) + 2 
        });
        this.cityControl.reset();
      } else {
        console.log('City already exists!');
      }
    }
  }

  removeCity(index: number): void {
    this.cities.splice(index, 1);
  }

  private getRandomWeatherDescription(): string {
    const descriptions = [
      'Clear sky', 'Few clouds', 'Scattered clouds', 'Broken clouds',
      'Light rain', 'Moderate rain', 'Sunny', 'Partly cloudy',
      'Overcast', 'Mist', 'Light snow', 'Thunderstorm'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  get hasValidInput(): boolean {
    return this.cityControl.valid && !!this.cityControl.value?.trim();
  }
}
