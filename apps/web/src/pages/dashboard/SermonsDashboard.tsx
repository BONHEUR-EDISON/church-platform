// src/pages/dashboard/SermonsDashboard.tsx

import { useState } from "react";
import { useEffect, useRef } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { PencilIcon, TrashIcon, Bars3Icon, ArrowLeftIcon } from "@heroicons/react/24/solid";

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
  const [layout, setLayout] = useState<"grid" | "focus">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const BACKEND_URL = "http://localhost:3000";
  const mediaRefs = useRef<{ [key: string]: HTMLIFrameElement | HTMLVideoElement | HTMLAudioElement | null }>({});

  // Helpers pour YouTube/Vimeo
  const isYouTube = (url: string) => url.includes("youtube.com") || url.includes("youtu.be");
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

  // Fetch sermons
  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }
    const fetchSermons = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/sermons", { params: { churchId: user.churchId } });
        setSermons(res.data);
        setCurrentSermon(null);
        setLayout("grid");
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, [token, user]);

  // Fonction pour arrêter complètement une vidéo/audio/iframe
  const stopMedia = (el: HTMLIFrameElement | HTMLVideoElement | HTMLAudioElement | null) => {
    if (!el) return;
    if (el instanceof HTMLVideoElement || el instanceof HTMLAudioElement) el.pause();
    else if (el instanceof HTMLIFrameElement) {
      el.src = el.src; // reset iframe pour stopper YouTube/Vimeo
    }
  };

  // Pause tous les médias lorsqu'on quitte le gros plan
  useEffect(() => {
    if (!currentSermon) {
      sermons.forEach(s => stopMedia(mediaRefs.current[s.id]));
    }
  }, [currentSermon, sermons]);

  // Vérifie si l'utilisateur peut éditer/supprimer
  const canManage = () => user?.roles.includes("ADMIN") || user?.roles.includes("PASTOR");

  // Sélection d’une vidéo pour gros plan
  const handleSelect = (sermon: Sermon) => {
    sermons.forEach(s => {
      if (s.id !== sermon.id) stopMedia(mediaRefs.current[s.id]);
    });
    setCurrentSermon(sermon);
    setLayout("focus");
  };

  // Retour à la grille initiale
  const handleBack = () => {
    if (currentSermon) stopMedia(mediaRefs.current[currentSermon.id]);
    setCurrentSermon(null);
    setLayout("grid");
  };

  // Edit/Delete
  const handleEdit = (id: string) => console.log("Modifier sermon", id);
  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette prédication ?")) return;
    try {
      await axios.delete(`/sermons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSermons(prev => prev.filter(s => s.id !== id));
      if (currentSermon?.id === id) handleBack();
    } catch (err: any) {
      console.error(err);
      alert("Impossible de supprimer la prédication.");
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (sermons.length === 0) return <p className="text-center mt-10">Aucune prédication disponible.</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:relative md:translate-x-0 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:flex w-64`}
      >
        <Sidebar role={user?.roles[0] || ""} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar user={user}>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </Topbar>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Layout initial en grille */}
          {layout === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500">
              {sermons.map(s => (
                <div
                  key={s.id}
                  className="bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => handleSelect(s)}
                >
                  {s.type === "VIDEO" ? (
                    <div className="aspect-w-16 aspect-h-9">
                      {isYouTube(s.url) ? (
                        <iframe
                          ref={el => (mediaRefs.current[s.id] = el)}
                          className="w-full h-full rounded"
                          src={getYouTubeEmbed(s.url)}
                          allowFullScreen
                        />
                      ) : isVimeo(s.url) ? (
                        <iframe
                          ref={el => (mediaRefs.current[s.id] = el)}
                          className="w-full h-full rounded"
                          src={getVimeoEmbed(s.url)}
                          allowFullScreen
                        />
                      ) : (
                        <video
                          ref={el => (mediaRefs.current[s.id] = el)}
                          className="w-full h-full rounded"
                          controls
                          src={getMediaUrl(s.url)}
                        />
                      )}
                    </div>
                  ) : (
                    <audio
                      ref={el => (mediaRefs.current[s.id] = el)}
                      controls
                      className="w-full mt-2"
                      src={getMediaUrl(s.url)}
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-lg truncate">{s.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layout focus */}
          {layout === "focus" && currentSermon && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 transition-all duration-700">
              {/* Gros plan */}
              <div className="flex-1 bg-white rounded-xl shadow-lg p-4 transform scale-100 transition-all duration-700">
                <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
                  <h2 className="text-xl font-bold">{currentSermon.title}</h2>
                  <button
                    onClick={handleBack}
                    className="bg-gray-200 hover:bg-gray-300 p-1 rounded flex items-center gap-1"
                  >
                    <ArrowLeftIcon className="w-5 h-5" /> Retour
                  </button>
                </div>

                {canManage() && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    <button
                      onClick={() => handleEdit(currentSermon.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <PencilIcon className="w-4 h-4" /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(currentSermon.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                )}

                {currentSermon.type === "VIDEO" ? (
                  isYouTube(currentSermon.url) ? (
                    <iframe
                      ref={el => (mediaRefs.current[currentSermon.id] = el)}
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded transition-all duration-700"
                      src={getYouTubeEmbed(currentSermon.url)}
                      allowFullScreen
                    />
                  ) : isVimeo(currentSermon.url) ? (
                    <iframe
                      ref={el => (mediaRefs.current[currentSermon.id] = el)}
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded transition-all duration-700"
                      src={getVimeoEmbed(currentSermon.url)}
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={el => (mediaRefs.current[currentSermon.id] = el)}
                      className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded transition-all duration-700"
                      controls
                      autoPlay
                      src={getMediaUrl(currentSermon.url)}
                    />
                  )
                ) : (
                  <audio
                    ref={el => (mediaRefs.current[currentSermon.id] = el)}
                    controls
                    autoPlay
                    className="w-full mt-4"
                    src={getMediaUrl(currentSermon.url)}
                  />
                )}
                {currentSermon.description && <p className="mt-3 text-gray-600">{currentSermon.description}</p>}
              </div>

              {/* Mini-cards avec glissement fluide */}
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[90vh] md:w-64">
                {sermons
                  .filter(s => currentSermon?.id !== s.id)
                  .map(s => (
                    <div
                      key={s.id}
                      className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer p-2 flex flex-col items-center flex-shrink-0 md:flex-shrink-auto transform hover:scale-105 transition-all duration-700 ease-in-out w-48 md:w-full"
                      onClick={() => handleSelect(s)}
                    >
                      {s.type === "VIDEO" ? (
                        <video
                          ref={el => (mediaRefs.current[s.id] = el)}
                          className="w-full h-24 object-cover rounded"
                          src={getMediaUrl(s.url)}
                          muted
                        />
                      ) : (
                        <audio ref={el => (mediaRefs.current[s.id] = el)} className="w-full" src={getMediaUrl(s.url)} />
                      )}
                      <p className="mt-2 text-sm font-medium text-center truncate">{s.title}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}