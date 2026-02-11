import type { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-blue-800">
          ✝ Church<span className="text-sky-500">Platform</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="text-blue-700 hover:text-blue-900 transition"
          >
            Connexion
          </Link>

          <Link
            to="/create-church"
            className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition"
          >
            Créer une Église
          </Link>
        </div>
      </nav>
    </header>
  );
}