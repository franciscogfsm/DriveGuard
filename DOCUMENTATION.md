# DriveGuard 🛡️🚗

An intelligent road safety platform that predicts accident risk in real-time using AI-powered analysis of traffic and weather conditions across Portugal.

## Features

- 🗺️ **Interactive Risk Maps** - Visualize accident risk zones using Leaflet mapping with color-coded overlays
- 🚦 **Real-Time Traffic Data** - Integration with TomTom Traffic API for live traffic flow and incident data
- 🌦️ **Weather Integration** - Weather condition analysis using OpenWeatherMap API
- 🤖 **AI Risk Prediction** - Sophisticated algorithm combining multiple factors to calculate risk scores
- 📊 **Detailed Analytics** - Comprehensive breakdown of risk factors with safety recommendations
- 🔄 **Live Updates** - Real-time data refresh capability

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Mapping**: Leaflet + React Leaflet
- **APIs**:
  - TomTom Traffic API (Traffic Flow, Incidents, Tiles)
  - OpenWeatherMap API (Weather Data)
- **State Management**: React Query
- **Routing**: React Router v6

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

#### TomTom API (Already Configured ✓)

Your TomTom API key is already set up in the code:

- Key: `l9Xv0Yb9tR42v3vlgz2nZvzwa2SLVCFK`
- Products enabled: Traffic API, Map Display, Search, Routing, etc.

#### OpenWeatherMap API (Required)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key (free tier is sufficient)
4. Create a `.env` file in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_TOMTOM_API_KEY=l9Xv0Yb9tR42v3vlgz2nZvzwa2SLVCFK
```

**Note**: The app will use mock data if OpenWeatherMap API key is not configured. To enable real weather data, update `src/lib/config.ts` and set `MOCK_DATA_ENABLED = false`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
DriveGuard/
├── src/
│   ├── components/
│   │   ├── RiskOverlay.tsx       # Map component with risk zones
│   │   ├── NavLink.tsx
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/
│   │   ├── Index.tsx             # Landing page
│   │   ├── RegionSelector.tsx    # Region selection
│   │   ├── RiskMap.tsx           # Main risk map view
│   │   └── NotFound.tsx
│   ├── lib/
│   │   ├── riskCalculator.ts     # Risk calculation algorithm
│   │   ├── apiService.ts         # API integration
│   │   ├── config.ts             # API configuration
│   │   └── utils.ts
│   ├── hooks/
│   └── App.tsx
└── package.json
```

## How Risk Calculation Works

The risk score (0-100) is calculated using a weighted algorithm:

1. **Weather Risk (35%)**:

   - Precipitation levels
   - Visibility conditions
   - Wind speed
   - Weather condition codes

2. **Traffic Risk (35%)**:

   - Traffic congestion level
   - Speed differential (flow vs free-flow)
   - Number of incidents

3. **Time of Day Risk (15%)**:

   - Rush hours (7-9 AM, 5-7 PM)
   - Night driving (10 PM - 5 AM)

4. **Historical Risk (15%)**:
   - Region-specific historical accident data

### Risk Levels

- 🟢 **Low** (0-35): Favorable driving conditions
- 🟡 **Medium** (35-65): Caution advised
- 🔴 **High** (65-100): High-risk conditions, extra precautions needed

## Supported Regions

- Lisboa
- Porto
- Faro
- Coimbra
- Braga
- Setúbal
- Aveiro
- Évora
- Leiria
- Viseu
- Beja
- Guarda

## API Usage & Limits

### TomTom API (Freemium)

- Traffic Flow: Real-time traffic speed data
- Traffic Incidents: Accident and incident reports
- Traffic Tiles: Visual traffic overlay on maps
- Daily limit: Check your TomTom dashboard

### OpenWeatherMap API (Free Tier)

- 1,000 calls/day
- Current weather data
- Updates every 10 minutes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Regions

Edit `src/pages/RiskMap.tsx` and add to the `REGION_DATA` object:

```typescript
newregion: {
  name: "Region Name",
  coords: [latitude, longitude],
  riskLevel: "medium",
  riskScore: 50,
  weatherCondition: "Clear",
  trafficDensity: "Moderate"
}
```

## Future Enhancements

- [ ] Historical data analysis and trends
- [ ] Route planning with risk assessment
- [ ] Push notifications for high-risk areas
- [ ] Mobile app (React Native)
- [ ] Machine learning for better predictions
- [ ] User-reported incidents
- [ ] Integration with more weather providers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [TomTom](https://www.tomtom.com) for traffic data APIs
- [OpenWeatherMap](https://openweathermap.org) for weather data
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Leaflet](https://leafletjs.com) for mapping

---

Built with ❤️ for safer roads in Portugal 🇵🇹
