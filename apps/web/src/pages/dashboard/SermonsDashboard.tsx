// src/pages/dashboard/SermonsDashboard.tsx
import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { PencilIcon, TrashIcon, Bars3Icon } from "@heroicons/react/24/solid";

interface Sermon {
  id: string;
  title: string;
  url: string;
  type: "AUDIO" | "VIDEO";
  description?: string;
}

export default function SermonsDashboard() {
  const { token, user } = useAuth();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [filter, setFilter] = useState<"ALL" | "VIDEO" | "AUDIO">("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const youtubeRef = useRef<HTMLIFrameElement>(null);
  const vimeoRef = useRef<HTMLIFrameElement>(null);

  const BACKEND_URL = "http://localhost:3000";

  const isYouTube = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = (url: string) => url.includes("vimeo.com");

  const getYouTubeId = (url: string) => {
    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getYouTubeEmbed = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?enablejsapi=1` : url;
  };

  const getVimeoEmbed = (url: string) => {
    const regExp = /vimeo\.com\/(\d+)/;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=0&muted=0&api=1&background=0` : url;
  };

  const getMediaUrl = (url: string) => {
    if (!url) return "";
    if (isYouTube(url) || isVimeo(url)) return url;
    return url.startsWith("/uploads") ? `${BACKEND_URL}${url}` : url;
  };

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchSermons = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/sermons", {
          params: { churchId: user.churchId },
        });
        setSermons(res.data);
        if (res.data.length > 0) setCurrentSermon(res.data[0]);
        setError(null);
      } catch (err: any) {
        console.error("Erreur fetch sermons:", err);
        if (err.response)
          setError(err.response.data?.message || "Erreur serveur");
        else if (err.request)
          setError("Aucune réponse du serveur. Vérifiez votre connexion.");
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, [token, user]);

  const handleEdit = (id: string) => console.log("Modifier sermon", id);
  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette prédication ?")) return;
    try {
      await axios.delete(`/sermons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSermons((prev) => prev.filter((s) => s.id !== id));
      if (currentSermon?.id === id) setCurrentSermon(null);
    } catch (err: any) {
      console.error("Erreur suppression:", err);
      alert("Impossible de supprimer la prédication.");
    }
  };

  const filteredSermons =
    filter === "ALL" ? sermons : sermons.filter((s) => s.type === filter);

  // Lecture/Pause pour YouTube
  const toggleYouTube = () => {
    if (!youtubeRef.current) return;
    youtubeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "playVideo" }),
      "*"
    );
  };

  // Lecture/Pause pour Vimeo
  const toggleVimeo = () => {
    if (!vimeoRef.current) return;
    vimeoRef.current.contentWindow?.postMessage(
      JSON.stringify({ method: "play" }),
      "*"
    );
  };

  const togglePlayPause = () => {
    if (!currentSermon) return;
    if (isYouTube(currentSermon.url)) toggleYouTube();
    else if (isVimeo(currentSermon.url)) toggleVimeo();
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Chargement des prédications...
      </p>
    );

  if (error)
    return <p className="text-center mt-10 text-red-500">Erreur: {error}</p>;

  if (sermons.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        Aucune prédication disponible.
      </p>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-0 z-40 md:relative md:translate-x-0 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex`}
      >
        <Sidebar role={user?.roles[0] || ""} />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar user={user}>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </Topbar>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Filtre */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-2">
            <h1 className="text-3xl font-bold">Prédications</h1>
            <div className="flex gap-2">
              {(["ALL", "VIDEO", "AUDIO"] as const).map((f) => (
                <button
                  key={f}
                  className={`px-3 py-1 rounded ${
                    filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setFilter(f)}
                >
                  {f === "ALL" ? "Tout" : f === "VIDEO" ? "Vidéo" : "Audio"}
                </button>
              ))}
            </div>
          </div>

          {/* Grille 3 colonnes desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSermons.map((s) => (
              <div
                key={s.id}
                className={`bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden relative cursor-pointer group ${
                  currentSermon?.id === s.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setCurrentSermon(s)}
              >
                {s.type === "VIDEO" ? (
                  <div className="aspect-w-16 aspect-h-9">
                    {isYouTube(s.url) ? (
                      <iframe
                        ref={currentSermon?.id === s.id ? youtubeRef : null}
                        className="w-full h-full"
                        src={getYouTubeEmbed(s.url)}
                        title={s.title}
                        allowFullScreen
                      />
                    ) : isVimeo(s.url) ? (
                      <iframe
                        ref={currentSermon?.id === s.id ? vimeoRef : null}
                        className="w-full h-full"
                        src={getVimeoEmbed(s.url)}
                        title={s.title}
                        allowFullScreen
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-full"
                        src={getMediaUrl(s.url)}
                      />
                    )}
                  </div>
                ) : (
                  <audio
                    controls
                    className="w-full mt-2 rounded-lg"
                    src={getMediaUrl(s.url)}
                  />
                )}

                <div className="p-3">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  {s.description && (
                    <p className="text-gray-300 text-sm">{s.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mini sticky player mobile */}
          {currentSermon && (
            <div className="fixed bottom-4 right-4 w-44 bg-gray-900 text-white rounded-lg shadow-lg p-2 z-50 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold truncate">{currentSermon.title}</h4>
                <button
                  onClick={() => setCurrentSermon(null)}
                  className="text-white hover:text-red-400"
                >
                  ✕
                </button>
              </div>

              {currentSermon.type === "VIDEO" ? (
                isYouTube(currentSermon.url) ? (
                  <iframe
                    ref={youtubeRef}
                    className="w-full h-20 mt-1 rounded"
                    src={getYouTubeEmbed(currentSermon.url)}
                    title={currentSermon.title}
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    ref={vimeoRef}
                    className="w-full h-20 mt-1 rounded"
                    src={getVimeoEmbed(currentSermon.url)}
                    title={currentSermon.title}
                    allowFullScreen
                  />
                )
              ) : (
                <audio
                  controls
                  className="w-full mt-1 rounded-lg"
                  src={getMediaUrl(currentSermon.url)}
                />
              )}

              <button
                onClick={togglePlayPause}
                className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
              >
                Play/Pause
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
