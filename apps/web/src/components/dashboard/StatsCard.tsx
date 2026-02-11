// src/components/dashboard/StatsCard.tsx
import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
      {icon && <div className="text-4xl text-yellow-400">{icon}</div>}
      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;