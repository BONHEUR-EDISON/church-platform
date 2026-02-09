// src/components/dashboard/Topbar.tsx
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-xl shadow-md sticky top-0 z-50">
      {/* Welcome message */}
      <h1 className="text-xl font-bold text-gray-700">
        Bonjour,{" "}
        <span className="text-yellow-500 font-extrabold">{user?.email}</span>
      </h1>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all duration-200 shadow-sm">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white"></span>
        </button>

        {/* User profile */}
        <button className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all duration-200 shadow-sm">
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
