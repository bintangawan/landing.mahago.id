import {
  UsersThree,
  Globe,
  ChatText,
  CheckCircle,
  Phone,
  CursorClick,
  Moped,
  LockKey,
  ShieldCheck,
  WarningCircle,
  ClipboardText,
} from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sunburst, Squiggle, XMark, DotRings } from "./neo/Decor";

const methods = [
  {
    id: 1,
    title: "Melalui Grup WhatsApp",
    icon: UsersThree,
    header: "bg-mg-teal text-mg-ink",
    badge: null,
    steps: [
      { text: 'Ketik "Maha" di grup MahaGo', icon: ChatText },
      { text: 'Driver jawab "Go"', icon: CheckCircle },
      { text: "Driver otomatis hubungi kamu", icon: Phone },
    ],
  },
  {
    id: 2,
    title: "Melalui Website/Admin",
    icon: Globe,
    header: "bg-mg-sun text-mg-ink",
    badge: "Privasi Terjaga",
    steps: [
      { text: "Ketik Mahago.id di browser kamu", icon: Globe },
      {
        text: 'Klik "Pesan Sekarang" atau "Lanjut ke WA"',
        icon: CursorClick,
      },
      {
        text: "Admin carikan driver & driver hubungi kamu langsung",
        icon: Moped,
      },
      { text: "Pesanan kamu tidak terlihat publik di grup!", icon: LockKey },
    ],
  },
];

const notes = [
  { text: "Berlaku hanya di sekitar area Kampus UINSU Tuntungan" },
  {
    text: "Maksimal 1 tujuan per order. Jika lebih, dikenakan biaya tambahan 1k per tujuan",
  },
  {
    text: "Periode berlaku berikutnya segera diumumkan. Pantau info terbaru dari MahaGo!",
    badge: "Coming Soon",
  },
];

export default function HowToOrderSection() {
  return (
    <section
      id="howtoorder"
      className="neo-grain bg-neo-grid relative overflow-hidden bg-mg-green-deep py-16 sm:py-24 [--grid-line:rgb(235_255_222/0.1)]"
    >
      <Squiggle className="absolute top-10 left-4 w-28" />
      <XMark className="absolute top-20 right-[8%] w-7" />
      <DotRings className="absolute bottom-6 right-4 w-20 hidden sm:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Cara Pesan"
          icon={ClipboardText}
          title={
            <>
              Cara <Highlight>Pesan MahaGo</Highlight>
            </>
          }
          subtitle="Pilih metode pemesanan yang paling mudah untuk kamu!"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {methods.map(({ id, title, icon: Icon, header, badge, steps }) => (
            <div key={id} className="neo-card neo-lift relative shadow-neo-lg">
              {badge && (
                <span className="absolute -top-4 right-4 z-10 inline-flex items-center gap-1.5 rotate-3 bg-mg-indigo text-white border-2 border-mg-ink rounded-neo shadow-neo-sm px-3 py-1 text-xs font-bold">
                  <ShieldCheck size={16} aria-hidden="true" />
                  {badge}
                </span>
              )}

              <div
                className={`flex items-center gap-3 border-b-2 border-mg-ink px-5 py-4 ${header}`}
              >
                <span className="grid place-items-center w-12 h-12 bg-white text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo-sm">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3 className="font-display font-black text-xl tracking-tight">
                  {title}
                </h3>
              </div>

              <ol className="space-y-4 p-5 sm:p-6">
                {steps.map(({ text, icon: StepIcon }, index) => (
                  <li key={text} className="flex items-start gap-4">
                    <span className="grid place-items-center w-10 h-10 shrink-0 bg-mg-ink text-mg-sun font-display font-black text-lg rounded-neo">
                      {index + 1}
                    </span>
                    <p className="flex items-center gap-2 pt-2 font-semibold text-mg-ink">
                      <StepIcon
                        size={20}
                        className="shrink-0 text-mg-green-deep"
                        aria-hidden="true"
                      />
                      {text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Catatan: gaya "warning alert" dari Figma, teks gelap agar kontras */}
        <div className="relative">
          <Sunburst className="absolute -top-10 -left-6 w-24 hidden sm:block" />
          <div className="neo-card relative bg-mg-sun shadow-neo-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <WarningCircle
                size={30}
                className="text-mg-ink"
                aria-hidden="true"
              />
              <h3 className="font-display font-black text-xl text-mg-ink">
                Catatan Penting
              </h3>
            </div>
            <ul className="space-y-3">
              {notes.map(({ text, badge }) => (
                <li key={text} className="flex items-start gap-3">
                  <span
                    className="mt-2 w-2.5 h-2.5 shrink-0 bg-mg-ink rotate-45"
                    aria-hidden="true"
                  />
                  <span className="text-mg-ink text-sm sm:text-base">
                    {badge && (
                      <span className="inline-block -rotate-2 mr-2 bg-mg-indigo text-white border-2 border-mg-ink rounded-neo px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                        {badge}
                      </span>
                    )}
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
