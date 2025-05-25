# WeatherDashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

A modern, responsive weather dashboard application that allows users to search for cities, view current weather conditions, and manage their favorite locations with persistent local storage.

## Features

- 🌤️ Real-time weather data from OpenWeatherMap API
- 🔍 City search with autocomplete suggestions
- 💾 Persistent city storage using localStorage
- 📱 Responsive design for all devices
- ⚡ Auto-refresh weather data every 2 hours
- 🎨 Modern UI with loading states and error handling

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

## Environment Setup

### 1. API Configuration

Create a `.env` file in the root directory of your project and add the following environment variables:

```bash
WEATHER_API_KEY=9f83326fc8146f342a2e718455b80c81
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

### 2. Environment Files

Update your environment files to use these variables:

**src/environments/environment.ts** (Development):
```typescript
export const environment = {
  production: false,
  weatherApiKey: 'your-development-api-key',
  weatherApiUrl: 'https://api.openweathermap.org/data/2.5'
};
```

**src/environments/environment.prod.ts** (Production):
```typescript
export const environment = {
  production: true,
  weatherApiKey: process.env['WEATHER_API_KEY'] || '',
  weatherApiUrl: process.env['WEATHER_API_URL'] || 'https://api.openweathermap.org/data/2.5'
};
```

### 3. Getting Your Own API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API keys section
4. Generate a new API key
5. Replace the API key in your `.env` file

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see Environment Setup above)

4. Start the development server:
```bash
ng serve
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Production Build

For production deployment:

```bash
ng build --configuration production
```

## Testing

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running unit tests with coverage

To generate a test coverage report:

```bash
ng test --code-coverage
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
weather-dashboard/
├── .angular/                # Angular CLI cache
├── .git/                    # Git repository
├── .vscode/                 # VS Code configuration
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/      # TypeScript interfaces and models
│   │   │   ├── services/    # Injectable services (WeatherService, StorageService)
│   │   │   └── testing/     # Test utilities and helpers
│   │   ├── features/
│   │   │   └── weather/
│   │   │       ├── city-card/           # City weather card component
│   │   │       └── weather-dashboard/   # Main dashboard component
│   │   ├── shared/
│   │   │   ├── animations/  # Reusable animations
│   │   │   └── components/  # Shared UI components
│   │   ├── app.component.html    # Root component template
│   │   ├── app.component.scss    # Root component styles
│   │   ├── app.component.ts      # Root component logic
│   │   ├── app.config.ts         # Application configuration
│   │   └── app.routes.ts         # Application routing
│   ├── environments/
│   │   ├── environment.prod.ts   # Production environment
│   │   └── environment.test.ts   # Test environment
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application entry point
│   └── styles.scss              # Global styles
├── .editorconfig               # Editor configuration
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore rules
├── angular.json               # Angular CLI configuration
├── custom-webpack.config.ts   # Custom Webpack configuration
├── package.json               # NPM dependencies and scripts
├── package-lock.json          # NPM lock file
└── README.md                  # Project documentation
```

## Usage

1. **Search for a city**: Type in the search box and select from autocomplete suggestions
2. **Add cities**: Click the add button or select from search suggestions
3. **View weather**: See current temperature, humidity, wind speed, and conditions
4. **Remove cities**: Click the remove button on any city card
5. **Auto-refresh**: Weather data updates automatically every 2 hours

## Deployment

### Environment Variables for Production

When deploying to production platforms, set these environment variables:

- `WEATHER_API_KEY`: Your OpenWeatherMap API key
- `WEATHER_API_URL`: https://api.openweathermap.org/data/2.5

### Common Deployment Platforms

**Vercel:**
```bash
vercel env add WEATHER_API_KEY
vercel env add WEATHER_API_URL
```

**Netlify:**
Add environment variables in Site Settings > Environment Variables

**Heroku:**
```bash
heroku config:set WEATHER_API_KEY=your-api-key
heroku config:set WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your API key is valid and not exceeded the rate limit
2. **CORS Issues**: The app uses the OpenWeatherMap API which supports CORS
3. **TypeScript Errors**: Make sure all dependencies are installed and environment files are properly configured

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## API Reference

This application uses the [OpenWeatherMap API](https://openweathermap.org/api):
- Current Weather Data API
- Geocoding API for city search
- Weather Icons