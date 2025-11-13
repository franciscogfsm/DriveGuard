import { Shield, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PORTUGUESE_REGIONS = [
  { id: "lisboa", name: "Lisboa", coords: [38.7223, -9.1393] },
  { id: "porto", name: "Porto", coords: [41.1579, -8.6291] },
  { id: "faro", name: "Faro", coords: [37.0194, -7.9322] },
  { id: "coimbra", name: "Coimbra", coords: [40.2033, -8.4103] },
  { id: "braga", name: "Braga", coords: [41.5454, -8.4265] },
  { id: "setubal", name: "Setúbal", coords: [38.5244, -8.8882] },
  { id: "aveiro", name: "Aveiro", coords: [40.6405, -8.6538] },
  { id: "evora", name: "Évora", coords: [38.5715, -7.9074] },
  { id: "leiria", name: "Leiria", coords: [39.7436, -8.8071] },
  { id: "viseu", name: "Viseu", coords: [40.6566, -7.9124] },
  { id: "beja", name: "Beja", coords: [38.0150, -7.8632] },
  { id: "guarda", name: "Guarda", coords: [40.5373, -7.2661] },
];

const RegionSelector = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleContinue = () => {
    if (selectedRegion) {
      navigate(`/map/${selectedRegion}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              DriveGuard
            </h1>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Step 1 of 2
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Select Your Region
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose a Portuguese district to view real-time risk analysis
            </p>
          </div>

          {/* Region Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {PORTUGUESE_REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => handleSelectRegion(region.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                  selectedRegion === region.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{region.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {region.coords[0].toFixed(2)}°N, {Math.abs(region.coords[1]).toFixed(2)}°W
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedRegion === region.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedRegion === region.id && (
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedRegion}
              className="gap-2 px-8 py-6 text-lg"
            >
              View Risk Map
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
