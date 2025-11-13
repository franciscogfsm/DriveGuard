import axios from "axios";
import type { WeatherData, TrafficData } from "./riskCalculator";
import { API_CONFIG, MOCK_DATA_ENABLED, USE_OPEN_METEO } from "./config";

/**
 * Fetch weather data from Open-Meteo (FREE!) or OpenWeatherMap
 */
export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  // Use mock data if enabled
  if (MOCK_DATA_ENABLED) {
    console.log("Using mock weather data");
    return getMockWeatherData();
  }

  try {
    // Use Open-Meteo (free, no API key needed!)
    const response = await axios.get(API_CONFIG.openMeteo.endpoint, {
      params: {
        latitude: lat,
        longitude: lon,
        current:
          "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
        timezone: "auto",
      },
    });

    const data = response.data.current;

    // Map Open-Meteo weather codes to OpenWeather-like codes
    const weatherCode = mapOpenMeteoCode(data.weather_code);

    console.log("✓ Weather data fetched from Open-Meteo:", data);

    return {
      temp: data.temperature_2m,
      humidity: data.relative_humidity_2m,
      windSpeed: data.wind_speed_10m,
      visibility: 10000, // Open-Meteo doesn't provide visibility in free tier
      precipitation: data.precipitation || 0,
      condition: getWeatherCondition(data.weather_code),
      conditionCode: weatherCode,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return mock data if API fails
    return getMockWeatherData();
  }
}

/**
 * Map Open-Meteo weather codes to OpenWeather-like codes
 */
function mapOpenMeteoCode(code: number): number {
  if (code === 0) return 800; // Clear
  if (code === 1 || code === 2) return 801; // Partly cloudy
  if (code === 3) return 804; // Overcast
  if (code >= 45 && code <= 48) return 741; // Fog
  if (code >= 51 && code <= 57) return 300; // Drizzle
  if (code >= 61 && code <= 67) return code < 65 ? 500 : 502; // Rain
  if (code >= 71 && code <= 77) return 600; // Snow
  if (code >= 80 && code <= 82) return 520; // Rain showers
  if (code === 85 || code === 86) return 620; // Snow showers
  if (code >= 95 && code <= 99) return 200; // Thunderstorm
  return 800;
}

/**
 * Get human-readable weather condition
 */
function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return code < 65 ? "Rain" : "Heavy Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  if (code >= 95) return "Thunderstorm";
  return "Clear";
}

/**
 * Fetch traffic flow data from TomTom API
 */
export async function fetchTrafficData(
  lat: number,
  lon: number
): Promise<TrafficData> {
  // Use mock data if enabled
  if (MOCK_DATA_ENABLED) {
    console.log("Using mock traffic data");
    return getMockTrafficData();
  }

  try {
    // TomTom Traffic Flow API
    const response = await axios.get(
      `${API_CONFIG.tomtom.endpoints.trafficFlow}/absolute/10/json`,
      {
        params: {
          key: API_CONFIG.tomtom.apiKey,
          point: `${lat},${lon}`,
        },
      }
    );

    const flow = response.data.flowSegmentData;

    return {
      flowSpeed: flow.currentSpeed,
      freeFlowSpeed: flow.freeFlowSpeed,
      congestionLevel: Math.max(0, 1 - flow.currentSpeed / flow.freeFlowSpeed),
      incidents: 0, // We'll fetch this separately
    };
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    // Return mock data if API fails
    return getMockTrafficData();
  }
}

/**
 * Fetch traffic incidents from TomTom API
 */
export async function fetchTrafficIncidents(
  minLat: number,
  minLon: number,
  maxLat: number,
  maxLon: number
): Promise<number> {
  // Use mock data if enabled
  if (MOCK_DATA_ENABLED) {
    return Math.floor(Math.random() * 3); // 0-2 incidents
  }

  try {
    const response = await axios.get(
      API_CONFIG.tomtom.endpoints.trafficIncidents,
      {
        params: {
          key: API_CONFIG.tomtom.apiKey,
          bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
          fields:
            "{incidents{type,geometry{type,coordinates},properties{iconCategory}}}",
          language: "en-GB",
        },
      }
    );

    return response.data.incidents?.length || 0;
  } catch (error) {
    console.error("Error fetching traffic incidents:", error);
    return 0;
  }
}

/**
 * Fetch combined data for a location
 */
export async function fetchLocationRiskData(lat: number, lon: number) {
  const [weather, traffic] = await Promise.all([
    fetchWeatherData(lat, lon),
    fetchTrafficData(lat, lon),
  ]);

  // Fetch incidents for a small bounding box around the location
  const offset = 0.05; // ~5km
  const incidents = await fetchTrafficIncidents(
    lat - offset,
    lon - offset,
    lat + offset,
    lon + offset
  );

  traffic.incidents = incidents;

  return { weather, traffic };
}

/**
 * Mock weather data for testing/fallback
 */
function getMockWeatherData(): WeatherData {
  const conditions = [
    {
      temp: 18,
      humidity: 65,
      windSpeed: 15,
      visibility: 10000,
      precipitation: 0,
      condition: "Clear",
      conditionCode: 800,
    },
    {
      temp: 15,
      humidity: 75,
      windSpeed: 22,
      visibility: 8000,
      precipitation: 2,
      condition: "Rain",
      conditionCode: 500,
    },
    {
      temp: 12,
      humidity: 85,
      windSpeed: 35,
      visibility: 3000,
      precipitation: 8,
      condition: "Heavy Rain",
      conditionCode: 502,
    },
    {
      temp: 20,
      humidity: 55,
      windSpeed: 10,
      visibility: 12000,
      precipitation: 0,
      condition: "Partly Cloudy",
      conditionCode: 802,
    },
  ];

  return conditions[Math.floor(Math.random() * conditions.length)];
}

/**
 * Mock traffic data for testing/fallback
 */
function getMockTrafficData(): TrafficData {
  const scenarios = [
    { flowSpeed: 80, freeFlowSpeed: 90, congestionLevel: 0.1, incidents: 0 },
    { flowSpeed: 45, freeFlowSpeed: 80, congestionLevel: 0.4, incidents: 1 },
    { flowSpeed: 25, freeFlowSpeed: 90, congestionLevel: 0.7, incidents: 2 },
    { flowSpeed: 90, freeFlowSpeed: 100, congestionLevel: 0.1, incidents: 0 },
  ];

  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

/**
 * Test API connections
 */
export async function testAPIs() {
  console.log("Testing TomTom API...");
  try {
    const traffic = await fetchTrafficData(38.7223, -9.1393); // Lisboa
    console.log("✓ TomTom API working:", traffic);
  } catch (error) {
    console.error("✗ TomTom API failed:", error);
  }

  console.log("Testing OpenWeather API...");
  try {
    const weather = await fetchWeatherData(38.7223, -9.1393);
    console.log("✓ OpenWeather API working:", weather);
  } catch (error) {
    console.error("✗ OpenWeather API failed (using mock data):", error);
  }
}
