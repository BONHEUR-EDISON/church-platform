// src/pages/dashboard/MemberDashboard.tsx

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import StatsCard from "../../components/dashboard/StatsCard";
import axios from "../../api/axios";
import { FaUsers, FaUserShield, FaUserTie } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  users?: number;
  members: number;
  roles?: number;
  usersByRole?: { role: string; count: number }[];
  activity: { name: string; value: number }[];
}

const MemberDashboard = () => {
  const { user } = useAuth();
  const role = user?.roles[0] || "MEMBER";

  const [stats, setStats] = useState<Stats>({ members: 0, activity: [] });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.stats) {
          setStats({
            ...data.stats,
            roles: data.stats.usersByRole?.length || 0,
            usersByRole: data.stats.usersByRole,
          });
        }
      } catch (err) {
        console.error("Erreur lors du fetch des stats:", err);
      }
    };

    fetchStats();
  }, []);

  const totalUsers = stats.usersByRole?.reduce((acc, r) => acc + r.count, 0) || stats.users || 0;

  return (
    <ProtectedRoute requiredRole={["MEMBER", "PASTOR"]}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={role} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col transition-all duration-300">
          <Topbar />
          <main className="flex-1 p-6 bg-gray-50 flex flex-col items-center justify-start overflow-auto">
            <div className="w-full max-w-7xl">
              <h1 className="text-3xl font-bold mb-6 mt-4">
                Dashboard {role === "PASTOR" ? "Pastor" : "Member"}
              </h1>

              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {role !== "MEMBER" && stats.users !== undefined && (
                  <StatsCard title="Utilisateurs" value={totalUsers} icon={<FaUsers />} />
                )}
                <StatsCard title="Membres" value={stats.members} icon={<FaUserShield />} />
                {stats.roles !== undefined && role !== "MEMBER" && (
                  <StatsCard title="Rôles" value={stats.roles} icon={<FaUserTie />} />
                )}
              </div>

              {/* Activity chart */}
              {stats.activity.length > 0 && (
                <div className="bg-white/80 p-6 rounded-xl shadow-md w-full">
                  <h2 className="text-xl font-bold mb-4">Activité des membres</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.activity}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MemberDashboard;