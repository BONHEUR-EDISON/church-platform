export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ChurchPlatform — Tous droits réservés
      </div>
    </footer>
  );
}
