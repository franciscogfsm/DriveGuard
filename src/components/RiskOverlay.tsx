import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { generateRiskZones } from "@/lib/riskCalculator";
import type { IncidentData } from "@/lib/apiService";

// Fix Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Accident marker icon (red warning)
const AccidentIcon = L.icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNFRjQ0NDQiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTYgOFYxOE0xNiAyMlYyNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface RegionData {
  name: string;
  coords: [number, number];
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  weather?: any;
  traffic?: any;
  incidents?: IncidentData[];
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
    // Generate precise risk zones with weather/traffic-specific calculations
    const zones = generateRiskZones(
      regionData.coords[0],
      regionData.coords[1],
      regionData.riskScore,
      25, // Optimal number of non-overlapping zones
      regionData.name, // City name for road patterns
      regionData.weather, // Pass weather for zone-specific risk
      regionData.traffic // Pass traffic for zone-specific risk
    );
    setRiskZones(zones);
    setIsLoading(false);
  }, [regionData]);

  const getRiskColor = (risk: number): string => {
    if (risk < 30) return "#22c55e"; // green - low risk
    if (risk < 60) return "#f59e0b"; // amber - medium risk
    return "#ef4444"; // red - high risk
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
          zoom={12}
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

          {/* Risk Prediction Zones */}
          {riskZones.map((zone, index) => (
            <Circle
              key={`zone-${index}`}
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
                  <p className="font-semibold mb-1">
                    🎯 Risk Prediction Zone #{index + 1}
                  </p>
                  <p>Risk Score: {zone.risk.toFixed(0)}/100</p>
                  <p>
                    Level:{" "}
                    {zone.risk < 30
                      ? "Low"
                      : zone.risk < 60
                      ? "Medium"
                      : "High"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Radius: {zone.radius.toFixed(0)}m
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on local weather & traffic
                  </p>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Real Accident/Incident Markers */}
          {regionData.incidents &&
            regionData.incidents.length > 0 &&
            regionData.incidents.map((incident, index) => (
              <Marker
                key={`incident-${index}`}
                position={[incident.lat, incident.lng]}
                icon={AccidentIcon}
              >
                <Popup>
                  <div className="text-sm p-2">
                    <p className="font-semibold mb-1 text-destructive">
                      🚨 REAL ACCIDENT/INCIDENT
                    </p>
                    <p className="font-medium">Type: {incident.category}</p>
                    <p>Severity: {incident.severity}/5</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Live data from TomTom Traffic API
                    </p>
                    <p className="text-xs text-destructive font-bold mt-1">
                      ⚠️ Drive with extreme caution
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg z-[1000]">
          <h3 className="font-semibold mb-2">{regionData.name}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Lat: {regionData.coords[0].toFixed(4)}°</p>
            <p>Lon: {regionData.coords[1].toFixed(4)}°</p>
            <p className="text-xs mt-2 pt-2 border-t border-border">
              🎯 Prediction Zones: {riskZones.length}
            </p>
            {regionData.incidents && regionData.incidents.length > 0 && (
              <p className="text-xs text-destructive font-bold animate-pulse">
                🚨 Real Accidents: {regionData.incidents.length}
              </p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg z-[1000]">
          <h4 className="font-semibold text-sm mb-3">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="font-medium text-xs text-muted-foreground mb-1">
              AI Risk Predictions:
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-success bg-success/30" />
              <span>Low Risk (&lt;30)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-warning bg-warning/30" />
              <span>Medium (30-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-destructive bg-destructive/30" />
              <span>High Risk (60+)</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center text-white text-xs font-bold">
                !
              </div>
              <span className="text-destructive font-bold">Real Accident</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
            Circles: 130-280m radius
            <br />
            Zone-specific calculations
            {regionData.incidents && regionData.incidents.length > 0 && (
              <>
                <br />
                <span className="text-destructive font-bold">
                  {regionData.incidents.length} live incident(s)
                </span>
              </>
            )}
          </p>
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
