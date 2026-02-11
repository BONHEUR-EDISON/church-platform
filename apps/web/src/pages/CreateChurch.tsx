
import { useState } from "react";;
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function CreateChurch() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    pastorName: "",
    agreementNo: "",
    foundedAt: "",
    country: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    // Validation simple
    if (!form.name || !form.pastorName || !form.agreementNo) {
      return alert("Veuillez remplir tous les champs obligatoires");
    }

    try {
      setLoading(true);
      const res = await axios.post("/church", form);

      // 🔹 Redirection vers création admin avec ID de l'église
      navigate(`/register?churchId=${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l’église");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
          Création d’une Église
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="name"
            placeholder="Nom de l’église"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />

          <input
            name="pastorName"
            placeholder="Pasteur responsable"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />

          <input
            name="agreementNo"
            placeholder="Numéro d’agrément"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />

          <input
            type="date"
            name="foundedAt"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />

          <input
            name="country"
            placeholder="Pays"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="Ville"
            className="input shadow-sm border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            onChange={handleChange}
          />
        </div>

        <input
          name="address"
          placeholder="Adresse complète"
          className="input mt-4 shadow-sm border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
          onChange={handleChange}
        />

        <button
          onClick={submit}
          disabled={loading}
          className={`mt-8 w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition flex justify-center items-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Création en cours..."
            : "Continuer → Créer l’administrateur"}
        </button>
      </div>
    </div>
  );
}
