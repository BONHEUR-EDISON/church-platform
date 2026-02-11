// src/pages/auth/Login.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setAuthData, getRole } from "../../hooks/useAuth";
import axios from "../../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      // Appel API login-smart
      const res = await axios.post("/auth/login-smart", { email, password });
      const { access_token, user } = res.data;

      if (!access_token || !user) {
        setError("Impossible de récupérer le token ou les informations utilisateur.");
        setLoading(false);
        return;
      }

      // Stocke token et user
      setAuthData(access_token, user);

      // Détection du rôle principal
      const role = getRole() || "MEMBER";

      // Redirection selon rôle
      switch (role.toUpperCase()) {
        case "ADMIN":
          navigate("/dashboard/admin", { replace: true });
          break;
        case "PASTOR":
          navigate("/dashboard/pastor", { replace: true });
          break;
        case "MEMBER":
        default:
          navigate("/dashboard/member", { replace: true });
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-sky-100 to-blue-200">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">Connexion</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className={`w-full p-3 rounded text-white font-semibold ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
          }`}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      <p className="mt-4 text-center text-gray-500 text-sm">
          Pas de compte ?{" "}
          <Link to="/registerall" className="text-yellow-400 hover:underline">
            Inscription
          </Link>
        </p>
      </div>
    </div>
  );
}

