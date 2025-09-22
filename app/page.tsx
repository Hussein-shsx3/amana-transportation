"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { BusLine, TransportationData } from "./types/transportation.types";
import Header from "./components/Header";
import BusRouteSelector from "./components/BusRouteSelector";
import InteractiveMap from "./components/InteractiveMap";
import BusSchedule from "./components/BusSchedule";
import { getMockData } from "./mock/getMockData";
import Loading from "./components/ui/loading";
import Failed from "./components/ui/failed";

declare global {
  interface Window {
    L: any;
  }
}

const TransportationApp: React.FC = () => {
  const [busData, setBusData] = useState<TransportationData | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusLine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<"api" | "mock">("api");

  useEffect(() => {
    fetchBusData();
  }, []);

  const fetchBusData = async (): Promise<void> => {
    try {
      let response = await fetch("/api/transportation");

      if (!response.ok) {
        response = await fetch(
          "https://amanabootcamp.org/api/fs-classwork-data/amana-transportation"
        );
      }

      if (!response.ok) {
        console.warn("API unavailable, using mock data");
        setDataSource("mock");
        const mockData = getMockData();
        setBusData(mockData);
        const firstActiveBus = mockData.bus_lines.find(
          (bus: BusLine) => bus.status === "Active"
        );
        if (firstActiveBus) {
          setSelectedBus(firstActiveBus);
        }
        return;
      }

      const data: TransportationData = await response.json();
      setDataSource("api");
      setBusData(data);
      const firstActiveBus = data.bus_lines.find(
        (bus: BusLine) => bus.status === "Active"
      );
      if (firstActiveBus) {
        setSelectedBus(firstActiveBus);
      }
    } catch (error) {
      console.error("Error fetching bus data, using mock data:", error);
      setDataSource("mock");
      const mockData = getMockData();
      setBusData(mockData);
      const firstActiveBus = mockData.bus_lines.find(
        (bus: BusLine) => bus.status === "Active"
      );
      if (firstActiveBus) {
        setSelectedBus(firstActiveBus);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!busData) {
    return <Failed />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Data source indicator */}
      {dataSource === "mock" && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <p className="text-sm">
              <strong>Demo Mode:</strong> Using mock data due to API
              connectivity issues. Full functionality is demonstrated with
              sample transportation data.
            </p>
          </div>
        </div>
      )}

      <Header
        companyInfo={busData.company_info}
        operationalSummary={busData.operational_summary}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <BusRouteSelector
          busLines={busData.bus_lines}
          selectedBus={selectedBus}
          onBusSelect={setSelectedBus}
          filters={busData.filters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InteractiveMap
            selectedBus={selectedBus}
            busLines={busData.bus_lines}
          />

          <BusSchedule selectedBus={selectedBus} busLines={busData.bus_lines} />
        </div>
      </div>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {busData.company_info.name}. All rights reserved.</p>
            <p className="text-sm mt-2">{busData.company_info.description}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TransportationApp;
