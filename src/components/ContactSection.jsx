import { useState } from "react";
import { admins, getCurrentAdmin } from "../utils/adminHelper";

export default function ContactSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentAdmin = getCurrentAdmin();

  return (
    <section id="contact" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            💬 Hubungi <span className="text-green-600">Kami</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Tim kami siap melayani Anda 24 jam sehari!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-2xl">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold mb-2">
                Chat WhatsApp Sekarang 🚀
              </h4>
              <p className="text-sm opacity-90">
                Pilih admin sesuai jadwal atau langsung chat admin yang sedang
                aktif
              </p>
            </div>

            {/* Current Active Admin */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
              <p className="text-xs uppercase tracking-wide mb-2 opacity-75">
                Admin Aktif Sekarang
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{currentAdmin.name}</p>
                  <p className="text-sm opacity-90">{currentAdmin.schedule}</p>
                </div>
                <a
                  href={`https://wa.me/${currentAdmin.phone}?text=Bang,%20mau%20dianter%20ke%20...%20dong!`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-green-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
                >
                  Chat
                </a>
              </div>
            </div>

            {/* Dropdown for All Admins */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition rounded-lg p-4 flex justify-between items-center"
              >
                <span className="font-semibold">
                  Lihat Semua Admin & Jadwal
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-10">
                  {admins.map((admin, index) => (
                    <a
                      key={index}
                      href={`https://wa.me/${admin.phone}?text=Bang,%20mau%20dianter%20ke%20...%20dong!`}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4 hover:bg-green-50 transition border-b last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">
                            {admin.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {admin.schedule}
                          </p>
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            {admin.displayPhone}
                          </p>
                        </div>
                        <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                          Chat
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-xs mt-6 opacity-75">
              Layanan kami tersedia 24 jam untuk kenyamanan Anda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
