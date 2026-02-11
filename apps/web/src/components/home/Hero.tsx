import type { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 leading-tight">
          Une gestion moderne <br />
          <span className="text-sky-500">au service de l’Église</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Une plateforme complète pour gérer membres, finances et communication,
          inspirée par la foi chrétienne.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/create-church"
            className="bg-blue-700 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-800 transition"
          >
            Créer mon Église
          </Link>

          <Link
            to="/login"
            className="border border-blue-700 text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-50 transition"
          >
            Se connecter
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-40"></div>

        <div className="relative bg-white rounded-3xl shadow-xl p-10 text-center">
          <p className="text-6xl">🙏</p>
          <p className="mt-4 font-semibold text-blue-800 text-lg">
            « Là où deux ou trois sont assemblés en mon nom… »
          </p>
          <p className="text-gray-500 text-sm mt-1">Matthieu 18:20</p>
        </div>
      </div>
    </section>
  );
}