import { useEffect, useRef } from "react";

interface RegionData {
  name: string;
  coords: [number, number];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
}

interface RiskOverlayProps {
  regionData: RegionData;
}

const RiskOverlay = ({ regionData }: RiskOverlayProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for the actual map implementation
    // In production, you would integrate with a mapping library like Leaflet or Mapbox
    // and overlay risk zones based on the regionData
    
    console.log("Map data:", {
      region: regionData.name,
      coordinates: regionData.coords,
      risk: regionData.riskLevel,
      score: regionData.riskScore
    });
  }, [regionData]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "from-success/80 to-success/40";
      case "medium":
        return "from-warning/80 to-warning/40";
      case "high":
        return "from-destructive/80 to-destructive/40";
      default:
        return "from-muted to-muted/40";
    }
  };

  return (
    <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-lg">
      <div 
        ref={mapRef}
        className="relative w-full aspect-video bg-gradient-to-br from-secondary/30 to-background"
      >
        {/* Placeholder Map Visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl max-h-96 mx-auto">
            {/* Risk Zone Visualization */}
            <div 
              className={`absolute inset-0 m-auto w-3/4 h-3/4 rounded-full bg-gradient-to-br ${getRiskColor(
                regionData.riskLevel
              )} blur-3xl opacity-60 animate-pulse`}
            />
            
            {/* Center Point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getRiskColor(
                  regionData.riskLevel
                )} animate-ping absolute`} />
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${getRiskColor(
                  regionData.riskLevel
                )}`} />
              </div>
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg">
          <h3 className="font-semibold mb-2">{regionData.name}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Lat: {regionData.coords[0].toFixed(4)}°</p>
            <p>Lon: {regionData.coords[1].toFixed(4)}°</p>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg">
          <h4 className="font-semibold text-sm mb-3">Risk Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span>Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive" />
              <span>High Risk</span>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="absolute top-4 right-4 bg-primary/10 backdrop-blur-sm rounded-lg p-3 border border-primary/20 max-w-xs">
          <p className="text-xs text-primary font-medium">
            📍 Map integration ready for traffic & weather APIs
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskOverlay;
