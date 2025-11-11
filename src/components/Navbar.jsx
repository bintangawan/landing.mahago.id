import { useState, useEffect } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Tambahkan CSS smooth scroll global
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // ✅ Fungsi smooth scroll manual biar tidak nembak
  const handleScroll = (id) => {
    const el = document.querySelector(id);
    if (el) {
      const yOffset = -80; // jarak offset dari navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-md border-b-2 border-green-600">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-700">
            MahaGo
          </h1>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium">
          <li>
            <button
              onClick={() => handleScroll("#home")}
              className="hover:text-green-600 transition"
            >
              Beranda
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("#fitur")}
              className="hover:text-green-600 transition"
            >
              Fitur
            </button>
          </li>
          <li>
            <button
              onClick={() => handleScroll("#promo")}
              className="hover:text-green-600 transition"
            >
              Promo
            </button>
          </li>
        </ul>

        {/* Tombol WhatsApp Desktop */}
        <a
          href="https://wa.me/6285765714991?text=Bang,%20mau%20dianter%20ke%20...%20dong!"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-block bg-green-600 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
        >
          Pesan Sekarang
        </a>

        {/* Tombol Menu Mobile */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <button
            onClick={() => handleScroll("#home")}
            className="block w-full text-left px-6 py-3 hover:bg-green-50 transition"
          >
            Beranda
          </button>
          <button
            onClick={() => handleScroll("#fitur")}
            className="block w-full text-left px-6 py-3 hover:bg-green-50 transition"
          >
            Fitur
          </button>
          <button
            onClick={() => handleScroll("#promo")}
            className="block w-full text-left px-6 py-3 hover:bg-green-50 transition"
          >
            Promo
          </button>
          <a
            href="https://wa.me/6285765714991?text=Bang,%20mau%20dianter%20ke%20...%20dong!"
            target="_blank"
            rel="noreferrer"
            className="block px-6 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 transition text-center"
          >
            Pesan Sekarang
          </a>
        </div>
      )}
    </header>
  );
}
