# DriveGuard Risk Calculation - Visual Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DRIVEGUARD RISK ENGINE                           │
│                     AI-Powered Safety Prediction                        │
└─────────────────────────────────────────────────────────────────────────┘

                                ┌──────────┐
                                │  START   │
                                └────┬─────┘
                                     │
                     ┌───────────────┼───────────────┐
                     │               │               │
                     ▼               ▼               ▼
            ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
            │   FETCH     │  │   FETCH     │  │  GET TIME    │
            │  WEATHER    │  │  TRAFFIC    │  │   OF DAY     │
            │   DATA      │  │   DATA      │  │              │
            └──────┬──────┘  └──────┬──────┘  └──────┬───────┘
                   │                │                 │
                   │ OpenWeather    │ TomTom API      │ Local
                   │ API            │                 │
                   ▼                ▼                 ▼
         ┌──────────────────┐ ┌──────────────┐ ┌──────────┐
         │ WEATHER ANALYSIS │ │   TRAFFIC    │ │   TIME   │
         │                  │ │  ANALYSIS    │ │ ANALYSIS │
         └──────┬───────────┘ └──────┬───────┘ └────┬─────┘
                │                    │                │
                │                    │                │
                ▼                    ▼                ▼
       ┌─────────────────┐  ┌─────────────────┐  ┌────────┐
       │ Precipitation   │  │ Congestion %    │  │Rush Hr │
       │ Visibility      │  │ Speed Diff      │  │Night   │
       │ Wind Speed      │  │ Incidents       │  │        │
       │ Condition Code  │  │                 │  │        │
       └────────┬────────┘  └────────┬────────┘  └───┬────┘
                │                    │                │
                ▼                    ▼                ▼
         ┌────────────┐      ┌────────────┐    ┌──────────┐
         │   0-100    │      │   0-100    │    │  0-100   │
         │  POINTS    │      │  POINTS    │    │  POINTS  │
         └─────┬──────┘      └─────┬──────┘    └────┬─────┘
               │                   │                 │
               │ ×35%              │ ×35%            │ ×15%
               │                   │                 │
               └────────┬──────────┴─────┬───────────┘
                        │                │
                        │      ┌─────────┴──────────┐
                        │      │ Historical Risk    │
                        │      │ (Region Baseline)  │
                        │      │      ×15%          │
                        │      └─────────┬──────────┘
                        │                │
                        └────────┬───────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  WEIGHTED CALCULATION  │
                    │                        │
                    │  Risk = W×0.35 +       │
                    │         T×0.35 +       │
                    │         Time×0.15 +    │
                    │         Hist×0.15      │
                    └────────────┬───────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │  RISK SCORE   │
                         │    0-100      │
                         └───────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
         0-35       ▼      35-65 ▼      65-100▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │   LOW    │      │  MEDIUM  │      │   HIGH   │
    │ 🟢 GREEN │      │ 🟡 AMBER │      │ 🔴 RED   │
    └────┬─────┘      └────┬─────┘      └────┬─────┘
         │                 │                  │
         └─────────────────┼──────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  GENERATE      │
                  │ RECOMMENDATIONS│
                  └────────┬───────┘
                           │
                           ▼
                   ┌───────────────┐
                   │  VISUALIZE    │
                   │  ON MAP       │
                   │  • Zones      │
                   │  • Colors     │
                   │  • Overlays   │
                   └───────┬───────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   DISPLAY   │
                    │   TO USER   │
                    └─────────────┘
```

## DETAILED SCORING BREAKDOWN

### 🌦️ WEATHER RISK COMPONENT (Max 100 points)

```
Precipitation Risk (0-30 pts)
├─ >5mm/h      → 30 points
├─ 2-5mm/h     → 20 points
├─ 0.5-2mm/h   → 10 points
└─ <0.5mm/h    → 0 points

Visibility Risk (0-25 pts)
├─ <1km        → 25 points
├─ 1-3km       → 15 points
├─ 3-5km       → 8 points
└─ >5km        → 0 points

Wind Speed Risk (0-20 pts)
├─ >50km/h     → 20 points
├─ 30-50km/h   → 12 points
├─ 20-30km/h   → 6 points
└─ <20km/h     → 0 points

Condition Code Risk (0-25 pts)
├─ Thunderstorm (2xx) → 25 points
├─ Snow (6xx)         → 20 points
├─ Rain (5xx)         → 15 points
├─ Fog/Mist (7xx)     → 12 points
├─ Drizzle (3xx)      → 10 points
└─ Clear/Clouds       → 0 points
```

### 🚗 TRAFFIC RISK COMPONENT (Max 100 points)

```
Congestion Level (0-40 pts)
├─ >70%        → 40 points (severe)
├─ 50-70%      → 30 points (heavy)
├─ 30-50%      → 20 points (moderate)
└─ <30%        → 10 points (light)

Speed Differential (0-35 pts)
├─ <30% free flow   → 35 points
├─ 30-50% free flow → 25 points
├─ 50-70% free flow → 15 points
└─ >70% free flow   → 0 points

Incidents (0-25 pts)
├─ 3+ incidents → 25 points
├─ 2 incidents  → 18 points
├─ 1 incident   → 10 points
└─ 0 incidents  → 0 points
```

### ⏰ TIME OF DAY RISK

```
Current Hour Analysis:
├─ 07:00-09:00 → 25 points (morning rush)
├─ 17:00-19:00 → 25 points (evening rush)
├─ 22:00-05:00 → 20 points (night driving)
├─ 20:00-22:00 → 15 points (late evening)
└─ Other times → 5 points (normal)
```

### 📊 HISTORICAL RISK (Regional Baselines)

```
Portugal Regions:
├─ Lisboa    → 30 points (high traffic)
├─ Porto     → 28 points (urban density)
├─ Braga     → 25 points (wet climate)
├─ Coimbra   → 22 points (moderate)
├─ Viseu     → 20 points (mountain roads)
└─ Faro      → 15 points (good conditions)
```

## EXAMPLE CALCULATION

### Scenario: Rainy Evening in Lisboa

```
INPUT DATA:
─────────────────────────────────────────────
Weather:
  • Temperature: 15°C
  • Condition: Light Rain
  • Precipitation: 3 mm/h
  • Visibility: 5000m (5km)
  • Wind: 25 km/h

Traffic:
  • Current Speed: 35 km/h
  • Free Flow: 80 km/h
  • Congestion: 56% (moderate-heavy)
  • Incidents: 1

Time: 18:30 (evening rush hour)
Region: Lisboa (historical baseline: 30)

CALCULATION:
─────────────────────────────────────────────
Weather Risk:
  Precipitation (2-5mm):    20 pts
  Visibility (3-5km):        8 pts
  Wind (20-30km/h):          6 pts
  Rain condition (5xx):     15 pts
  ────────────────────────────
  Subtotal:                 49 pts

Traffic Risk:
  Congestion (56%):         30 pts (heavy)
  Speed (43% of free):      25 pts
  Incidents (1):            10 pts
  ────────────────────────────
  Subtotal:                 65 pts

Time Risk:
  18:30 (rush hour):        25 pts

Historical Risk:
  Lisboa baseline:          30 pts

WEIGHTED CALCULATION:
─────────────────────────────────────────────
  Weather:    49 × 0.35 = 17.15
  Traffic:    65 × 0.35 = 22.75
  Time:       25 × 0.15 =  3.75
  Historical: 30 × 0.15 =  4.50
                          ──────
  TOTAL RISK SCORE:       48.15 ≈ 48

RESULT:
─────────────────────────────────────────────
  Score: 48/100
  Level: MEDIUM RISK 🟡
  Color: AMBER

RECOMMENDATIONS:
─────────────────────────────────────────────
  1. Light rain detected: Reduce speed and
     increase following distance
  2. 1 incident reported: Stay alert and
     follow traffic updates
  3. Rush hour: Allow extra time and maintain
     safe distances
```

## MAP VISUALIZATION

```
     Risk Score    Color      Opacity    Radius
     ─────────────────────────────────────────────
     0-35   🟢     #22c55e    0.3-0.45   1-3km
     35-65  🟡     #f59e0b    0.45-0.6   1-3km
     65-100 🔴     #ef4444    0.6-0.7    1-3km
```

## ZONE GENERATION

For each region, generate 15-20 zones:

```
For each zone:
  1. Random position within ±0.1° of center
  2. Random radius: 1000-3000 meters
  3. Risk variation: ±30 from base score
  4. Assign color based on risk score
  5. Set opacity based on severity
  6. Add popup with details
```

## API CALL FLOW

```
User selects region
       ↓
Load base region data
       ↓
Fetch weather (lat, lon)     ←─── OpenWeatherMap API
       ↓
Fetch traffic (lat, lon)     ←─── TomTom Flow API
       ↓
Fetch incidents (bbox)       ←─── TomTom Incidents API
       ↓
Calculate all risk factors
       ↓
Generate overall risk score
       ↓
Create 15-20 risk zones
       ↓
Generate recommendations
       ↓
Render on Leaflet map        ←─── TomTom Tiles + OSM
       ↓
Display to user
```

## REFRESH CYCLE

```
Initial Load → Calculate Risk → Display Map
       ↑                                ↓
       └────── User Clicks Refresh ─────┘
                (Re-fetch all data)
```

---

This visual representation shows the complete flow of the DriveGuard
risk calculation system, from data collection to user display! 🎯
