import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-700 to-sky-600 text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold">
          Prêt à organiser votre église ?
        </h2>

        <p className="mt-4 text-blue-100">
          Commencez aujourd’hui et donnez à votre communauté des outils modernes.
        </p>

        <Link
          to="/create-church"
          className="inline-block mt-8 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          Créer mon Église
        </Link>
      </div>
    </section>
  );
}
