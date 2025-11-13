// API Configuration for DriveGuard
//
// IMPORTANT: For production, move these to environment variables
// Create a .env file with:
// VITE_TOMTOM_API_KEY=your_key_here
// VITE_OPENWEATHER_API_KEY=your_key_here

export const API_CONFIG = {
  tomtom: {
    apiKey:
      import.meta.env.VITE_TOMTOM_API_KEY || "l9Xv0Yb9tR42v3vlgz2nZvzwa2SLVCFK",
    endpoints: {
      trafficFlow: "https://api.tomtom.com/traffic/services/4/flowSegmentData",
      trafficIncidents:
        "https://api.tomtom.com/traffic/services/5/incidentDetails",
      trafficTiles: "https://api.tomtom.com/traffic/map/4/tile/flow",
    },
  },
  // Using Open-Meteo - FREE weather API, no key required!
  openMeteo: {
    endpoint: "https://api.open-meteo.com/v1/forecast",
  },
  openWeather: {
    // Backup option if you have OpenWeather API key
    apiKey:
      import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY",
    endpoint: "https://api.openweathermap.org/data/2.5/weather",
  },
};

export const MOCK_DATA_ENABLED = false; // Using real APIs now!
export const USE_OPEN_METEO = true; // Use free Open-Meteo instead of OpenWeather
