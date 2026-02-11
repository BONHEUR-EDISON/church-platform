// src/components/dashboard/DashboardLayout.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { logout, useAuth } from "../../hooks/useAuth";
import {
  HomeIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import type { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Détecte la taille de l'écran pour sidebar initial
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false); // mobile: fermé
    else setSidebarOpen(true); // desktop: ouvert
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <HomeIcon className="h-6 w-6" /> },
    { name: "Prédications", path: "/dashboard/sermons", icon: <UserGroupIcon className="h-6 w-6" /> },
    ...(user?.roles.includes("ADMIN")
      ? [{ name: "Ajouter un rôle", path: "/add-role", icon: <UserGroupIcon className="h-6 w-6" /> }]
      : []),
    { name: "Paramètres", path: "/settings", icon: <Cog6ToothIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-screen bg-white/80 backdrop-blur-xl shadow-xl flex flex-col transition-all duration-300
          ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between p-4">
          <h2
            className={`text-2xl font-extrabold text-yellow-500 transition-all duration-300 ${
              !isSidebarOpen && "opacity-0 w-0"
            }`}
          >
            Church App
          </h2>
          <button
            className="md:hidden p-1 rounded hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.name} className="group relative flex">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 w-full ${
                    isActive
                      ? "bg-yellow-100 text-yellow-600 font-semibold shadow-lg"
                      : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 hover:scale-105"
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                </Link>

                {/* Tooltip pour mini sidebar */}
                {!isSidebarOpen && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap shadow-lg">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="group relative">
          <button
            onClick={logout}
            className="mt-auto flex items-center gap-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md hover:scale-105 transition-all duration-300 w-full"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            {isSidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
          {!isSidebarOpen && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg">
              Déconnexion
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {/* Topbar */}
        <header className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-xl shadow-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md md:hidden hover:bg-gray-200 transition"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-700">
              Bonjour, <span className="text-yellow-500 font-extrabold">{user?.email}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all duration-200 shadow-sm">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 hover:scale-110 transition-all duration-200 shadow-sm">
              <UserCircleIcon className="h-8 w-8 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
