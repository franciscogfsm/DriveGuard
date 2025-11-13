/**
 * Accident History Tracking & Machine Learning System
 * Learns from real accidents to improve risk predictions over time
 */

export interface AccidentRecord {
  id: string;
  timestamp: Date;
  lat: number;
  lng: number;
  severity: number;
  category: string;
  weatherConditions: {
    temp: number;
    precipitation: number;
    windSpeed: number;
    visibility: number;
    condition: string;
  };
  trafficConditions: {
    congestionLevel: number;
    flowSpeed: number;
    timeOfDay: number; // 0-23 hour
    dayOfWeek: number; // 0-6
  };
  locationFeatures: {
    distanceFromCenter: number;
    roadType: "highway" | "city" | "suburban";
    isIntersection: boolean;
  };
}

export interface AccidentHotspot {
  lat: number;
  lng: number;
  radius: number;
  accidentCount: number;
  avgSeverity: number;
  commonConditions: {
    weather: string[];
    timeRanges: string[];
    trafficLevels: string[];
  };
  riskMultiplier: number; // 1.0 - 2.5x
}

/**
 * LocalStorage key for accident history
 */
const ACCIDENT_HISTORY_KEY = "driveguard_accident_history";
const HOTSPOTS_KEY = "driveguard_accident_hotspots";
const LEARNING_DATA_KEY = "driveguard_learning_data";

/**
 * Save accident record to history
 */
export function recordAccident(
  incident: any,
  weather: any,
  traffic: any
): void {
  const history = getAccidentHistory();

  const now = new Date();
  const record: AccidentRecord = {
    id: `${incident.lat}-${incident.lng}-${now.getTime()}`,
    timestamp: now,
    lat: incident.lat,
    lng: incident.lng,
    severity: incident.severity,
    category: incident.category,
    weatherConditions: {
      temp: weather.temp,
      precipitation: weather.precipitation,
      windSpeed: weather.windSpeed,
      visibility: weather.visibility,
      condition: weather.condition,
    },
    trafficConditions: {
      congestionLevel: traffic.congestionLevel,
      flowSpeed: traffic.flowSpeed,
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
    },
    locationFeatures: {
      distanceFromCenter: 0, // Calculate based on city center
      roadType: "city", // Infer from location
      isIntersection: false, // Could be detected from map
    },
  };

  history.push(record);

  // Keep only last 1000 records to prevent storage overflow
  if (history.length > 1000) {
    history.splice(0, history.length - 1000);
  }

  localStorage.setItem(ACCIDENT_HISTORY_KEY, JSON.stringify(history));

  console.log("✓ Accident recorded to history:", record);

  // Update hotspots after recording
  updateAccidentHotspots();
}

/**
 * Get accident history from localStorage
 */
export function getAccidentHistory(): AccidentRecord[] {
  try {
    const data = localStorage.getItem(ACCIDENT_HISTORY_KEY);
    if (!data) return [];

    const records = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return records.map((r: any) => ({
      ...r,
      timestamp: new Date(r.timestamp),
    }));
  } catch (error) {
    console.error("Error loading accident history:", error);
    return [];
  }
}

/**
 * Calculate accident hotspots from historical data
 */
export function updateAccidentHotspots(): void {
  const history = getAccidentHistory();
  if (history.length < 3) return; // Need at least 3 accidents

  const hotspots: AccidentHotspot[] = [];
  const CLUSTER_RADIUS = 0.003; // ~330m in degrees

  // Cluster accidents by proximity
  const processed = new Set<string>();

  for (const accident of history) {
    if (processed.has(accident.id)) continue;

    // Find all accidents within cluster radius
    const cluster = history.filter((other) => {
      if (processed.has(other.id)) return false;

      const distance = Math.sqrt(
        Math.pow(accident.lat - other.lat, 2) +
          Math.pow(accident.lng - other.lng, 2)
      );

      return distance <= CLUSTER_RADIUS;
    });

    if (cluster.length >= 2) {
      // This is a hotspot!
      cluster.forEach((a) => processed.add(a.id));

      const centerLat =
        cluster.reduce((sum, a) => sum + a.lat, 0) / cluster.length;
      const centerLng =
        cluster.reduce((sum, a) => sum + a.lng, 0) / cluster.length;
      const avgSeverity =
        cluster.reduce((sum, a) => sum + a.severity, 0) / cluster.length;

      // Analyze common conditions
      const weatherConditions = cluster.map(
        (a) => a.weatherConditions.condition
      );
      const uniqueWeather = [...new Set(weatherConditions)];

      const timeRanges = cluster.map((a) => {
        const hour = a.trafficConditions.timeOfDay;
        if (hour >= 7 && hour <= 9) return "morning-rush";
        if (hour >= 17 && hour <= 19) return "evening-rush";
        if (hour >= 22 || hour <= 5) return "night";
        return "daytime";
      });
      const uniqueTimes = [...new Set(timeRanges)];

      const trafficLevels = cluster.map((a) => {
        if (a.trafficConditions.congestionLevel > 0.6) return "heavy";
        if (a.trafficConditions.congestionLevel > 0.3) return "moderate";
        return "light";
      });
      const uniqueTraffic = [...new Set(trafficLevels)];

      // Calculate risk multiplier based on frequency
      // 2-3 accidents = 1.2x, 4-5 = 1.5x, 6+ = 2.0x
      let multiplier = 1.0 + Math.min(cluster.length / 10, 1.5);

      hotspots.push({
        lat: centerLat,
        lng: centerLng,
        radius: CLUSTER_RADIUS * 111000, // Convert to meters
        accidentCount: cluster.length,
        avgSeverity,
        commonConditions: {
          weather: uniqueWeather,
          timeRanges: uniqueTimes,
          trafficLevels: uniqueTraffic,
        },
        riskMultiplier: multiplier,
      });
    }
  }

  localStorage.setItem(HOTSPOTS_KEY, JSON.stringify(hotspots));
  console.log(`✓ Updated ${hotspots.length} accident hotspots`);
}

/**
 * Get accident hotspots
 */
export function getAccidentHotspots(): AccidentHotspot[] {
  try {
    const data = localStorage.getItem(HOTSPOTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading hotspots:", error);
    return [];
  }
}

/**
 * Check if a location is near an accident hotspot
 */
export function getNearbyHotspot(
  lat: number,
  lng: number
): AccidentHotspot | null {
  const hotspots = getAccidentHotspots();

  for (const hotspot of hotspots) {
    const distance = Math.sqrt(
      Math.pow((hotspot.lat - lat) * 111000, 2) +
        Math.pow((hotspot.lng - lng) * 111000, 2)
    );

    if (distance <= hotspot.radius) {
      return hotspot;
    }
  }

  return null;
}

/**
 * Machine Learning: Predict risk adjustment based on historical patterns
 */
export function calculateMLRiskAdjustment(
  lat: number,
  lng: number,
  weather: any,
  traffic: any,
  timeOfDay: number
): number {
  const history = getAccidentHistory();
  if (history.length < 10) return 0; // Need enough data

  let adjustment = 0;

  // Check if location is a known hotspot
  const hotspot = getNearbyHotspot(lat, lng);
  if (hotspot) {
    adjustment += 15 * hotspot.riskMultiplier;

    // Extra adjustment if current conditions match common accident conditions
    if (hotspot.commonConditions.weather.includes(weather.condition)) {
      adjustment += 10;
    }

    const currentTimeRange = (() => {
      if (timeOfDay >= 7 && timeOfDay <= 9) return "morning-rush";
      if (timeOfDay >= 17 && timeOfDay <= 19) return "evening-rush";
      if (timeOfDay >= 22 || timeOfDay <= 5) return "night";
      return "daytime";
    })();

    if (hotspot.commonConditions.timeRanges.includes(currentTimeRange)) {
      adjustment += 8;
    }
  }

  // Analyze weather pattern correlations
  const similarWeatherAccidents = history.filter(
    (a) =>
      Math.abs(a.weatherConditions.precipitation - weather.precipitation) < 2 &&
      Math.abs(a.weatherConditions.windSpeed - weather.windSpeed) < 10
  );

  if (similarWeatherAccidents.length > 5) {
    adjustment += 5;
  }

  // Analyze time pattern correlations
  const similarTimeAccidents = history.filter(
    (a) => Math.abs(a.trafficConditions.timeOfDay - timeOfDay) <= 1
  );

  if (similarTimeAccidents.length > 5) {
    adjustment += 3;
  }

  return Math.min(adjustment, 30); // Cap at +30 points
}

/**
 * Get learning statistics
 */
export function getLearningStats() {
  const history = getAccidentHistory();
  const hotspots = getAccidentHotspots();

  // Calculate accuracy improvement over time
  const recentAccidents = history.filter(
    (a) => Date.now() - a.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
  );

  // Count how many recent accidents were in predicted high-risk zones
  const predictedCorrectly = recentAccidents.filter((a) => {
    const hotspot = getNearbyHotspot(a.lat, a.lng);
    return hotspot !== null;
  }).length;

  const accuracy =
    recentAccidents.length > 0
      ? (predictedCorrectly / recentAccidents.length) * 100
      : 0;

  return {
    totalAccidents: history.length,
    hotspotsIdentified: hotspots.length,
    last7Days: recentAccidents.length,
    predictionAccuracy: accuracy.toFixed(1),
    dataQuality:
      history.length >= 50
        ? "Good"
        : history.length >= 20
        ? "Fair"
        : "Building",
  };
}

/**
 * Clear all learning data (for testing)
 */
export function clearLearningData(): void {
  localStorage.removeItem(ACCIDENT_HISTORY_KEY);
  localStorage.removeItem(HOTSPOTS_KEY);
  localStorage.removeItem(LEARNING_DATA_KEY);
  console.log("✓ All learning data cleared");
}
