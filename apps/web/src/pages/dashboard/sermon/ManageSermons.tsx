// src/pages/dashboard/ManageSermons.tsx
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../hooks/useAuth";
import Sidebar from "../../../components/dashboard/Sidebar";
import Topbar from "../../../components/dashboard/Topbar";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Sermon {
  id: string;
  title: string;
  url: string;
  type: "AUDIO" | "VIDEO";
  description?: string;
}

export default function ManageSermons() {
  const { token, user } = useAuth();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filter, setFilter] = useState<"ALL" | "VIDEO" | "AUDIO">("ALL");
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"AUDIO" | "VIDEO">("VIDEO");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const sermonId = searchParams.get("id");
  const navigate = useNavigate();

  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);

  const BACKEND_URL = "http://localhost:3000";

  const isYouTube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = (url: string) => url.includes("vimeo.com");
  const getEmbedUrl = (url: string) => {
    if (isYouTube(url)) {
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    }
    if (isVimeo(url)) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : url;
    }
    return url.startsWith("/uploads") ? `${BACKEND_URL}${url}` : url;
  };

  // Fetch sermons
  useEffect(() => {
    if (!token || !user) return;
    const fetchSermons = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/sermons", {
          params: { churchId: user.churchId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setSermons(res.data);
        if (res.data.length > 0) setCurrentSermon(res.data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [token, user]);

  // Fetch sermon pour édition
  useEffect(() => {
    if (!sermonId || !token) return;
    const fetchSermon = async () => {
      try {
        const res = await axios.get(`/sermons/${sermonId}`, { headers: { Authorization: `Bearer ${token}` } });
        setTitle(res.data.title);
        setUrl(res.data.url);
        setType(res.data.type);
        setDescription(res.data.description || "");
        setPreview(res.data.url);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSermon();
  }, [sermonId, token]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUrl("");
    setPreview(URL.createObjectURL(selected));
    setType(selected.type.startsWith("audio") ? "AUDIO" : "VIDEO");
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    setFile(null);
    setPreview(val);
    if (val.includes("youtube.com") || val.includes("youtu.be") || val.includes("vimeo.com")) setType("VIDEO");
    else if (val.endsWith(".mp3") || val.endsWith(".wav")) setType("AUDIO");
    else setType("VIDEO");
  };

  const submit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("description", description);
      if (file) formData.append("file", file);
      else if (url) formData.append("url", url);

      const headers = { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` };
      if (sermonId) await axios.patch(`/sermons/${sermonId}`, formData, { headers });
      else await axios.post("/sermons", formData, { headers });
      navigate("/dashboard/sermons");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette prédication ?")) return;
    try {
      await axios.delete(`/sermons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSermons(prev => prev.filter(s => s.id !== id));
      if (currentSermon?.id === id) setCurrentSermon(null);
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la prédication.");
    }
  };

  const filteredSermons = filter === "ALL" ? sermons : sermons.filter(s => s.type === filter);

  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user?.roles[0] || ""} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar />

        <main className="p-6 max-w-7xl mx-auto flex-1">

          <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Gérer les Prédications</h1>

          {/* Formulaire */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-6 flex flex-col gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" className="input border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400" />
            <input type="file" accept="video/*,audio/*" onChange={handleFileChange} className="input" />
            <input value={url} onChange={handleUrlChange} placeholder="Ou collez un lien YouTube/Vimeo" className="input border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400" />
            <select value={type} onChange={e => setType(e.target.value as "AUDIO" | "VIDEO")} className="input border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400">
              <option value="VIDEO">VIDEO</option>
              <option value="AUDIO">AUDIO</option>
            </select>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="input border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400" />
            
            {preview && type === "VIDEO" ? (
              <iframe className="w-full aspect-video rounded-lg shadow-md" src={getEmbedUrl(preview)} title="Aperçu vidéo" allowFullScreen />
            ) : preview && type === "AUDIO" ? (
              <audio controls className="w-full rounded-lg">
                <source src={preview} type="audio/mpeg" />
              </audio>
            ) : null}

            <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
              {sermonId ? "Modifier" : "Ajouter"}
            </button>
          </div>

          {/* Filtre */}
          <div className="flex gap-4 mb-6">
            {(["ALL", "VIDEO", "AUDIO"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full font-semibold ${filter===f?"bg-blue-600 text-white":"bg-gray-200 text-gray-700 hover:bg-gray-300 transition"}`}>
                {f==="ALL"?"Tout":f}
              </button>
            ))}
          </div>

          {/* Player principal */}
          {currentSermon && (
            <div className="mb-6 bg-gray-900 text-white rounded-xl shadow-lg p-4 transition-all duration-500 hover:shadow-2xl">
              <h2 className="text-2xl font-semibold mb-2">{currentSermon.title}</h2>
              {currentSermon.description && <p className="text-gray-300 mb-4">{currentSermon.description}</p>}
              {currentSermon.type === "VIDEO" ? (
                <iframe className="w-full aspect-video rounded-lg shadow-md" src={getEmbedUrl(currentSermon.url)} title={currentSermon.title} allowFullScreen />
              ) : (
                <audio controls className="w-full rounded-lg">
                  <source src={currentSermon.url} type="audio/mpeg" />
                </audio>
              )}
            </div>
          )}

          {/* Grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map(s => (
              <div key={s.id} className="bg-white rounded-xl shadow-md overflow-hidden group relative hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
                   onClick={() => setCurrentSermon(s)}>
                {s.type === "VIDEO" ? (
                  <iframe className="w-full aspect-video rounded-t-xl" src={getEmbedUrl(s.url)} title={s.title} allowFullScreen />
                ) : (
                  <audio controls className="w-full p-2" onPlay={e => e.currentTarget.pause()}>
                    <source src={s.url} type="audio/mpeg" />
                  </audio>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  {s.description && <p className="text-gray-500 text-sm truncate">{s.description}</p>}
                </div>

                {/* Admin/Pastor buttons */}
                {(user?.roles.includes("ADMIN") || user?.roles.includes("PASTOR")) && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 text-white" onClick={e => { e.stopPropagation(); navigate(`/dashboard/manage-sermons?id=${s.id}`) }}>
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button className="bg-red-500 p-2 rounded-full hover:bg-red-600 text-white" onClick={e => { e.stopPropagation(); handleDelete(s.id) }}>
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}