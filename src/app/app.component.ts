import { Component } from '@angular/core';
import { WeatherDashboardComponent } from './features/weather/weather-dashboard/weather-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherDashboardComponent],
  template: `<app-weather-dashboard></app-weather-dashboard>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weather-dashboard';
}
