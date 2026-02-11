
import { useState } from "react";;
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function AddRole() {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!roleName) {
      setError("Le nom du rôle est obligatoire");
      return;
    }

    try {
      const res = await axios.post("/roles", { name: roleName, description });
      alert(`Rôle "${res.data.name}" ajouté avec succès !`);
      // Redirection vers la liste des rôles ou dashboard
      navigate("/roles");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de la création du rôle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Ajouter un rôle</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom du rôle"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            placeholder="Description (optionnelle)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={submit}
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition"
        >
          Ajouter le rôle
        </button>
      </div>
    </div>
  );
}
