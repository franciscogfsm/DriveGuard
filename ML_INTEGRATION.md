# Machine Learning Integration - DriveGuard

## Overview

The system now learns from real accidents to continuously improve risk predictions over time. This document explains how the ML system works and what was implemented.

## How It Works

### 1. Accident Data Collection

Every time an accident is detected through the TomTom Incidents API:

- **Location**: Exact latitude/longitude coordinates
- **Severity**: Incident severity level
- **Category**: Type of incident (accident, congestion, etc.)
- **Weather Conditions**: Temperature, precipitation, visibility, wind speed at time of accident
- **Traffic Conditions**: Flow speed, congestion level at time of accident
- **Time Context**: Hour of day, day of week when accident occurred

All data is stored in localStorage (max 1000 records).

### 2. Hotspot Identification

The system automatically clusters accidents that occur close together:

- **Clustering Radius**: 330 meters (0.003 degrees)
- **Hotspot Threshold**: 2 or more accidents within radius
- **Risk Multiplier**: 1.2x to 2.5x based on accident frequency
  - 2 accidents: 1.2x multiplier
  - 3 accidents: 1.5x multiplier
  - 4 accidents: 1.8x multiplier
  - 5+ accidents: 2.0x to 2.5x multiplier

### 3. Pattern Recognition

For each hotspot, the system identifies:

- **Common Weather Patterns**: What weather conditions were present during accidents
- **Common Time Patterns**: When accidents tend to occur (time of day, day of week)
- **Common Traffic Patterns**: Traffic conditions during accidents

### 4. Risk Score Enhancement

When generating risk zones, the ML system adds bonus points based on learned patterns:

| Factor                  | Points            | Condition                                                    |
| ----------------------- | ----------------- | ------------------------------------------------------------ |
| **Hotspot Proximity**   | +15 \* multiplier | Zone is within a known hotspot area                          |
| **Matching Conditions** | +10               | Current weather/traffic match historical accident conditions |
| **Time Pattern Match**  | +8                | Current time matches accident time patterns                  |
| **Similar Weather**     | +5                | Weather similar to accident weather                          |
| **Similar Time**        | +3                | Time similar to accident times                               |

**Maximum ML Adjustment**: 30 points (capped to prevent over-adjustment)

### 5. Self-Assessment

The system tracks its own accuracy:

- **Prediction Accuracy**: % of accidents that occurred in predicted high-risk zones
- **Total Accidents**: Number of accidents recorded
- **Hotspots Identified**: Number of danger zones found
- **Recent Activity**: Accidents in last 7 days
- **Data Quality**: "Building", "Fair", or "Good" based on data volume

## Implementation Details

### Files Modified

#### 1. `src/lib/accidentHistory.ts` (NEW - 410 lines)

Complete ML system with:

- `recordAccident()` - Saves incidents with full context
- `updateAccidentHotspots()` - Clusters accidents
- `calculateMLRiskAdjustment()` - Returns 0-30pt risk boost
- `getLearningStats()` - Shows system performance
- `clearLearningData()` - Reset for testing

#### 2. `src/lib/riskCalculator.ts`

- Added import for `calculateMLRiskAdjustment`
- Added `mlAdjustment` field to `RiskFactors` interface
- Updated `generateRiskZones()` to apply ML adjustments to each zone
- ML adjustment applied after base risk calculation

```typescript
// Apply ML-based risk adjustment from accident history
const mlAdjustment = calculateMLRiskAdjustment(
  zoneLat,
  zoneLng,
  weather,
  traffic,
  new Date().getHours()
);
zoneRisk = Math.min(100, zoneRisk + mlAdjustment); // Cap at 100
```

#### 3. `src/pages/RiskMap.tsx`

- Added imports for accident history functions
- Added `learningStats` state
- Records all detected accidents with full context
- Updates hotspots after recording
- Refreshes learning statistics display
- Shows ML statistics card with 4 metrics

### Real-Time Learning Loop

```
1. Auto-refresh fetches new data (every 60s)
   ↓
2. TomTom API returns incident locations
   ↓
3. Each incident recorded with weather/traffic context
   ↓
4. Hotspots recalculated (clustering algorithm)
   ↓
5. Learning stats refreshed
   ↓
6. Next refresh uses improved predictions
```

## User Experience

### Visual Feedback

The ML system is visible through:

1. **Learning Statistics Card**: Shows 4 key metrics

   - Accidents Tracked (blue)
   - Hotspots Found (yellow/warning)
   - Last 7 Days activity (blue)
   - Prediction Accuracy % (green/success)

2. **Data Quality Indicator**: Animated pulse showing system status

   - "Building" - Less than 10 accidents
   - "Fair" - 10-50 accidents
   - "Good" - 50+ accidents

3. **Enhanced Alerts**: Accident warnings now mention learning

   > "System learning from this accident"

4. **Risk Zone Improvements**: Zones in hotspot areas show higher risk scores automatically

## Benefits

### 1. Continuous Improvement

- System gets better over time as it collects more data
- No manual intervention required
- Patterns emerge naturally from real accident data

### 2. Location-Specific Learning

- Identifies specific dangerous intersections/roads
- Learns which weather conditions are most dangerous in each area
- Understands time-of-day patterns for each location

### 3. Accuracy Tracking

- System measures its own prediction accuracy
- Provides transparency about data quality
- Shows users the system is actively learning

### 4. Privacy-Preserving

- All data stored locally in browser
- No personal information collected
- Only geographic patterns and conditions

## Testing the System

### Simulate Accident Data

The system includes a test function to populate initial data:

```typescript
// In browser console
import { recordAccident, updateAccidentHotspots } from "./lib/accidentHistory";

// Simulate accidents
recordAccident(
  { lat: 38.7223, lng: -9.1393, severity: "high", category: "ACCIDENT" },
  { temp: 15, precipitation: 5, visibility: 1000, windSpeed: 40 },
  { flowSpeed: 20, congestionLevel: 0.8 }
);

updateAccidentHotspots();
```

### Clear Learning Data

To reset the system:

```typescript
import { clearLearningData } from "./lib/accidentHistory";
clearLearningData();
```

## Future Enhancements

Possible improvements:

1. **Weather Pattern Predictions**: Predict risk increases before weather arrives
2. **Seasonal Learning**: Track seasonal accident patterns
3. **Route Recommendations**: Suggest alternative routes avoiding hotspots
4. **Historical Comparison**: Compare current conditions to historical accident conditions
5. **Export/Import**: Share learned patterns between users (privacy-aware)
6. **Advanced Clustering**: Use DBSCAN or k-means for better hotspot detection
7. **Neural Network**: Replace rule-based system with trained model

## Technical Notes

### Storage Limits

- **Maximum Accidents**: 1000 (oldest removed when exceeded)
- **Storage Method**: localStorage (browser-based)
- **Data Size**: ~500KB for 1000 records

### Performance

- **Clustering Speed**: O(n²) for n accidents (fast for <1000 records)
- **Lookup Speed**: O(n) for hotspot checking (optimized with spatial hashing possible)
- **Update Frequency**: Every 60 seconds with auto-refresh

### Accuracy Calculation

```
Prediction Accuracy = (Accidents in High-Risk Zones / Total Accidents) * 100

High-Risk Zone = Risk score ≥ 60
```

## Conclusion

The ML system transforms DriveGuard from a static risk assessment tool into an intelligent, learning system that improves with every accident it observes. The more it's used, the better its predictions become, making it increasingly valuable for preventing future accidents.

**Key Achievement**: Real-time learning from real accidents to improve future predictions automatically.
