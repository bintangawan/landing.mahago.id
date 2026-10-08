import {
  DownloadSimple,
  UsersThree,
  PaperPlaneTilt,
  WhatsappLogo,
  ArrowRight,
  DeviceMobile,
} from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sunburst, Sparkle, Coil, XMark } from "./neo/Decor";

const steps = [
  {
    number: 1,
    title: "Unduh WhatsApp",
    desc: "Pastikan kamu sudah install aplikasi WhatsApp di smartphone",
    icon: DownloadSimple,
    tile: "bg-mg-teal text-mg-ink",
  },
  {
    number: 2,
    title: "Join Grup MahaGo",
    desc: "Klik link untuk bergabung dengan grup WhatsApp MahaGo",
    icon: UsersThree,
    tile: "bg-mg-sun text-mg-ink",
  },
  {
    number: 3,
    title: "Mulai Pesan!",
    desc: 'Ketik "Maha" di grup dan driver akan merespons dengan "Go"',
    icon: PaperPlaneTilt,
    tile: "bg-mg-indigo text-white",
  },
];

export default function WhatsAppGuideSection() {
  return (
    <section
      id="whatsapp-guide"
      className="relative overflow-hidden bg-mg-cream bg-neo-grid py-16 sm:py-24"
    >
      <Sparkle className="absolute top-12 left-[7%] w-9" />
      <XMark className="absolute top-16 right-[9%] w-7" color="#0f8c3c" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Panduan"
          icon={DeviceMobile}
          title={
            <>
              Panduan <Highlight tone="green">WhatsApp</Highlight>
            </>
          }
          subtitle="Ikuti langkah mudah ini untuk mulai menggunakan MahaGo"
        />

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-14">
          {steps.map(({ number, title, desc, icon: Icon, tile }, index) => (
            <li key={number} className="relative">
              <div className="neo-card neo-lift bg-white h-full p-6 pt-8 text-center">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 -rotate-3 bg-mg-ink text-mg-sun border-2 border-mg-ink rounded-neo px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Langkah {number}
                </span>
                <span
                  className={`grid place-items-center w-16 h-16 mx-auto mb-4 border-2 border-mg-ink rounded-neo shadow-neo ${tile}`}
                >
                  <Icon size={32} aria-hidden="true" />
                </span>
                <h3 className="font-display font-black text-xl text-mg-ink mb-2">
                  {title}
                </h3>
                <p className="text-sm text-mg-ink/80">{desc}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight
                  size={28}
                  className="hidden md:block absolute top-1/2 -right-9 -translate-y-1/2 text-mg-ink"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        {/* CTA gabung grup */}
        <div className="relative">
          <Sunburst className="absolute -top-12 -right-6 w-28 sm:w-36 z-10" />
          <Coil className="absolute -left-4 top-6 w-12 z-10 hidden lg:block" />
          <div className="neo-card neo-grain bg-neo-grid relative overflow-hidden bg-mg-green-deep shadow-neo-xl px-6 py-10 sm:p-12 text-center [--grid-line:rgb(235_255_222/0.1)]">
            <div className="max-w-3xl mx-auto">
              <span className="grid place-items-center w-20 h-20 mx-auto mb-6 -rotate-6 bg-mg-sun text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo">
                <WhatsappLogo size={44} aria-hidden="true" />
              </span>
              <h3 className="font-display font-black text-2xl sm:text-4xl tracking-tight text-mg-cream mb-4">
                Siap Bergabung dengan Grup MahaGo?
              </h3>
              <p className="text-sm sm:text-base text-mg-cream mb-8">
                Gabung sekarang dan nikmati kemudahan pesan ojek langsung dari
                grup WhatsApp. Ratusan mahasiswa sudah bergabung!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://chat.whatsapp.com/K0sttWaHC0P8ntI8Ul6DwS"
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn bg-mg-sun text-mg-ink px-7 py-4 text-base sm:text-lg"
                >
                  <UsersThree size={22} aria-hidden="true" />
                  Join Grup WhatsApp
                </a>
                <a
                  href="https://www.whatsapp.com/download"
                  target="_blank"
                  rel="noreferrer"
                  className="neo-btn bg-mg-cream text-mg-green-deep px-7 py-4 text-base sm:text-lg"
                >
                  <DownloadSimple size={22} aria-hidden="true" />
                  Download WhatsApp
                </a>
              </div>
              <p className="text-xs sm:text-sm text-mg-cream mt-6">
                Belum punya WhatsApp? Download dulu, gratis kok!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
