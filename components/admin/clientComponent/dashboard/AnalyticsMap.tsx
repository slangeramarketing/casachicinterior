'use client';
import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { cityCoordinates } from "@/lib/utils/coords";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function AnalyticsMap({ data }: { data: any }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  // Zoom aur Position state 📍
  const [position, setPosition] = useState({ coordinates: [78, 22], zoom: 1 });

  const locations = data?.geo || [];

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Zoom handle karne ke functions 🔍
  const handleZoomIn = () => {
    if (position.zoom >= 5) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const getMarkerStyle = (users: number) => {
    if (users > 100) return { color: "#ef4444", radius: 10 };
    if (users > 50) return { color: "#f97316", radius: 7 };
    return { color: "#10b981", radius: 5 };
  };

  if (!hasLoaded) return <div className="h-[400px] flex items-center justify-center text-orange-500">Loading Map... 📡</div>;

  return (
    <div className="w-full h-[500px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
      
      {/* Zoom Controls Buttons ➕➖ */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-xl font-bold hover:bg-gray-50 active:scale-95 transition-all"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-xl font-bold hover:bg-gray-50 active:scale-95 transition-all"
        >
          -
        </button>
      </div>

      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "100%" }}>
        {/* OnMoveEnd zoom level sync rakhta hai agar user mouse se zoom kare */}
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={(pos) => setPosition(pos)}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={0.5} />
              ))
            }
          </Geographies>

          {locations.map((row: any, i: number) => {
            const cityName = row.dimensionValues?.[0]?.value;
            const users = parseInt(row.metricValues?.[0]?.value || "0");
            const coords = cityCoordinates[cityName];
            if (!coords || users === 0) return null;

            const { color, radius } = getMarkerStyle(users);

            return (
              <Marker key={`${cityName}-${i}`} coordinates={coords}>
                <circle r={radius + 4} fill={color} opacity={0.2} />
                <circle r={radius} fill={color} stroke="#fff" strokeWidth={2} />
                <text textAnchor="middle" y={-radius - 5} style={{ fontSize: "8px", fill: "#475569", fontWeight: "bold" }}>
                  {cityName}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

     <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Interactive Traffic Map</h4>
        <p className="text-[10px] text-gray-400">Zoom to explore regions 🔍</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-6 bg-white/90 p-3 rounded-lg border border-gray-100 text-[10px] space-y-1">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low Traffic</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Medium</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Traffic</div>
      </div>
    </div>
  );
}

