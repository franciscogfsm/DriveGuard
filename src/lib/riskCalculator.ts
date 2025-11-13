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
 * Calculate weather risk factor based on conditions
 */
export function calculateWeatherRisk(weather: WeatherData): number {
  let risk = 0;

  // Precipitation risk (max 30 points)
  if (weather.precipitation > 5) risk += 30;
  else if (weather.precipitation > 2) risk += 20;
  else if (weather.precipitation > 0.5) risk += 10;

  // Visibility risk (max 25 points)
  if (weather.visibility < 1000) risk += 25;
  else if (weather.visibility < 3000) risk += 15;
  else if (weather.visibility < 5000) risk += 8;

  // Wind risk (max 20 points)
  if (weather.windSpeed > 50) risk += 20;
  else if (weather.windSpeed > 30) risk += 12;
  else if (weather.windSpeed > 20) risk += 6;

  // Weather condition code risk (max 25 points)
  // Thunderstorm (2xx), snow (6xx), extreme (900s)
  if (weather.conditionCode >= 200 && weather.conditionCode < 300) risk += 25;
  else if (weather.conditionCode >= 600 && weather.conditionCode < 700)
    risk += 20;
  else if (weather.conditionCode >= 500 && weather.conditionCode < 600)
    risk += 15;
  else if (weather.conditionCode >= 300 && weather.conditionCode < 400)
    risk += 10;
  else if (weather.conditionCode >= 700 && weather.conditionCode < 800)
    risk += 12; // fog, mist

  return Math.min(risk, 100);
}

/**
 * Calculate traffic risk factor based on flow and congestion
 */
export function calculateTrafficRisk(traffic: TrafficData): number {
  let risk = 0;

  // Congestion level (max 40 points)
  risk += traffic.congestionLevel * 40;

  // Speed difference (max 35 points)
  const speedRatio = traffic.flowSpeed / traffic.freeFlowSpeed;
  if (speedRatio < 0.3) risk += 35;
  else if (speedRatio < 0.5) risk += 25;
  else if (speedRatio < 0.7) risk += 15;

  // Incidents (max 25 points)
  if (traffic.incidents >= 3) risk += 25;
  else if (traffic.incidents >= 2) risk += 18;
  else if (traffic.incidents >= 1) risk += 10;

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
 */
export function calculateOverallRisk(
  weather: WeatherData,
  traffic: TrafficData,
  historicalRisk: number = 30 // Base historical risk for region
): RiskResult {
  const weatherRisk = calculateWeatherRisk(weather);
  const trafficRisk = calculateTrafficRisk(traffic);
  const timeRisk = calculateTimeRisk();

  // Weighted average with emphasis on weather and traffic
  const weights = {
    weather: 0.35,
    traffic: 0.35,
    time: 0.15,
    historical: 0.15,
  };

  const score = Math.round(
    weatherRisk * weights.weather +
      trafficRisk * weights.traffic +
      timeRisk * weights.time +
      historicalRisk * weights.historical
  );

  let level: "low" | "medium" | "high";
  if (score < 35) level = "low";
  else if (score < 65) level = "medium";
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
 * Generate safety recommendations based on risk factors
 */
function generateRecommendations(
  factors: RiskFactors,
  weather: WeatherData,
  traffic: TrafficData
): string[] {
  const recommendations: string[] = [];

  if (factors.weather > 50) {
    if (weather.precipitation > 5) {
      recommendations.push(
        "Heavy rain detected: Reduce speed and increase following distance"
      );
    }
    if (weather.visibility < 1000) {
      recommendations.push("Poor visibility: Use fog lights and drive slowly");
    }
    if (weather.windSpeed > 30) {
      recommendations.push(
        "Strong winds: Be cautious of cross-winds, especially on bridges"
      );
    }
  }

  if (factors.traffic > 50) {
    if (traffic.congestionLevel > 0.7) {
      recommendations.push(
        "Heavy congestion: Consider alternative routes or delay travel"
      );
    }
    if (traffic.incidents > 0) {
      recommendations.push(
        `${traffic.incidents} incident(s) reported: Stay alert and follow traffic updates`
      );
    }
  }

  if (factors.timeOfDay > 15) {
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) {
      recommendations.push(
        "Night driving: Use high beams when appropriate and watch for wildlife"
      );
    } else {
      recommendations.push(
        "Rush hour: Allow extra time and maintain safe distances"
      );
    }
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Conditions are favorable: Drive safely and stay alert"
    );
  }

  return recommendations;
}

/**
 * Generate random risk zones for visualization
 */
export function generateRiskZones(
  centerLat: number,
  centerLng: number,
  baseRisk: number,
  count: number = 15
): Array<{ lat: number; lng: number; radius: number; risk: number }> {
  const zones = [];

  for (let i = 0; i < count; i++) {
    // Random offset around center (±0.1 degrees ≈ ±11km)
    const latOffset = (Math.random() - 0.5) * 0.2;
    const lngOffset = (Math.random() - 0.5) * 0.2;

    // Vary risk based on base risk ±30
    const riskVariation = (Math.random() - 0.5) * 60;
    const zoneRisk = Math.max(0, Math.min(100, baseRisk + riskVariation));

    zones.push({
      lat: centerLat + latOffset,
      lng: centerLng + lngOffset,
      radius: 1000 + Math.random() * 2000, // 1-3km radius
      risk: zoneRisk,
    });
  }

  return zones;
}
