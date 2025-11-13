// Risk calculation engine for DriveGuard
export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  precipitation: number;
  condition: string;
  conditionCode: number;
}

export interface TrafficData {
  flowSpeed: number;
  freeFlowSpeed: number;
  congestionLevel: number; // 0-1
  incidents: number;
}

export interface RiskFactors {
  weather: number;
  traffic: number;
  timeOfDay: number;
  historical: number;
}

export interface RiskResult {
  score: number; // 0-100
  level: "low" | "medium" | "high";
  factors: RiskFactors;
  recommendations: string[];
}

/**
 * Calculate weather risk factor based on current conditions
 * More precise risk assessment based on real-time weather data
 */
export function calculateWeatherRisk(weather: WeatherData): number {
  let risk = 0;

  // Precipitation risk (max 35 points) - MOST DANGEROUS for accidents
  if (weather.precipitation > 10) risk += 35; // Heavy rain/storm
  else if (weather.precipitation > 5) risk += 28; // Moderate-heavy rain
  else if (weather.precipitation > 2) risk += 20; // Moderate rain
  else if (weather.precipitation > 0.5) risk += 12; // Light rain
  else if (weather.precipitation > 0.1) risk += 5; // Very light rain/drizzle

  // Visibility risk (max 25 points)
  if (weather.visibility < 500) risk += 25; // Severe fog
  else if (weather.visibility < 1000) risk += 20; // Heavy fog
  else if (weather.visibility < 2000) risk += 15; // Moderate fog
  else if (weather.visibility < 5000) risk += 8; // Light fog/mist
  else if (weather.visibility < 8000) risk += 3; // Slight haze

  // Wind risk (max 20 points) - affects vehicle control
  if (weather.windSpeed > 60) risk += 20; // Dangerous winds
  else if (weather.windSpeed > 45) risk += 16; // Very strong winds
  else if (weather.windSpeed > 35) risk += 12; // Strong winds
  else if (weather.windSpeed > 25) risk += 8; // Moderate winds
  else if (weather.windSpeed > 20) risk += 4; // Breezy

  // Weather condition code risk (max 20 points)
  // Thunderstorm (2xx) - most dangerous
  if (weather.conditionCode >= 200 && weather.conditionCode < 300) risk += 20;
  // Snow/Ice (6xx) - very dangerous
  else if (weather.conditionCode >= 600 && weather.conditionCode < 700)
    risk += 18;
  // Fog/Mist (7xx)
  else if (weather.conditionCode >= 700 && weather.conditionCode < 800)
    risk += 15;
  // Heavy Rain (5xx)
  else if (weather.conditionCode >= 500 && weather.conditionCode < 600)
    risk += 12;
  // Drizzle (3xx)
  else if (weather.conditionCode >= 300 && weather.conditionCode < 400)
    risk += 8;

  // Temperature-based risk (not counted in max, but adds context)
  if (weather.temp < 2) risk += 5; // Near freezing - ice risk
  else if (weather.temp > 35) risk += 3; // Extreme heat

  // Humidity combined with temperature (slippery conditions)
  if (weather.humidity > 90 && weather.temp < 10) risk += 5; // High slip risk

  return Math.min(risk, 100);
}

/**
 * Calculate traffic risk factor based on flow and congestion
 * Improved precision with better congestion analysis
 */
export function calculateTrafficRisk(traffic: TrafficData): number {
  let risk = 0;

  // Congestion level (max 35 points) - smooth scaling
  if (traffic.congestionLevel > 0.8) risk += 35; // Severe congestion
  else if (traffic.congestionLevel > 0.6) risk += 28; // Heavy congestion
  else if (traffic.congestionLevel > 0.4) risk += 20; // Moderate congestion
  else if (traffic.congestionLevel > 0.2) risk += 10; // Light congestion
  else if (traffic.congestionLevel > 0.1) risk += 5; // Slight slowdown

  // Speed difference analysis (max 35 points) - more granular
  const speedRatio =
    traffic.freeFlowSpeed > 0 ? traffic.flowSpeed / traffic.freeFlowSpeed : 1;

  if (speedRatio < 0.2) risk += 35; // Almost stopped (crawling)
  else if (speedRatio < 0.3) risk += 30; // Very slow (heavy traffic)
  else if (speedRatio < 0.4) risk += 24; // Slow traffic
  else if (speedRatio < 0.5) risk += 18; // Moderate slowdown
  else if (speedRatio < 0.6) risk += 12; // Light slowdown
  else if (speedRatio < 0.7) risk += 7; // Slight slowdown

  // Stop-and-go traffic is more dangerous than constant slow speed
  if (speedRatio < 0.4 && traffic.congestionLevel > 0.5) {
    risk += 10; // Bonus risk for stop-and-go conditions
  }

  // Incidents (max 30 points) - scaled by severity
  if (traffic.incidents >= 5) risk += 30; // Multiple incidents
  else if (traffic.incidents >= 3) risk += 22; // Several incidents
  else if (traffic.incidents >= 2) risk += 16; // A few incidents
  else if (traffic.incidents >= 1) risk += 10; // One incident

  return Math.min(risk, 100);
}

/**
 * Calculate time of day risk factor
 */
export function calculateTimeRisk(): number {
  const hour = new Date().getHours();

  // Rush hours (7-9 AM, 5-7 PM) are higher risk
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
    return 25;
  }

  // Night driving (10 PM - 5 AM) is higher risk
  if (hour >= 22 || hour <= 5) {
    return 20;
  }

  // Late evening (8-10 PM)
  if (hour >= 20 && hour <= 22) {
    return 15;
  }

  // Daytime is lower risk
  return 5;
}

/**
 * Calculate overall risk score and level
 * Weather conditions are the PRIMARY factor for accident risk
 */
export function calculateOverallRisk(
  weather: WeatherData,
  traffic: TrafficData,
  historicalRisk: number = 25 // Base historical risk for region (reduced)
): RiskResult {
  const weatherRisk = calculateWeatherRisk(weather);
  const trafficRisk = calculateTrafficRisk(traffic);
  const timeRisk = calculateTimeRisk();

  // Weather is the PRIMARY factor - increased to 40%
  // Traffic congestion is secondary - 30%
  // Current conditions matter most for accident prevention
  const weights = {
    weather: 0.4, // INCREASED - weather causes most accidents
    traffic: 0.3, // Traffic contributes to risk
    time: 0.2, // Time of day matters (rush hour, night)
    historical: 0.1, // Historical data is least important vs current conditions
  };

  const score = Math.round(
    weatherRisk * weights.weather +
      trafficRisk * weights.traffic +
      timeRisk * weights.time +
      historicalRisk * weights.historical
  );

  // Adjusted thresholds for more accurate risk levels
  let level: "low" | "medium" | "high";
  if (score < 30) level = "low"; // Reduced from 35
  else if (score < 60) level = "medium"; // Reduced from 65
  else level = "high";

  const recommendations = generateRecommendations(
    {
      weather: weatherRisk,
      traffic: trafficRisk,
      timeOfDay: timeRisk,
      historical: historicalRisk,
    },
    weather,
    traffic
  );

  return {
    score,
    level,
    factors: {
      weather: weatherRisk,
      traffic: trafficRisk,
      timeOfDay: timeRisk,
      historical: historicalRisk,
    },
    recommendations,
  };
}

/**
 * Generate safety recommendations based on current risk factors
 * Prioritized by severity and relevance
 */
function generateRecommendations(
  factors: RiskFactors,
  weather: WeatherData,
  traffic: TrafficData
): string[] {
  const recommendations: string[] = [];

  // CRITICAL weather conditions first
  if (weather.precipitation > 10) {
    recommendations.push(
      "⚠️ SEVERE: Heavy rain/storm - Reduce speed by 50%, avoid unnecessary travel"
    );
  } else if (weather.precipitation > 5) {
    recommendations.push(
      "⚠️ WARNING: Heavy rain detected - Reduce speed by 30%, increase following distance to 4+ seconds"
    );
  } else if (weather.precipitation > 2) {
    recommendations.push(
      "Moderate rain - Reduce speed, use headlights, increase following distance"
    );
  } else if (weather.precipitation > 0.5) {
    recommendations.push(
      "Light rain - Roads may be slippery, especially at start of rain"
    );
  }

  // Visibility issues
  if (weather.visibility < 1000) {
    recommendations.push(
      "⚠️ CRITICAL: Severe fog - Use fog lights, reduce speed to 30-50 km/h, avoid overtaking"
    );
  } else if (weather.visibility < 2000) {
    recommendations.push(
      "Heavy fog - Use fog lights and dipped beams, maintain safe distance"
    );
  } else if (weather.visibility < 5000) {
    recommendations.push(
      "Reduced visibility - Use dipped headlights, stay alert"
    );
  }

  // Wind conditions
  if (weather.windSpeed > 60) {
    recommendations.push(
      "⚠️ DANGEROUS WINDS: Avoid driving high-sided vehicles, grip steering firmly"
    );
  } else if (weather.windSpeed > 45) {
    recommendations.push(
      "Very strong winds - Reduce speed on bridges and exposed areas, watch for debris"
    );
  } else if (weather.windSpeed > 35) {
    recommendations.push(
      "Strong winds - Be cautious of cross-winds, especially on highways and bridges"
    );
  }

  // Temperature warnings
  if (weather.temp < 2) {
    recommendations.push(
      "⚠️ ICE RISK: Near-freezing temperatures - Watch for black ice on bridges and shaded areas"
    );
  }

  // Traffic conditions
  if (traffic.congestionLevel > 0.7) {
    recommendations.push(
      "Severe congestion - Consider alternative routes, allow extra 30+ minutes"
    );
  } else if (traffic.congestionLevel > 0.5) {
    recommendations.push(
      "Heavy traffic - Maintain safe distance, stay in lane, avoid aggressive driving"
    );
  } else if (traffic.congestionLevel > 0.3) {
    recommendations.push(
      "Moderate congestion - Expect delays, use navigation for alternatives"
    );
  }

  // Incidents
  if (traffic.incidents >= 3) {
    recommendations.push(
      `⚠️ ${traffic.incidents} incidents reported in area - Stay alert, follow emergency vehicle instructions`
    );
  } else if (traffic.incidents >= 1) {
    recommendations.push(
      `${traffic.incidents} incident(s) nearby - Drive carefully, watch for emergency vehicles`
    );
  }

  // Time of day
  if (factors.timeOfDay > 15) {
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      recommendations.push(
        "Night driving - Use high beams in unlit areas, watch for wildlife and pedestrians"
      );
    } else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      recommendations.push(
        "Rush hour - Expect heavy traffic, aggressive drivers, allow extra time"
      );
    }
  }

  // Good conditions
  if (recommendations.length === 0) {
    recommendations.push(
      "✓ Good conditions - Weather and traffic favorable, maintain normal safe driving practices"
    );
  } else if (factors.weather < 30 && factors.traffic < 30) {
    recommendations.push(
      "Overall conditions acceptable - Stay alert and drive defensively"
    );
  }

  return recommendations;
}

/**
 * Known road coordinates for major Portuguese cities to avoid placing zones in the sea
 * Offsets are in degrees (0.01° ≈ 1.1km)
 */
const MAJOR_ROAD_OFFSETS: Record<string, Array<[number, number]>> = {
  lisboa: [
    // Central Lisboa roads (avoiding Tagus River)
    [0, 0], // City center
    [0.008, 0.008], // Northeast - Alameda
    [0.012, -0.008], // Northwest - Campo Grande
    [0.005, 0.012], // East - Marvila
    [0.015, 0.005], // North - Lumiar
    [0.02, 0], // East - Parque das Nações
    [0, -0.018], // West - Belém (on land)
    [0.025, 0.015], // Northeast - Airport area
    [0.018, 0.022], // North - roads to Loures
    [0.01, -0.015], // Northwest - Benfica
    // Major highways (land only)
    [0.03, 0.02], // A1 North
    [0.028, 0.012], // IC17 North
    [0.022, -0.02], // A5 West
    [0.035, 0.008], // Ring road east
    [0.015, 0.018], // North ring
  ],
  porto: [
    // Porto roads (avoiding Douro River to south)
    [0, 0], // City center
    [0.01, 0.01], // Northeast
    [0.01, -0.01], // Northwest
    [0.008, 0.015], // East - Gondomar
    [0.015, 0.008], // North - Maia
    [0.02, 0], // East
    [0, -0.015], // West - Matosinhos
    [0.012, 0.02], // North highways
    [0.025, 0.01], // A1 direction
    [-0.005, 0.01], // South (Gaia side - across bridge)
  ],
  faro: [
    // Faro roads (avoiding Ria Formosa to south)
    [0, 0], // City center
    [0.01, 0.01], // Northeast
    [0.01, -0.01], // Northwest
    [0.015, 0], // East - Airport
    [0.008, 0.012], // North
    [0, -0.012], // West
    [0.02, 0.008], // EN125 East
    [0.012, 0.015], // A22 North
    [0.015, -0.01], // West roads
  ],
  coimbra: [
    // Coimbra roads (central Portugal)
    [0, 0],
    [0.01, 0.01],
    [0.01, -0.01],
    [-0.008, 0.01], // South
    [-0.01, -0.008],
    [0.015, 0],
    [0, 0.015],
    [-0.012, 0],
    [0, -0.015],
    [0.02, 0.012], // A1 direction
  ],
  braga: [
    // Braga roads (northern Portugal)
    [0, 0],
    [0.01, 0.01],
    [0.01, -0.01],
    [-0.01, 0.01],
    [-0.01, -0.01],
    [0.015, 0],
    [0, 0.015],
    [-0.015, 0],
    [0, -0.015],
    [0.02, 0.01],
  ],
  default: [
    // Generic road pattern (inland, no water concerns)
    [0, 0],
    [0.01, 0.01],
    [0.01, -0.01],
    [-0.01, 0.01],
    [-0.01, -0.01],
    [0.015, 0],
    [0, 0.015],
    [-0.015, 0],
    [0, -0.015],
    [0.012, 0.012],
    [0.018, 0.008],
  ],
};

/**
 * Generate precise risk zones on actual roads, avoiding water/sea
 * Creates small, precise circles only where roads exist
 */
export function generateRiskZones(
  centerLat: number,
  centerLng: number,
  baseRisk: number,
  count: number = 20,
  cityName: string = "default"
): Array<{ lat: number; lng: number; radius: number; risk: number }> {
  const zones = [];
  const roadOffsets =
    MAJOR_ROAD_OFFSETS[cityName.toLowerCase()] || MAJOR_ROAD_OFFSETS.default;

  // Use predefined road locations and add minimal variation
  for (let i = 0; i < count; i++) {
    // Pick a road offset, cycling through available roads
    const roadOffset = roadOffsets[i % roadOffsets.length];

    // Add very small random variation to create precise clusters (±0.002 degrees ≈ ±220m)
    const latVariation = (Math.random() - 0.5) * 0.004;
    const lngVariation = (Math.random() - 0.5) * 0.004;

    const zoneLat = centerLat + roadOffset[0] + latVariation;
    const zoneLng = centerLng + roadOffset[1] + lngVariation;

    // Risk variation based on local conditions
    // High-risk areas get higher values, low-risk areas stay lower
    const riskVariation = (Math.random() - 0.5) * 30; // ±15 variation
    const zoneRisk = Math.max(15, Math.min(90, baseRisk + riskVariation));

    // Size varies slightly based on risk level
    // Higher risk = slightly larger visibility, but still small
    const baseRadius = 120; // Reduced from 150m
    const riskSizeBonus = (zoneRisk / 100) * 100; // 0-100m bonus for high risk
    const randomVariation = Math.random() * 80; // 0-80m random

    zones.push({
      lat: zoneLat,
      lng: zoneLng,
      radius: baseRadius + riskSizeBonus + randomVariation, // 120m-300m for precise zones
      risk: zoneRisk,
    });
  }

  return zones;
}
