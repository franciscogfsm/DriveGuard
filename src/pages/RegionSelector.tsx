import { Shield, MapPin, ArrowRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

const AnimatedCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-glow" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-card/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group transition-all"
          >
            <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              DriveGuard
            </h1>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 lg:py-20 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
              <Navigation className="h-4 w-4" />
              Step 1 of 2
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Select Your Region
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Choose a Portuguese district to view real-time risk analysis
            </p>
          </div>

          {/* Region Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {PORTUGUESE_REGIONS.map((region, index) => (
              <AnimatedCard key={region.id} delay={index * 50}>
                <button
                  onClick={() => handleSelectRegion(region.id)}
                  className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left w-full overflow-hidden ${
                    selectedRegion === region.id
                      ? "border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg shadow-primary/20 scale-105"
                      : "border-border/50 backdrop-blur-xl bg-card/40 hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    selectedRegion === region.id ? "opacity-100" : ""
                  }`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedRegion === region.id
                            ? "border-primary bg-primary scale-110"
                            : "border-border/50 group-hover:border-primary/50"
                        }`}
                      >
                        {selectedRegion === region.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-background animate-scale-in" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{region.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <span className="text-primary">📍</span>
                      {region.coords[0].toFixed(2)}°N, {Math.abs(region.coords[1]).toFixed(2)}°W
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </button>
              </AnimatedCard>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "800ms" }}>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedRegion}
              className="gap-2 px-12 py-8 text-xl group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Risk Map
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </span>
              {selectedRegion && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          </div>

          {/* Info Badge */}
          {selectedRegion && (
            <div className="text-center mt-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-xl bg-success/10 border border-success/30 text-success text-sm font-medium">
                ✓ {PORTUGUESE_REGIONS.find(r => r.id === selectedRegion)?.name} selected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
