import { useState } from "react";
import {
  Headset,
  WhatsappLogo,
  CaretDown,
  Clock,
  UserCircle,
} from "@phosphor-icons/react";
import {
  admins,
  getCurrentAdmin,
  buildWhatsAppLink,
  DEFAULT_ORDER_MESSAGE,
} from "../utils/adminHelper";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sunburst, Sparkle, XMark } from "./neo/Decor";

export default function ContactSection({ orderMessage }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentAdmin = getCurrentAdmin();
  const messageToSend = orderMessage || DEFAULT_ORDER_MESSAGE;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-mg-cream bg-neo-grid py-16 sm:py-24"
    >
      <Sparkle className="absolute top-16 right-[10%] w-10" />
      <XMark className="absolute bottom-20 left-[8%] w-7" color="#0f8c3c" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kontak"
          icon={Headset}
          title={
            <>
              Hubungi <Highlight tone="green">Kami</Highlight>
            </>
          }
          subtitle="Tim kami siap melayani Anda 24 jam sehari!"
        />

        <div className="relative max-w-2xl mx-auto">
          <Sunburst className="absolute -top-12 -left-10 w-28 hidden sm:block" />

          <div className="neo-card neo-grain relative bg-mg-green-deep text-mg-cream shadow-neo-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="font-display font-black text-2xl mb-2">
                Chat WhatsApp Sekarang
              </h3>
              <p className="text-sm">
                Pilih admin sesuai jadwal atau langsung chat admin yang sedang
                aktif
              </p>
            </div>

            {/* Admin yang aktif sekarang */}
            <div className="neo-card bg-mg-cream text-mg-ink p-4 mb-4">
              <p className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-mg-green-deep">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-mg-green border border-mg-ink"
                  aria-hidden="true"
                />
                Admin Aktif Sekarang
              </p>
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="font-display font-black text-lg">
                    {currentAdmin.name}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-sm">
                    <Clock size={16} aria-hidden="true" />
                    {currentAdmin.schedule}
                  </p>
                </div>
                <a
                  href={buildWhatsAppLink(currentAdmin.phone, messageToSend)}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn bg-mg-sun text-mg-ink px-5 py-2.5"
                >
                  <WhatsappLogo size={20} aria-hidden="true" />
                  Chat
                </a>
              </div>
            </div>

            {/* Daftar semua admin */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-expanded={isDropdownOpen}
              aria-controls="admin-list"
              className="neo-btn w-full justify-between bg-white text-mg-ink p-4"
            >
              <span>Lihat Semua Admin & Jadwal</span>
              <CaretDown
                size={20}
                className={`transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isDropdownOpen && (
              <ul id="admin-list" className="mt-4 space-y-3">
                {admins.map((admin) => (
                  <li key={admin.phone}>
                    <a
                      href={buildWhatsAppLink(admin.phone, messageToSend)}
                      target="_blank"
                      rel="noreferrer"
                      className="neo-card neo-lift flex justify-between items-center gap-4 bg-white text-mg-ink p-4"
                    >
                      <span className="flex items-center gap-3">
                        <UserCircle
                          size={32}
                          className="text-mg-green-deep shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="block font-bold">{admin.name}</span>
                          <span className="block text-sm">
                            {admin.schedule}
                          </span>
                          <span className="block text-xs font-bold text-mg-green-deep mt-0.5">
                            {admin.displayPhone}
                          </span>
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 shrink-0 bg-mg-green-deep text-mg-cream border-2 border-mg-ink rounded-neo px-3 py-2 text-sm font-bold">
                        <WhatsappLogo size={18} aria-hidden="true" />
                        Chat
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-center text-xs mt-6">
              Layanan kami tersedia 24 jam untuk kenyamanan Anda
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
