import {
  Shield,
  AlertTriangle,
  CloudRain,
  Car,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Thermometer,
  Wind,
  Eye,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RiskOverlay from "@/components/RiskOverlay";
import { toast } from "sonner";
import { fetchLocationRiskData } from "@/lib/apiService";
import {
  calculateOverallRisk,
  type WeatherData,
  type TrafficData,
  type RiskResult,
} from "@/lib/riskCalculator";
import {
  recordAccident,
  updateAccidentHotspots,
  getLearningStats,
} from "@/lib/accidentHistory";

interface RegionData {
  name: string;
  coords: [number, number];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  weatherCondition: string;
  trafficDensity: string;
  weather?: WeatherData;
  traffic?: TrafficData;
  riskAnalysis?: RiskResult;
  incidents?: any[]; // Real accident locations
}

const REGION_DATA: Record<string, RegionData> = {
  lisboa: {
    name: "Lisboa",
    coords: [38.7223, -9.1393],
    riskLevel: "medium",
    riskScore: 65,
    weatherCondition: "Partly Cloudy",
    trafficDensity: "High",
  },
  porto: {
    name: "Porto",
    coords: [41.1579, -8.6291],
    riskLevel: "low",
    riskScore: 35,
    weatherCondition: "Clear",
    trafficDensity: "Moderate",
  },
  faro: {
    name: "Faro",
    coords: [37.0194, -7.9322],
    riskLevel: "low",
    riskScore: 25,
    weatherCondition: "Sunny",
    trafficDensity: "Low",
  },
  coimbra: {
    name: "Coimbra",
    coords: [40.2033, -8.4103],
    riskLevel: "medium",
    riskScore: 55,
    weatherCondition: "Light Rain",
    trafficDensity: "Moderate",
  },
  braga: {
    name: "Braga",
    coords: [41.5454, -8.4265],
    riskLevel: "high",
    riskScore: 78,
    weatherCondition: "Heavy Rain",
    trafficDensity: "High",
  },
  setubal: {
    name: "Setúbal",
    coords: [38.5244, -8.8882],
    riskLevel: "medium",
    riskScore: 48,
    weatherCondition: "Overcast",
    trafficDensity: "Moderate",
  },
  aveiro: {
    name: "Aveiro",
    coords: [40.6405, -8.6538],
    riskLevel: "low",
    riskScore: 32,
    weatherCondition: "Partly Cloudy",
    trafficDensity: "Low",
  },
  evora: {
    name: "Évora",
    coords: [38.5715, -7.9074],
    riskLevel: "low",
    riskScore: 28,
    weatherCondition: "Clear",
    trafficDensity: "Low",
  },
  leiria: {
    name: "Leiria",
    coords: [39.7436, -8.8071],
    riskLevel: "medium",
    riskScore: 52,
    weatherCondition: "Light Rain",
    trafficDensity: "Moderate",
  },
  viseu: {
    name: "Viseu",
    coords: [40.6566, -7.9124],
    riskLevel: "high",
    riskScore: 82,
    weatherCondition: "Storm Warning",
    trafficDensity: "High",
  },
  beja: {
    name: "Beja",
    coords: [38.015, -7.8632],
    riskLevel: "low",
    riskScore: 22,
    weatherCondition: "Clear",
    trafficDensity: "Low",
  },
  guarda: {
    name: "Guarda",
    coords: [40.5373, -7.2661],
    riskLevel: "medium",
    riskScore: 58,
    weatherCondition: "Fog",
    trafficDensity: "Moderate",
  },
};

const RiskMap = () => {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [previousIncidents, setPreviousIncidents] = useState<number>(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [learningStats, setLearningStats] = useState(getLearningStats());

  const loadRegionData = async (showToast = true, isAutoRefresh = false) => {
    if (!regionId || !REGION_DATA[regionId]) {
      toast.error("Region not found");
      navigate("/selector");
      return;
    }

    if (!isAutoRefresh) {
      setIsLoading(true);
    }

    try {
      const baseData = REGION_DATA[regionId];
      const { weather, traffic, incidents } = await fetchLocationRiskData(
        baseData.coords[0],
        baseData.coords[1]
      );

      // Calculate overall risk using real data
      const riskAnalysis = calculateOverallRisk(
        weather,
        traffic,
        baseData.riskScore
      );

      const enhancedData: RegionData = {
        ...baseData,
        riskScore: riskAnalysis.score,
        riskLevel: riskAnalysis.level,
        weatherCondition: weather.condition,
        trafficDensity:
          traffic.congestionLevel > 0.6
            ? "High"
            : traffic.congestionLevel > 0.3
            ? "Moderate"
            : "Low",
        weather,
        traffic,
        riskAnalysis,
        incidents, // Add real incident locations
      };

      setRegionData(enhancedData);
      setLastUpdate(new Date());

      // Record new accidents for ML learning
      if (incidents && incidents.length > 0) {
        incidents.forEach((incident) => {
          recordAccident(incident, weather, traffic);
        });
        // Update hotspots after recording new accidents
        updateAccidentHotspots();
        // Refresh learning statistics
        setLearningStats(getLearningStats());
      }

      // Check for new accidents/incidents
      if (previousIncidents > 0 && traffic.incidents > previousIncidents) {
        const newIncidents = traffic.incidents - previousIncidents;
        toast.error(
          `⚠️ NEW ACCIDENT ALERT: ${newIncidents} new incident(s) detected!`,
          {
            description: `Total incidents in area: ${traffic.incidents}. Drive with extreme caution. System learning from this accident.`,
            duration: 10000, // 10 seconds
          }
        );
      }

      // High risk weather warning
      if (riskAnalysis.factors.weather > 70 && isAutoRefresh) {
        toast.warning("⚠️ SEVERE WEATHER WARNING", {
          description: `${weather.condition} detected - Risk score: ${riskAnalysis.factors.weather}/100`,
          duration: 8000,
        });
      }

      // Critical overall risk warning
      if (riskAnalysis.score >= 75 && isAutoRefresh) {
        toast.error("🚨 CRITICAL RISK LEVEL", {
          description: `Overall risk: ${riskAnalysis.score}/100 - Avoid travel if possible`,
          duration: 10000,
        });
      }

      setPreviousIncidents(traffic.incidents);

      if (showToast && !isAutoRefresh) {
        toast.success(`Risk analysis loaded for ${baseData.name}`, {
          description: `Risk Level: ${riskAnalysis.level.toUpperCase()} (${
            riskAnalysis.score
          }/100)`,
        });
      }
    } catch (error) {
      console.error("Error loading region data:", error);
      // Fallback to base data if API fails
      setRegionData(REGION_DATA[regionId]);
      if (!isAutoRefresh) {
        toast.warning("Using cached data - API temporarily unavailable");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadRegionData();
  }, [regionId, navigate]);

  // Auto-refresh every 60 seconds (1 minute)
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const intervalId = setInterval(() => {
      console.log("🔄 Auto-refreshing data...");
      loadRegionData(false, true); // Silent auto-refresh
    }, 60000); // 60 seconds = 1 minute

    return () => clearInterval(intervalId);
  }, [regionId, autoRefreshEnabled, previousIncidents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRegionData(false, false);
    toast.success("Data refreshed manually", {
      description: `Updated at ${new Date().toLocaleTimeString()}`,
    });
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
    toast.info(
      !autoRefreshEnabled
        ? "🔄 Auto-refresh enabled (every 60 seconds)"
        : "⏸️ Auto-refresh paused"
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-success/10 border-success/20";
      case "medium":
        return "bg-warning/10 border-warning/20";
      case "high":
        return "bg-destructive/10 border-destructive/20";
      default:
        return "bg-muted";
    }
  };

  if (isLoading || !regionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading risk analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                DriveGuard
              </h1>
            </button>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <div className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
                  <span className="animate-pulse text-primary">●</span>
                  Updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant={autoRefreshEnabled ? "default" : "outline"}
                onClick={toggleAutoRefresh}
                size="sm"
                className="gap-2"
              >
                <RefreshCw
                  className={`h-3 w-3 ${
                    autoRefreshEnabled ? "animate-spin" : ""
                  }`}
                />
                {autoRefreshEnabled ? "Auto" : "Manual"}
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/selector")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Change Region
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Region Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{regionData.name}</h1>
          <p className="text-muted-foreground">
            Real-time risk analysis and prediction
          </p>
        </div>

        {/* Risk Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-6 rounded-xl border-2 ${getRiskBgColor(
              regionData.riskLevel
            )}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle
                className={`h-5 w-5 ${getRiskColor(regionData.riskLevel)}`}
              />
              <span className="text-sm font-medium text-muted-foreground">
                Risk Level
              </span>
            </div>
            <p
              className={`text-2xl font-bold capitalize ${getRiskColor(
                regionData.riskLevel
              )}`}
            >
              {regionData.riskLevel}
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Risk Score
              </span>
            </div>
            <p className="text-2xl font-bold">{regionData.riskScore}/100</p>
          </div>

          <div
            className={`p-6 rounded-xl border-2 ${
              regionData.riskAnalysis &&
              regionData.riskAnalysis.factors.weather > 70
                ? "border-destructive/30 bg-destructive/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <CloudRain className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Weather
                </span>
              </div>
              {regionData.weather && regionData.weather.precipitation > 2 && (
                <span className="text-xs bg-warning/20 text-warning px-2 py-1 rounded-full font-bold">
                  Rain: {regionData.weather.precipitation.toFixed(1)}mm
                </span>
              )}
            </div>
            <p className="text-lg font-semibold">
              {regionData.weatherCondition}
            </p>
            {regionData.weather && (
              <p className="text-xs text-muted-foreground mt-1">
                {regionData.weather.temp.toFixed(1)}°C •{" "}
                {regionData.weather.windSpeed.toFixed(0)} km/h wind
              </p>
            )}
          </div>

          <div
            className={`p-6 rounded-xl border-2 ${
              regionData.traffic && regionData.traffic.incidents > 0
                ? "border-destructive/30 bg-destructive/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Traffic
                </span>
              </div>
              {regionData.traffic && regionData.traffic.incidents > 0 && (
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full font-bold animate-pulse">
                  {regionData.traffic.incidents} incidents
                </span>
              )}
            </div>
            <p className="text-lg font-semibold">{regionData.trafficDensity}</p>
            {regionData.traffic && (
              <p className="text-xs text-muted-foreground mt-1">
                {regionData.traffic.flowSpeed.toFixed(0)} km/h current speed
              </p>
            )}
          </div>
        </div>

        {/* Detailed Weather & Traffic Cards */}
        {regionData.weather && regionData.traffic && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-xl border-2 border-border bg-card">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-primary" />
                Weather Details (Live)
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Thermometer className="h-4 w-4" />
                    <span>Temperature</span>
                  </div>
                  <p className="font-semibold">
                    {regionData.weather.temp.toFixed(1)}°C
                  </p>
                  {regionData.weather.temp < 2 && (
                    <p className="text-xs text-destructive mt-1">⚠️ Ice risk</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Droplets className="h-4 w-4" />
                    <span>Humidity</span>
                  </div>
                  <p className="font-semibold">
                    {regionData.weather.humidity}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Wind className="h-4 w-4" />
                    <span>Wind Speed</span>
                  </div>
                  <p className="font-semibold">
                    {regionData.weather.windSpeed.toFixed(1)} km/h
                  </p>
                  {regionData.weather.windSpeed > 45 && (
                    <p className="text-xs text-warning mt-1">⚠️ Strong winds</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Eye className="h-4 w-4" />
                    <span>Visibility</span>
                  </div>
                  <p className="font-semibold">
                    {(regionData.weather.visibility / 1000).toFixed(1)} km
                  </p>
                  {regionData.weather.visibility < 2000 && (
                    <p className="text-xs text-warning mt-1">
                      ⚠️ Low visibility
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CloudRain className="h-4 w-4" />
                    <span>Precipitation</span>
                  </div>
                  <p className="font-semibold">
                    {regionData.weather.precipitation > 0
                      ? `${regionData.weather.precipitation.toFixed(1)} mm/h`
                      : "None"}
                  </p>
                  {regionData.weather.precipitation > 5 && (
                    <p className="text-xs text-destructive mt-1">
                      ⚠️ Heavy rain - High accident risk
                    </p>
                  )}
                  {regionData.weather.precipitation > 2 &&
                    regionData.weather.precipitation <= 5 && (
                      <p className="text-xs text-warning mt-1">
                        ⚠️ Moderate rain - Drive carefully
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border-2 border-border bg-card">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Traffic Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Current Speed</p>
                  <p className="font-semibold">
                    {regionData.traffic.flowSpeed.toFixed(0)} km/h
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Free Flow Speed</p>
                  <p className="font-semibold">
                    {regionData.traffic.freeFlowSpeed.toFixed(0)} km/h
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Congestion</p>
                  <p className="font-semibold">
                    {(regionData.traffic.congestionLevel * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Incidents</p>
                  <p className="font-semibold">
                    {regionData.traffic.incidents}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Component */}
        <RiskOverlay regionData={regionData} />

        {/* Recommendations */}
        {regionData.riskAnalysis &&
          regionData.riskAnalysis.recommendations.length > 0 && (
            <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Safety Recommendations
              </h3>
              <ul className="space-y-2">
                {regionData.riskAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground leading-relaxed flex-1">
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Machine Learning Statistics */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Machine Learning System
            </h3>
            <div className="flex items-center gap-2 text-xs text-primary">
              <span className="animate-pulse">●</span>
              <span className="font-medium">{learningStats.dataQuality}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-card/50 rounded-lg p-3 border border-border/50">
              <p className="text-muted-foreground mb-1">Accidents Tracked</p>
              <p className="text-2xl font-bold text-primary">
                {learningStats.totalAccidents}
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-3 border border-border/50">
              <p className="text-muted-foreground mb-1">Hotspots Found</p>
              <p className="text-2xl font-bold text-warning">
                {learningStats.hotspotsIdentified}
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-3 border border-border/50">
              <p className="text-muted-foreground mb-1">Last 7 Days</p>
              <p className="text-2xl font-bold text-blue-500">
                {learningStats.last7Days}
              </p>
            </div>
            <div className="bg-card/50 rounded-lg p-3 border border-border/50">
              <p className="text-muted-foreground mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-success">
                {learningStats.predictionAccuracy}%
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            The system learns from real accidents to improve risk predictions
            over time
          </p>
        </div>

        {/* Risk Factors Breakdown */}
        {regionData.riskAnalysis && (
          <div className="mt-8 p-6 rounded-xl bg-card border-2 border-border">
            <h3 className="font-semibold text-lg mb-4">
              Risk Factor Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(regionData.riskAnalysis.factors).map(
                ([key, value]) => {
                  const percentage = value;
                  const color =
                    percentage < 35
                      ? "bg-success"
                      : percentage < 65
                      ? "bg-warning"
                      : "bg-destructive";
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="capitalize font-medium">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Real-time Update Status */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="animate-pulse text-primary">●</span>
              Real-Time Monitoring Active
            </h3>
            {autoRefreshEnabled && (
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                Updates every 60s
              </span>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm">
            The system continuously monitors weather conditions, traffic flow,
            and accident reports. You'll receive <strong>instant alerts</strong>{" "}
            when:
            <br />• <strong className="text-destructive">
              New accidents
            </strong>{" "}
            are detected in the area
            <br />• <strong className="text-warning">
              Severe weather
            </strong>{" "}
            conditions develop (risk &gt;70%)
            <br />•{" "}
            <strong className="text-destructive">
              Critical risk levels
            </strong>{" "}
            are reached (score ≥75)
            <br />
            {lastUpdate && (
              <span className="text-xs mt-2 block">
                Last updated: {lastUpdate.toLocaleString()} | Next update:{" "}
                {autoRefreshEnabled ? "in 60 seconds" : "manual"}
              </span>
            )}
          </p>
        </div>

        {/* Info Banner */}
        <div className="mt-4 p-6 rounded-xl bg-muted/50 border border-border">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            About Risk Analysis
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Risk predictions use <strong>real-time data</strong> from TomTom
            Traffic API and Open-Meteo weather service. The AI algorithm
            combines:
            <br />• <strong>Weather conditions</strong> (40% weight):
            precipitation, visibility, wind, temperature
            <br />• <strong>Traffic congestion</strong> (30% weight): flow
            speed, stop-and-go patterns, incidents
            <br />• <strong>Time factors</strong> (20% weight): rush hour, night
            driving risks
            <br />• <strong>Historical data</strong> (10% weight): known
            accident patterns
            <br />
            <br />
            <span className="text-success font-medium">
              Green zones (&lt;30)
            </span>{" "}
            = low risk,{" "}
            <span className="text-warning font-medium">
              amber zones (30-60)
            </span>{" "}
            = medium risk,{" "}
            <span className="text-destructive font-medium">
              red zones (60+)
            </span>{" "}
            = high risk. Circle sizes (120-300m) indicate precision zones on
            actual roads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
