import { useState, useEffect } from "react";
import { List, X, WhatsappLogo } from "@phosphor-icons/react";
import { getWhatsAppLink } from "../utils/adminHelper";

const NAV_LINKS = [
  { href: "#home", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#promo", label: "Promo" },
  { href: "#tarif", label: "Tarif" },
  { href: "#howtoorder", label: "Cara Pesan" },
  { href: "#contact", label: "Hubungi Kami" },
  { href: "#report", label: "Aduan", danger: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    // Set WhatsApp link berdasarkan admin yang aktif
    setWhatsappLink(getWhatsAppLink());
  }, []);

  // Offset navbar diatur lewat scroll-padding-top di index.css
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-mg-cream border-b-2 border-mg-ink">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <a href="#home" className="flex items-center" onClick={closeMenu}>
          <img
            src="/images/MahaGo Logo.svg"
            alt="MahaGo"
            width="1000"
            height="430"
            className="h-10 sm:h-12 w-auto"
          />
        </a>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex items-center gap-1 text-sm font-semibold">
          {NAV_LINKS.map(({ href, label, danger }) => (
            <li key={href}>
              <a
                href={href}
                className={`block px-3 py-2 rounded-neo border-2 border-transparent transition hover:border-mg-ink hover:shadow-neo-sm ${
                  danger
                    ? "text-mg-red hover:bg-mg-red hover:text-white"
                    : "hover:bg-mg-sun"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="neo-btn hidden sm:inline-flex bg-mg-sun text-mg-ink px-4 lg:px-5 py-2 text-sm"
          >
            <WhatsappLogo size={18} aria-hidden="true" />
            Pesan Sekarang
          </a>

          <button
            type="button"
            className="neo-btn lg:hidden bg-white w-11 h-11"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <List size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t-2 border-mg-ink bg-mg-cream bg-neo-grid px-4 sm:px-6 pb-5"
        >
          <ul className="grid grid-cols-2 gap-3 pt-4">
            {NAV_LINKS.map(({ href, label, danger }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={closeMenu}
                  className={`neo-btn w-full justify-start px-4 py-3 text-sm ${
                    danger ? "bg-mg-red text-white" : "bg-white text-mg-ink"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
            className="neo-btn w-full mt-4 bg-mg-sun text-mg-ink px-4 py-3"
          >
            <WhatsappLogo size={20} aria-hidden="true" />
            Pesan Sekarang
          </a>
        </div>
      )}
    </header>
  );
}
