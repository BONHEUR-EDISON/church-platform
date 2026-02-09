// MemberDashboard.tsx
/*import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar role={user?.roles[0] || ""} />
        <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
          <Topbar />
          <h1 className="text-3xl font-bold mt-4">Dashboard Member</h1>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MemberDashboard;*/

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatsCard from "../../components/dashboard/StatsCard";
import axios from "../../api/axios";
import { FaUsers, FaUserShield } from "react-icons/fa";

interface Stats {
  members: number;
  users?: number;
  activity: { name: string; value: number }[];
}

const MemberDashboard = () => {
  const { user } = useAuth(); // Peut être "MEMBER" ou "PASTOR"
  const [stats, setStats] = useState<Stats>({
    members: 0,
    activity: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data;
        // On récupère les stats selon le backend
        if (data.stats) {
          setStats({
            members: data.stats.members,
            users: data.stats.users, // pour les rôles Pastor/Member
            activity: data.stats.activity,
          });
        }
      } catch (err) {
        console.error("Erreur lors du fetch des stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute requiredRole={["PASTOR", "MEMBER"]}>
      <div className="flex">
        <Sidebar role={user?.roles[0] || ""} />
        <main className="flex-1 ml-0 md:ml-64 p-6 bg-gray-50 min-h-screen">
          <Topbar />
          <h1 className="text-3xl font-bold mt-4">
            Dashboard {user?.roles[0] === "PASTOR" ? "Pastor" : "Member"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {stats.users !== undefined && (
              <StatsCard title="Utilisateurs" value={stats.users} icon={<FaUsers />} />
            )}
            <StatsCard title="Membres" value={stats.members} icon={<FaUserShield />} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MemberDashboard;

