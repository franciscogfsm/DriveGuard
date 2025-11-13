import { Shield, AlertTriangle, CloudRain, Car, TrendingUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RiskOverlay from "@/components/RiskOverlay";
import { toast } from "sonner";

interface RegionData {
  name: string;
  coords: [number, number];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  weatherCondition: string;
  trafficDensity: string;
}

const REGION_DATA: Record<string, RegionData> = {
  lisboa: { 
    name: "Lisboa", 
    coords: [38.7223, -9.1393], 
    riskLevel: "medium", 
    riskScore: 65,
    weatherCondition: "Partly Cloudy",
    trafficDensity: "High"
  },
  porto: { 
    name: "Porto", 
    coords: [41.1579, -8.6291], 
    riskLevel: "low", 
    riskScore: 35,
    weatherCondition: "Clear",
    trafficDensity: "Moderate"
  },
  faro: { 
    name: "Faro", 
    coords: [37.0194, -7.9322], 
    riskLevel: "low", 
    riskScore: 25,
    weatherCondition: "Sunny",
    trafficDensity: "Low"
  },
  coimbra: { 
    name: "Coimbra", 
    coords: [40.2033, -8.4103], 
    riskLevel: "medium", 
    riskScore: 55,
    weatherCondition: "Light Rain",
    trafficDensity: "Moderate"
  },
  braga: { 
    name: "Braga", 
    coords: [41.5454, -8.4265], 
    riskLevel: "high", 
    riskScore: 78,
    weatherCondition: "Heavy Rain",
    trafficDensity: "High"
  },
  setubal: { 
    name: "Setúbal", 
    coords: [38.5244, -8.8882], 
    riskLevel: "medium", 
    riskScore: 48,
    weatherCondition: "Overcast",
    trafficDensity: "Moderate"
  },
  aveiro: { 
    name: "Aveiro", 
    coords: [40.6405, -8.6538], 
    riskLevel: "low", 
    riskScore: 32,
    weatherCondition: "Partly Cloudy",
    trafficDensity: "Low"
  },
  evora: { 
    name: "Évora", 
    coords: [38.5715, -7.9074], 
    riskLevel: "low", 
    riskScore: 28,
    weatherCondition: "Clear",
    trafficDensity: "Low"
  },
  leiria: { 
    name: "Leiria", 
    coords: [39.7436, -8.8071], 
    riskLevel: "medium", 
    riskScore: 52,
    weatherCondition: "Light Rain",
    trafficDensity: "Moderate"
  },
  viseu: { 
    name: "Viseu", 
    coords: [40.6566, -7.9124], 
    riskLevel: "high", 
    riskScore: 82,
    weatherCondition: "Storm Warning",
    trafficDensity: "High"
  },
  beja: { 
    name: "Beja", 
    coords: [38.0150, -7.8632], 
    riskLevel: "low", 
    riskScore: 22,
    weatherCondition: "Clear",
    trafficDensity: "Low"
  },
  guarda: { 
    name: "Guarda", 
    coords: [40.5373, -7.2661], 
    riskLevel: "medium", 
    riskScore: 58,
    weatherCondition: "Fog",
    trafficDensity: "Moderate"
  },
};

const RiskMap = () => {
  const navigate = useNavigate();
  const { regionId } = useParams<{ regionId: string }>();
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadRegionData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (regionId && REGION_DATA[regionId]) {
        setRegionData(REGION_DATA[regionId]);
        toast.success(`Risk analysis loaded for ${REGION_DATA[regionId].name}`);
      } else {
        toast.error("Region not found");
        navigate("/selector");
      }
      
      setIsLoading(false);
    };

    loadRegionData();
  }, [regionId, navigate]);

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
          <div className={`p-6 rounded-xl border-2 ${getRiskBgColor(regionData.riskLevel)}`}>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className={`h-5 w-5 ${getRiskColor(regionData.riskLevel)}`} />
              <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
            </div>
            <p className={`text-2xl font-bold capitalize ${getRiskColor(regionData.riskLevel)}`}>
              {regionData.riskLevel}
            </p>
          </div>

          <div className="p-6 rounded-xl border-2 border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Risk Score</span>
            </div>
            <p className="text-2xl font-bold">{regionData.riskScore}/100</p>
          </div>

          <div className="p-6 rounded-xl border-2 border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <CloudRain className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Weather</span>
            </div>
            <p className="text-lg font-semibold">{regionData.weatherCondition}</p>
          </div>

          <div className="p-6 rounded-xl border-2 border-border bg-card">
            <div className="flex items-center gap-3 mb-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Traffic</span>
            </div>
            <p className="text-lg font-semibold">{regionData.trafficDensity}</p>
          </div>
        </div>

        {/* Map Component */}
        <RiskOverlay regionData={regionData} />

        {/* Info Banner */}
        <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            About Risk Analysis
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Risk predictions are generated using real-time data from traffic monitoring systems and weather APIs. 
            The color-coded map shows relative accident risk levels across different areas. 
            <span className="text-success font-medium"> Green</span> indicates low risk,
            <span className="text-warning font-medium"> amber</span> shows medium risk, and
            <span className="text-destructive font-medium"> red</span> represents high-risk zones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;
