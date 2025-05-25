export const environment = {
  production: true,
  weatherApiKey: process.env['WEATHER_API_KEY'] || '',
  weatherApiUrl: process.env['WEATHER_API_URL'] || 'https://api.openweathermap.org/data/2.5'
};