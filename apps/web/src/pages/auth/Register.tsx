//
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const churchId = searchParams.get("churchId");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!churchId) {
      alert("Aucune église associée. Veuillez créer une église d'abord.");
      navigate("/create-church");
    }
  }, [churchId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      return setError("Veuillez remplir tous les champs.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/register", {
        email: form.email,
        password: form.password,
        churchId,
      });

      // Extraction du token et des rôles depuis la réponse
      const { access_token, user } = res.data;

      if (access_token && user) {
        // Stockage sécurisé
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        // Récupération du rôle principal (premier rôle)
        const role = user.roles?.[0] || "";

        localStorage.setItem("role", role);

        // Redirection selon le rôle
        switch (role.toUpperCase()) {
          case "ADMIN":
            navigate("/dashboard/admin");
            break;
          case "PASTOR":
            navigate("/dashboard/pastor");
            break;
          case "MEMBER":
            navigate("/dashboard/member");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        setError(
          "Inscription réussie mais impossible de récupérer le token ou le rôle."
        );
      }
    } catch (err: any) {
      console.error("Register error:", err?.response?.data);
      setError(err?.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-yellow-50 via-sky-100 to-blue-200 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/vitrail.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent pointer-events-none"></div>

      <div className="relative z-10 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transition-transform transform hover:scale-105 duration-300">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-navy mb-2">Inscription</h1>
          <p className="text-gray-600">
            Créez votre compte pour rejoindre votre communauté
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          className={`w-full bg-yellow-400 text-white p-3 rounded-lg font-semibold hover:bg-yellow-500 hover:shadow-lg transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>

        <p className="mt-4 text-center text-gray-500 text-sm">
          Vous avez déjà un compte ?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Connexion
          </span>
        </p>

        <div className="mt-6 text-center text-yellow-400 text-3xl animate-pulse">
          ✝
        </div>
      </div>
    </div>
  );
}
