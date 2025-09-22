"use client";

import React, { useState } from "react";
import { Bus, Menu, X } from "lucide-react";
import { HeaderProps } from "../types/transportation.types";

const Header: React.FC<HeaderProps> = ({ companyInfo, operationalSummary }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Bus className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{companyInfo?.name}</h1>
              <p className="text-indigo-100 text-sm">
                Serving Malaysia since {companyInfo?.founded}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xl font-bold">
                {operationalSummary?.active_buses}
              </div>
              <div className="text-xs text-indigo-100">Active Buses</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {operationalSummary?.current_passengers}
              </div>
              <div className="text-xs text-indigo-100">Current Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {operationalSummary?.average_utilization}%
              </div>
              <div className="text-xs text-indigo-100">Average Utilization</div>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 grid grid-cols-3 gap-4">
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">
                {operationalSummary?.active_buses}
              </div>
              <div className="text-xs text-indigo-100">Active</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">
                {operationalSummary?.current_passengers}
              </div>
              <div className="text-xs text-indigo-100">Passengers</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">
                {operationalSummary?.average_utilization}%
              </div>
              <div className="text-xs text-indigo-100">Utilization</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
