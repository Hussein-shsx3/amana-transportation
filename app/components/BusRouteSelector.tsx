import React from "react";
import { BusRouteSelectorProps, BusLine } from "../types/transportation.types";

const BusRouteSelector: React.FC<BusRouteSelectorProps> = ({
  busLines,
  selectedBus,
  onBusSelect,
}) => {
  const getStatusColor = (status: BusLine["status"]): string => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Maintenance":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Out of Service":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Active Bus Routes
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {busLines.map((bus) => (
          <button
            key={bus.id}
            onClick={() => onBusSelect(bus)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedBus?.id === bus.id
                ? "border-indigo-500 bg-indigo-50 shadow-md transform scale-105"
                : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-25"
            }`}
          >
            <div className="text-sm font-medium text-gray-800">
              {bus.route_number}
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full mt-1 border ${getStatusColor(
                bus.status
              )}`}
            >
              {bus.status}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusRouteSelector;
