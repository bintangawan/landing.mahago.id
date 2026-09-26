import { useState, useEffect } from "react";
import {
  WhatsappLogo,
  Calculator,
  Moped,
  Clock,
  Tag,
} from "@phosphor-icons/react";
import { getWhatsAppLink } from "../utils/adminHelper";
import {
  Sunburst,
  Squiggle,
  Sparkle,
  XMark,
  DotRings,
  Coil,
  GMark,
} from "./neo/Decor";

export default function Hero() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(getWhatsAppLink());
  }, []);

  return (
    <section
      id="home"
      className="neo-grain bg-neo-grid relative overflow-hidden bg-mg-green pt-28 sm:pt-32 pb-16 sm:pb-24 [--grid-line:rgb(235_255_222/0.12)]"
    >
      {/* Dekorasi latar */}
      <Squiggle className="absolute top-[6.5rem] left-[34%] w-32 hidden md:block" />
      <Squiggle className="absolute bottom-6 left-4 w-24 md:hidden" rows={1} />
      <XMark className="absolute top-40 right-[46%] w-7 hidden md:block" />
      <XMark className="absolute bottom-16 left-[8%] w-6" />
      <Sparkle className="absolute bottom-24 left-[42%] w-8 hidden md:block" />
      <Sparkle className="absolute top-32 right-6 w-9 lg:hidden" />
      <DotRings className="absolute -bottom-2 right-4 w-24 sm:w-28 opacity-90" />
      <Coil className="absolute top-1/3 -right-6 w-14 hidden xl:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid gap-12 lg:gap-8 lg:grid-cols-2 items-center">
        <div>
          <span className="inline-flex items-center gap-2 -rotate-2 bg-mg-cream text-mg-green-deep border-2 border-mg-ink rounded-neo shadow-neo-sm px-3 py-1.5 mb-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Moped size={18} aria-hidden="true" />
            Ojek Kampus UINSU Tuntungan
          </span>

          <h1 className="font-display font-black tracking-tight leading-[1.05] text-mg-cream text-5xl sm:text-6xl lg:text-7xl mb-6">
            <span className="block text-mg-sun [text-shadow:4px_4px_0_#0f1720]">
              MahaGo –
            </span>
            <span className="inline-block my-2 -rotate-2 bg-mg-cream text-mg-green-deep border-2 border-mg-ink rounded-neo shadow-neo px-3">
              Ojek Kampus
            </span>
            <span className="block [text-shadow:4px_4px_0_#0f1720]">
              Tercepat!
            </span>
          </h1>

          <div className="neo-card bg-white max-w-md px-5 py-4 mb-8">
            <p className="text-base sm:text-lg font-medium text-mg-ink">
              Your campus ride partner made by student, for student.
            </p>
            <p className="mt-2 inline-block rotate-1 bg-mg-teal text-mg-ink border-2 border-mg-ink rounded-neo px-2 py-0.5 text-sm font-bold">
              #SahabatMahasiswa
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="neo-btn bg-mg-sun text-mg-ink px-6 py-3.5 text-base"
            >
              <WhatsappLogo size={22} aria-hidden="true" />
              Pesan Sekarang
            </a>
            <a
              href="#tarif"
              className="neo-btn bg-mg-cream text-mg-green-deep px-6 py-3.5 text-base"
            >
              <Calculator size={22} aria-hidden="true" />
              Cek Tarif
            </a>
          </div>
        </div>

        {/* Ilustrasi dalam bingkai neobrutalism */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          <Sunburst className="absolute -top-10 -right-6 w-32 sm:w-40 animate-spin-slow" />
          <GMark className="absolute -bottom-10 -left-8 w-20 sm:w-24 z-20 -rotate-12" />

          <div className="neo-card relative bg-mg-sun bg-neo-dots rotate-2 shadow-neo-xl aspect-square overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-mg-teal border-t-2 border-mg-ink" />
            <img
              src="/images/mahago-rider.webp"
              alt="Driver MahaGo naik skuter kuning"
              width="1000"
              height="958"
              fetchPriority="high"
              className="relative w-full h-full object-contain p-6 -rotate-2 animate-float"
            />
          </div>

          <span className="absolute -top-4 -left-3 sm:-left-6 z-10 inline-flex items-center gap-1.5 -rotate-6 bg-mg-cream text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo px-3 py-2 text-sm font-bold">
            <Tag size={18} aria-hidden="true" />
            Mulai Rp 5.000
          </span>
          <span className="absolute -bottom-4 right-2 sm:-right-4 z-10 inline-flex items-center gap-1.5 rotate-3 bg-mg-indigo text-white border-2 border-mg-ink rounded-neo shadow-neo px-3 py-2 text-sm font-bold">
            <Clock size={18} aria-hidden="true" />
            Siap 24 Jam
          </span>
        </div>
      </div>
    </section>
  );
}
