<div align="center">

# DriveGuard

Road risk, predicted from live traffic, incidents and weather.

<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white" alt="shadcn/ui">
<img src="https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white" alt="Leaflet">

<sub>
<a href="DOCUMENTATION.md">Documentation</a> &nbsp;·&nbsp;
<a href="QUICKSTART.md">Quick start</a>
</sub>

</div>

<br>

DriveGuard shows where driving is risky right now. It combines live traffic flow and incidents from
TomTom with weather into a risk score per zone, draws the zones on an interactive map, and learns
from the accidents it sees to adjust future predictions.

## What it does

- An interactive Leaflet map with a live TomTom traffic overlay
- Colour-coded risk zones per region, each with a detail popup
- Risk scores from traffic speed, congestion, incidents, weather and time of day
- A learning loop that records each detected accident with its conditions and reweights the risk model

## Start

```bash
npm install
npm run dev
```

The app needs a TomTom API key, read from `VITE_TOMTOM_API_KEY`.

## Documentation

| File | What it covers |
|---|---|
| [`DOCUMENTATION.md`](DOCUMENTATION.md) | Full technical documentation |
| [`RISK_FLOW.md`](RISK_FLOW.md) | How a risk score is computed |
| [`ML_INTEGRATION.md`](ML_INTEGRATION.md) | The accident learning loop |
| [`REALTIME_IMPROVEMENTS.md`](REALTIME_IMPROVEMENTS.md), [`PRECISION_IMPROVEMENTS.md`](PRECISION_IMPROVEMENTS.md) | Change notes |
