import { Gift, Ticket, BellRinging } from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sunburst, Sparkle, DotRings, Squiggle } from "./neo/Decor";

export default function PromoSection() {
  return (
    <section
      id="promo"
      className="neo-grain bg-neo-grid relative overflow-hidden bg-mg-green-deep py-16 sm:py-24 [--grid-line:rgb(235_255_222/0.1)]"
    >
      <Squiggle className="absolute top-10 right-6 w-28" />
      <DotRings className="absolute bottom-8 left-4 w-20" />
      <Sparkle className="absolute top-1/3 left-[10%] w-9 hidden md:block" />
      <Sparkle className="absolute bottom-1/4 right-[12%] w-7 hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Promo"
          icon={Ticket}
          title={
            <>
              Promo MahaGo <Highlight>Coming Soon</Highlight>
            </>
          }
          subtitle="Promo saat ini sudah berakhir. Tunggu promo menarik lainnya!"
        />

        <div className="relative max-w-3xl mx-auto">
          <Sunburst className="absolute -top-12 -right-4 sm:-right-10 w-28 sm:w-36" />

          {/* Kartu berbentuk tiket */}
          <div className="neo-card relative bg-mg-cream shadow-neo-xl flex flex-col sm:flex-row overflow-hidden">
            <div className="flex sm:flex-col items-center justify-center gap-3 bg-mg-sun border-b-2 sm:border-b-0 sm:border-r-2 border-dashed border-mg-ink px-6 py-5 sm:w-44">
              <span className="grid place-items-center w-16 h-16 -rotate-6 bg-mg-red text-white border-2 border-mg-ink rounded-neo shadow-neo">
                <Gift size={34} aria-hidden="true" />
              </span>
              <span className="font-display font-black text-2xl tracking-tight text-mg-ink">
                ???
              </span>
            </div>

            <div className="flex-1 p-6 sm:p-8 text-center sm:text-left">
              <span className="inline-block rotate-2 bg-mg-indigo text-white border-2 border-mg-ink rounded-neo shadow-neo-sm px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider">
                Coming Soon
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-mg-ink mb-3">
                Promo baru sedang kami siapkan
              </h3>
              <p className="text-mg-ink/80 text-sm sm:text-base">
                Pantau terus info terbaru dari MahaGo. Begitu promo terbaru
                rilis, kamu jadi yang pertama tahu!
              </p>
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-mg-green-deep">
                <BellRinging size={18} aria-hidden="true" />
                Nantikan kejutannya di sini
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
