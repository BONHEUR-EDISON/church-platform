// src/pages/dashboard/AdminDashboard.tsx

import { useState } from "react";
import { useEffect } from "react";
import axios from "../../../api/axios";

interface UserRoleStat {
  role: string;
  _count: number;
}

interface DashboardData {
  church: {
    name: string;
    pastor: string;
    createdAt: string;
  };
  stats: {
    members: number;
    usersByRole: UserRoleStat[];
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Vous devez être connecté");

        const res = await axios.get("/dashboard/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err: any) {
        console.error("Erreur fetch dashboard:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger les données",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Chargement...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!data)
    return <div className="p-6 text-center text-gray-500">Aucune donnée</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-navy mb-6">
        Tableau de bord – {data.church.name}
      </h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Membres" value={data.stats.members} />
        <StatCard title="Pasteur" value={data.church.pastor} />
        <StatCard
          title="Créée le"
          value={new Date(data.church.createdAt).toLocaleDateString()}
        />
      </div>

      {/* Utilisateurs par rôle */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Utilisateurs par rôle</h2>
        {data.stats.usersByRole.length === 0 ? (
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        ) : (
          <ul className="space-y-2">
            {data.stats.usersByRole.map((r) => (
              <li key={r.role} className="flex justify-between">
                <span>{r.role}</span>
                <span className="font-bold">{r._count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-navy mt-2">{value}</p>
    </div>
  );
}