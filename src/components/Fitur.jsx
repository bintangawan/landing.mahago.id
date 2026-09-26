import {
  ChatsCircle,
  Wallet,
  ShieldCheck,
  MapTrifold,
  Clock,
  Student,
} from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sparkle, XMark, Sunburst } from "./neo/Decor";

// Warna tile ikon bergantian mengikuti palette Figma
const fiturList = [
  {
    icon: ChatsCircle,
    title: "Pesan Mudah & Cepat",
    desc: "Langsung order via WhatsApp, tanpa ribet!",
    tile: "bg-mg-green text-mg-cream",
  },
  {
    icon: Wallet,
    title: "Harga Terjangkau",
    desc: "Mulai dari Rp 5.000 area kampus, hemat banget!",
    tile: "bg-mg-sun text-mg-ink",
  },
  {
    icon: ShieldCheck,
    title: "Driver Terpercaya",
    desc: "Semua driver adalah mahasiswa kampusmu sendiri!",
    tile: "bg-mg-indigo text-white",
  },
  {
    icon: MapTrifold,
    title: "Jangkauan Luas",
    desc: "Dari gedung kuliah sampai kosan, kami siap antar!",
    tile: "bg-mg-teal text-mg-ink",
  },
  {
    icon: Clock,
    title: "Operasional 24 Jam",
    desc: "Layanan kami tersedia kapan saja, siang atau malam!",
    tile: "bg-mg-red text-white",
  },
];

export default function Fitur() {
  return (
    <section
      id="fitur"
      className="relative overflow-hidden bg-mg-cream bg-neo-grid py-16 sm:py-24"
    >
      <Sparkle className="absolute top-12 left-[8%] w-10" />
      <XMark className="absolute bottom-16 right-[6%] w-7" color="#0f8c3c" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Keunggulan"
          icon={Student}
          title={
            <>
              Kenapa Harus <Highlight tone="green">MahaGo</Highlight>?
            </>
          }
          subtitle="Dibuat oleh mahasiswa, untuk mahasiswa. Ini alasan teman-teman kampus pilih MahaGo."
        />

        <div className="grid gap-12 lg:grid-cols-5 items-center">
          <div className="relative lg:col-span-2 mx-auto w-full max-w-sm">
            <Sunburst className="absolute -top-8 -left-8 w-28 z-0" />
            <div className="neo-card relative z-10 bg-mg-teal bg-neo-dots -rotate-2 shadow-neo-xl aspect-[4/5] overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-mg-sun border-t-2 border-mg-ink" />
              <img
                src="/images/mahago-driver.webp"
                alt="Driver MahaGo berdiri di samping skuter sambil membawa pesanan"
                width="1000"
                height="1057"
                loading="lazy"
                className="relative w-full h-full object-contain p-6 rotate-2"
              />
            </div>
            <span className="absolute -bottom-5 -right-2 z-20 rotate-6 bg-mg-cream text-mg-green-deep border-2 border-mg-ink rounded-neo shadow-neo px-3 py-2 text-sm font-bold">
              #SahabatMahasiswa
            </span>
          </div>

          <ul className="lg:col-span-3 grid gap-4 sm:grid-cols-2">
            {fiturList.map(({ icon: Icon, title, desc, tile }, i) => (
              <li
                key={title}
                className={`neo-card neo-lift bg-white flex items-start gap-4 p-5 ${
                  i === fiturList.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <span
                  className={`grid place-items-center w-12 h-12 shrink-0 border-2 border-mg-ink rounded-neo shadow-neo-sm ${tile}`}
                >
                  <Icon size={26} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg text-mg-ink">
                    {title}
                  </h3>
                  <p className="text-sm text-mg-ink/80">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
