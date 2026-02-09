const features = [
  { icon: "👥", title: "Gestion des membres", text: "Suivi des fidèles et responsables." },
  { icon: "📊", title: "Finances", text: "Gestion des dîmes et rapports clairs." },
  { icon: "📣", title: "Communication", text: "Annonces et événements." },
];

export default function Features() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-blue-900">
          Fonctionnalités clés
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-sky-50 p-8 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-blue-800">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
