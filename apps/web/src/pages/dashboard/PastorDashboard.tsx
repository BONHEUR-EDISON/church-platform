// PastorDashboard.tsx
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

const PastorDashboard = () => {
  const { user } = useAuth("PASTOR");

  return (
    <ProtectedRoute requiredRole="PASTOR">
      <div className="flex">
        <Sidebar role={user?.roles[0] || ""} />
        <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
          <Topbar />
          <h1 className="text-3xl font-bold mt-4">Dashboard Pastor</h1>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default PastorDashboard;
