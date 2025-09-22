import React, { useState, useEffect } from "react";
import { InteractiveMapProps, BusLine } from "../types/transportation.types";
import { Navigation, AlertTriangle } from "lucide-react";

const InteractiveMap: React.FC<InteractiveMapProps> = ({ selectedBus }) => {
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => {
        setTimeout(() => setMapLoaded(true), 100);
      };
      script.onerror = () => {
        setMapError("Failed to load map library");
      };
      document.body.appendChild(script);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.L) {
      setMapLoaded(true);
    }
  }, []);

  const LeafletMap = ({ selectedBus }: { selectedBus: BusLine }) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<any>(null);

    useEffect(() => {
      if (!mapRef.current || !window.L || mapInstanceRef.current) return;

      const L = window.L;

      // Initialize map
      const map = L.map(mapRef.current).setView(
        [
          selectedBus.current_location.latitude,
          selectedBus.current_location.longitude,
        ],
        12
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      selectedBus.bus_stops.forEach((stop) => {
        const marker = L.marker([stop.latitude, stop.longitude]).addTo(map);
        marker.bindPopup(`
          <div style="padding: 8px; font-family: system-ui, sans-serif;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #374151;">${
              stop.name
            }</h4>
            <p style="margin: 0; font-size: 12px; color: #6B7280;">
              ${
                stop.is_next_stop
                  ? '<strong style="color: #059669;">Next Stop</strong>'
                  : `ETA: ${stop.estimated_arrival}`
              }
            </p>
          </div>
        `);
      });

      const routeCoordinates = selectedBus.bus_stops.map((stop) => [
        stop.latitude,
        stop.longitude,
      ]);
      if (routeCoordinates.length > 0) {
        L.polyline(routeCoordinates, {
          color: "#6366f1",
          weight: 4,
          opacity: 0.7,
        }).addTo(map);
      }

      const busIcon = L.divIcon({
        html: `
          <div style="
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            font-weight: bold;
          ">🚌</div>
        `,
        className: "custom-bus-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const busMarker = L.marker(
        [
          selectedBus.current_location.latitude,
          selectedBus.current_location.longitude,
        ],
        { icon: busIcon }
      ).addTo(map);

      busMarker.bindPopup(`
        <div style="padding: 12px; font-family: system-ui, sans-serif;">
          <h4 style="margin: 0 0 6px 0; font-weight: bold; color: #6366f1; display: flex; align-items: center;">
            <span style="margin-right: 6px;">🚌</span> ${selectedBus.name}
          </h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #4B5563;">${selectedBus.current_location.address}</p>
          <div style="font-size: 11px; color: #6B7280; line-height: 1.4;">
            <div><strong>Passengers:</strong> ${selectedBus.passengers.current}/${selectedBus.passengers.capacity}</div>
            <div><strong>Driver:</strong> ${selectedBus.driver.name}</div>
            <div><strong>Utilization:</strong> ${selectedBus.passengers.utilization_percentage}%</div>
          </div>
        </div>
      `);

      mapInstanceRef.current = map;

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, [selectedBus]);

    return <div ref={mapRef} className="h-full w-full rounded-lg" />;
  };

  if (mapError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">Failed to load map</p>
          <p className="text-sm mt-2">{mapError}</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!selectedBus) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Select a bus route to view its location</p>
          <p className="text-sm mt-2">Choose from the route buttons above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-800">{selectedBus.name}</h3>
        <p className="text-sm text-gray-600">
          Route: {selectedBus.route_number}
        </p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span>
            📍 Current: {selectedBus.current_location.address.split(",")[0]}
          </span>
          <span>
            👥 {selectedBus.passengers.current}/
            {selectedBus.passengers.capacity}
          </span>
        </div>
      </div>

      <div className="h-96 relative">
        <LeafletMap selectedBus={selectedBus} />
      </div>
    </div>
  );
};

export default InteractiveMap;
