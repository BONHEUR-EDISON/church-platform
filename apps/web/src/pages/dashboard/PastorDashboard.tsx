// src/pages/dashboard/PastorDashboard.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

const PastorDashboard = () => {
  const { user } = useAuth("PASTOR");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <ProtectedRoute requiredRole="PASTOR">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-40 md:relative md:translate-x-0 transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex w-64`}
        >
          <Sidebar
            role={user?.roles[0] || ""}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-auto">
          <Topbar user={user} toggleSidebar={toggleSidebar} />

          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard Pastor</h1>

            {/* Zone des prédications */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Exemple de cartes prédication */}
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition cursor-pointer">
                <h2 className="font-semibold text-lg mb-2">Titre Prédication</h2>
                <p className="text-gray-500 text-sm">
                  Description courte de la prédication.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition cursor-pointer">
                <h2 className="font-semibold text-lg mb-2">Titre Prédication</h2>
                <p className="text-gray-500 text-sm">
                  Description courte de la prédication.
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition cursor-pointer">
                <h2 className="font-semibold text-lg mb-2">Titre Prédication</h2>
                <p className="text-gray-500 text-sm">
                  Description courte de la prédication.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PastorDashboard;
