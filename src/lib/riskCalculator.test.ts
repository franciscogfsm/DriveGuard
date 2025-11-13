// Example usage and testing of the risk calculation system
import {
  calculateWeatherRisk,
  calculateTrafficRisk,
  calculateTimeRisk,
  calculateOverallRisk,
  type WeatherData,
  type TrafficData,
} from "./riskCalculator";

// Example 1: Clear day with light traffic
const scenario1: { weather: WeatherData; traffic: TrafficData } = {
  weather: {
    temp: 20,
    humidity: 60,
    windSpeed: 15,
    visibility: 10000,
    precipitation: 0,
    condition: "Clear",
    conditionCode: 800,
  },
  traffic: {
    flowSpeed: 85,
    freeFlowSpeed: 90,
    congestionLevel: 0.06,
    incidents: 0,
  },
};

// Example 2: Heavy rain with congestion
const scenario2: { weather: WeatherData; traffic: TrafficData } = {
  weather: {
    temp: 12,
    humidity: 90,
    windSpeed: 35,
    visibility: 2000,
    precipitation: 10,
    condition: "Heavy Rain",
    conditionCode: 502,
  },
  traffic: {
    flowSpeed: 25,
    freeFlowSpeed: 80,
    congestionLevel: 0.69,
    incidents: 2,
  },
};

// Example 3: Fog with moderate traffic
const scenario3: { weather: WeatherData; traffic: TrafficData } = {
  weather: {
    temp: 10,
    humidity: 95,
    windSpeed: 5,
    visibility: 500,
    precipitation: 0,
    condition: "Fog",
    conditionCode: 741,
  },
  traffic: {
    flowSpeed: 55,
    freeFlowSpeed: 90,
    congestionLevel: 0.39,
    incidents: 1,
  },
};

// Test function
export function runRiskCalculationTests() {
  console.log("=== DriveGuard Risk Calculation Tests ===\n");

  const scenarios = [
    { name: "Clear Day, Light Traffic", data: scenario1 },
    { name: "Heavy Rain, Heavy Congestion", data: scenario2 },
    { name: "Fog, Moderate Traffic", data: scenario3 },
  ];

  scenarios.forEach(({ name, data }) => {
    console.log(`\n📍 Scenario: ${name}`);
    console.log("─".repeat(50));

    const weatherRisk = calculateWeatherRisk(data.weather);
    const trafficRisk = calculateTrafficRisk(data.traffic);
    const timeRisk = calculateTimeRisk();

    console.log(`\n🌦️  Weather Conditions:`);
    console.log(`   Temperature: ${data.weather.temp}°C`);
    console.log(`   Condition: ${data.weather.condition}`);
    console.log(`   Precipitation: ${data.weather.precipitation}mm/h`);
    console.log(`   Visibility: ${data.weather.visibility}m`);
    console.log(`   Wind Speed: ${data.weather.windSpeed}km/h`);
    console.log(`   → Weather Risk: ${weatherRisk.toFixed(1)}/100`);

    console.log(`\n🚗 Traffic Conditions:`);
    console.log(`   Current Speed: ${data.traffic.flowSpeed}km/h`);
    console.log(`   Free Flow Speed: ${data.traffic.freeFlowSpeed}km/h`);
    console.log(
      `   Congestion: ${(data.traffic.congestionLevel * 100).toFixed(1)}%`
    );
    console.log(`   Incidents: ${data.traffic.incidents}`);
    console.log(`   → Traffic Risk: ${trafficRisk.toFixed(1)}/100`);

    console.log(`\n⏰ Time Risk: ${timeRisk.toFixed(1)}/100`);

    const result = calculateOverallRisk(data.weather, data.traffic);

    console.log(`\n📊 OVERALL RISK ASSESSMENT:`);
    console.log(`   Total Score: ${result.score}/100`);
    console.log(
      `   Risk Level: ${result.level.toUpperCase()} ${getRiskEmoji(
        result.level
      )}`
    );
    console.log(`\n   Risk Breakdown:`);
    console.log(
      `   • Weather: ${result.factors.weather.toFixed(1)} (weight: 35%)`
    );
    console.log(
      `   • Traffic: ${result.factors.traffic.toFixed(1)} (weight: 35%)`
    );
    console.log(
      `   • Time of Day: ${result.factors.timeOfDay.toFixed(1)} (weight: 15%)`
    );
    console.log(
      `   • Historical: ${result.factors.historical.toFixed(1)} (weight: 15%)`
    );

    console.log(`\n💡 Recommendations:`);
    result.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });

    console.log("\n" + "═".repeat(50));
  });

  console.log("\n✅ All tests completed!\n");
}

function getRiskEmoji(level: string): string {
  switch (level) {
    case "low":
      return "🟢";
    case "medium":
      return "🟡";
    case "high":
      return "🔴";
    default:
      return "⚪";
  }
}

// Uncomment to run tests:
// runRiskCalculationTests();
