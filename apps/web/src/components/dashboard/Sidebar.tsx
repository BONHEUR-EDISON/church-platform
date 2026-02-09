// src/components/dashboard/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../hooks/useAuth";
import {
  HomeIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [sermonDropdownOpen, setSermonDropdownOpen] = useState(false);

  const allMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <HomeIcon className="h-6 w-6" />,
      roles: ["ADMIN", "PASTOR", "MEMBER"],
    },
    {
      name: "Prédications",
      icon: <UserGroupIcon className="h-6 w-6" />,
      roles: ["ADMIN", "PASTOR", "MEMBER"],
      // Les sous-menus seront gérés selon le rôle
      children: role === "MEMBER"
        ? [{ name: "Liste", path: "/dashboard/sermons" }]
        : [
            { name: "Liste", path: "/dashboard/sermons" },
            { name: "Créer", path: "/dashboard/sermons/manage" },
          ],
    },
    {
      name: "Ajouter un rôle",
      path: "/add-role",
      icon: <UserGroupIcon className="h-6 w-6" />,
      roles: ["ADMIN", "PASTOR"],
    },
    {
      name: "Paramètres",
      path: "/settings",
      icon: <Cog6ToothIcon className="h-6 w-6" />,
      roles: ["ADMIN", "PASTOR"],
    },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } fixed md:relative h-screen bg-white/80 backdrop-blur-xl shadow-xl p-6 flex flex-col transition-all duration-300`}
    >
      {/* Logo + Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-extrabold text-yellow-500 transition-all duration-300 ${
            !isOpen && "opacity-0 w-0"
          }`}
        >
          Church App
        </h2>
        <button
          className="md:hidden p-1 rounded hover:bg-gray-200 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          // Si le menu a des sous-items (dropdown)
          if (item.children) {
            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => setSermonDropdownOpen(!sermonDropdownOpen)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all duration-300 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 hover:scale-105 ${
                    item.children.some((child) => child.path === location.pathname)
                      ? "bg-yellow-100 text-yellow-600 font-semibold shadow-lg"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {isOpen && <span className="text-sm">{item.name}</span>}
                  </div>
                  {isOpen && <ChevronDownIcon className={`h-5 w-5 transition-transform ${sermonDropdownOpen ? "rotate-180" : ""}`} />}
                </button>

                {/* Sous-menu */}
                {sermonDropdownOpen && isOpen && (
                  <div className="flex flex-col pl-10 mt-1 gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path}
                        className={`p-2 rounded-lg text-sm transition-all duration-300 ${
                          location.pathname === child.path
                            ? "bg-yellow-100 text-yellow-600 font-semibold shadow"
                            : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 hover:scale-105"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Menu normal
          return (
            <Link
              key={item.name}
              to={item.path!}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-yellow-100 text-yellow-600 font-semibold shadow-lg"
                  : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 hover:scale-105"
              }`}
            >
              {item.icon}
              {isOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md hover:scale-105 transition-all duration-300"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
        {isOpen && <span className="text-sm">Déconnexion</span>}
      </button>
    </div>
  );
};

export default Sidebar;
