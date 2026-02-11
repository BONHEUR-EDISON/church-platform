// src/pages/auth/RegisterM.tsx
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";

export default function RegisterAll() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const churchId = searchParams.get("churchId");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [_error, setError] = useState("");
const [_loading, setLoading] = useState(false);


  useEffect(() => {
    if (!churchId) {
      alert("Aucune église associée. Veuillez créer une église d'abord.");
      navigate("/create-church");
    }
  }, [churchId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword || !form.name) {
      return setError("Veuillez remplir tous les champs.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    if (!churchId) {
      return setError("Aucun identifiant d'église fourni.");
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: form.name,
        churchId,
      });

      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Croix / symbole */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            ✝️
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Créer un compte
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Rejoignez votre communauté dans la foi
        </p>

        <form onSubmit={submit} className="space-y-4">

          <input
            name="churchName"
            placeholder="Nom de l’église"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <input
            name="name"
            placeholder="Nom complet"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition font-medium"
          >
            S’inscrire
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-700 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
