
import type { useState } from "react";
import { useEffect } from "react";
import api from "../api/axios";

export const useSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSermons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/sermons"); // le token sera envoyé automatiquement
      setSermons(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.error("Erreur fetch sermons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  return { sermons, loading, error, refetch: fetchSermons };
};