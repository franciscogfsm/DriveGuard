import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { generateRiskZones } from "@/lib/riskCalculator";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RegionData {
  name: string;
  coords: [number, number];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
}

interface RiskOverlayProps {
  regionData: RegionData;
}

interface RiskZone {
  lat: number;
  lng: number;
  radius: number;
  risk: number;
}

const RiskOverlay = ({ regionData }: RiskOverlayProps) => {
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate risk zones based on region data
    const zones = generateRiskZones(
      regionData.coords[0],
      regionData.coords[1],
      regionData.riskScore,
      20
    );
    setRiskZones(zones);
    setIsLoading(false);
  }, [regionData]);

  const getRiskColor = (risk: number): string => {
    if (risk < 35) return "#22c55e"; // green
    if (risk < 65) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getRiskOpacity = (risk: number): number => {
    return 0.3 + (risk / 100) * 0.4; // 0.3 to 0.7
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-lg">
        <div className="relative w-full h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-lg">
      <div className="relative w-full h-[600px]">
        <MapContainer
          center={regionData.coords}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          scrollWheelZoom={true}
        >
          {/* TomTom Traffic Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.tomtom.com">TomTom</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* TomTom Traffic Flow Overlay */}
          <TileLayer
            url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative/{z}/{x}/{y}.png?key=${
              import.meta.env.VITE_TOMTOM_API_KEY ||
              "l9Xv0Yb9tR42v3vlgz2nZvzwa2SLVCFK"
            }`}
            attribution='&copy; <a href="https://www.tomtom.com">TomTom</a>'
            opacity={0.6}
          />

          {/* Risk Zones */}
          {riskZones.map((zone, index) => (
            <Circle
              key={index}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: getRiskColor(zone.risk),
                fillColor: getRiskColor(zone.risk),
                fillOpacity: getRiskOpacity(zone.risk),
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm p-2">
                  <p className="font-semibold mb-1">Risk Zone #{index + 1}</p>
                  <p>Risk Score: {zone.risk.toFixed(0)}/100</p>
                  <p>
                    Level:{" "}
                    {zone.risk < 35
                      ? "Low"
                      : zone.risk < 65
                      ? "Medium"
                      : "High"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Radius: {(zone.radius / 1000).toFixed(1)} km
                  </p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg z-[1000]">
          <h3 className="font-semibold mb-2">{regionData.name}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Lat: {regionData.coords[0].toFixed(4)}°</p>
            <p>Lon: {regionData.coords[1].toFixed(4)}°</p>
            <p className="text-xs mt-2 pt-2 border-t border-border">
              Zones: {riskZones.length}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg z-[1000]">
          <h4 className="font-semibold text-sm mb-3">Risk Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success" />
              <span>Low Risk (0-35)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning" />
              <span>Medium Risk (35-65)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-destructive" />
              <span>High Risk (65+)</span>
            </div>
          </div>
        </div>

        {/* Data Sources Badge */}
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg p-3 border border-primary/30 shadow-lg z-[1000] max-w-xs">
          <p className="text-xs text-primary-foreground font-medium flex items-center gap-2">
            <span className="animate-pulse">●</span>
            Live: TomTom Traffic + Weather Data
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskOverlay;
