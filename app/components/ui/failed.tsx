import { AlertTriangle } from "lucide-react";
import React from "react";

const Failed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center text-red-500">
        <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
        <p className="text-lg">Failed to load transportation data</p>
      </div>
    </div>
  );
};

export default Failed;
