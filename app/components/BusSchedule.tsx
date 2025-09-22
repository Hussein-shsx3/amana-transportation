import React from "react";
import {
  BusScheduleProps,
  BusStop,
  Incident,
} from "../types/transportation.types";
import { Users, Clock, AlertTriangle, Settings } from "lucide-react";

const BusSchedule: React.FC<BusScheduleProps> = ({ selectedBus, busLines }) => {
  const formatTime = (time: string): string => {
    if (!time || time === "N/A") return "N/A";
    return time;
  };

  const getUtilizationColor = (percentage: number): string => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-emerald-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-800">Bus Schedule & Status</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {busLines.map((bus) => (
            <button
              key={bus.id}
              className={`p-3 rounded-lg border transition-all ${
                selectedBus?.id === bus.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <div className="text-sm font-medium">{bus.route_number}</div>
            </button>
          ))}
        </div>

        {selectedBus && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {selectedBus.passengers.current}
                    </div>
                    <div className="text-sm text-gray-600">
                      Current Passengers
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-indigo-400" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Capacity: {selectedBus.passengers.capacity}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`text-2xl font-bold ${getUtilizationColor(
                        selectedBus.passengers.utilization_percentage
                      )}`}
                    >
                      {selectedBus.passengers.utilization_percentage}%
                    </div>
                    <div className="text-sm text-gray-600">Utilization</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedBus.route_info.estimated_completion}
                    </div>
                    <div className="text-sm text-gray-600">ETA Completion</div>
                  </div>
                  <Clock className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Bus Stop
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Next Arrival
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBus.bus_stops.map((stop: BusStop, index: number) => (
                    <tr
                      key={stop.id}
                      className={`border-b border-gray-100 ${
                        stop.is_next_stop ? "bg-indigo-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          {stop.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-600">
                          {formatTime(stop.estimated_arrival)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {stop.is_next_stop ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Next Stop
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedBus.incidents && selectedBus.incidents.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Recent Incidents
                </h4>
                <div className="space-y-2">
                  {selectedBus.incidents.map((incident: Incident) => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <div>
                        <div className="text-sm font-medium text-amber-800">
                          {incident.type}: {incident.description}
                        </div>
                        <div className="text-xs text-amber-600">
                          Reported by {incident.reported_by} at{" "}
                          {incident.reported_time}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : incident.status === "Reported"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedBus && (
          <div className="text-center py-12 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">
              Select a bus route to view detailed schedule
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSchedule;
