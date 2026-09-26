import { Buildings, MapPin, ArrowSquareOut } from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Squiggle, DotRings, Sparkle } from "./neo/Decor";

const OFFICE_COORDS = {
  lat: 3.500243416002398,
  lng: 98.59222686788182,
};

const OFFICE_MAP_LINK = "https://maps.app.goo.gl/yqrdZnpr2nKEtCed9";

export default function OfficeLocationSection() {
  const embedUrl = `https://www.google.com/maps?q=${OFFICE_COORDS.lat},${OFFICE_COORDS.lng}&z=16&output=embed`;

  return (
    <section
      id="office-location"
      className="neo-grain bg-neo-grid relative overflow-hidden bg-mg-green-deep py-16 sm:py-24 [--grid-line:rgb(235_255_222/0.1)]"
    >
      <Squiggle className="absolute top-10 left-4 w-28" />
      <DotRings className="absolute bottom-6 right-4 w-20 hidden sm:block" />
      <Sparkle className="absolute top-20 right-[10%] w-9" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Lokasi"
          icon={Buildings}
          title={
            <>
              Lokasi <Highlight>Kantor MahaGo</Highlight>
            </>
          }
          subtitle="Kamu bisa datang langsung ke kantor kami sesuai koordinat berikut."
        />

        <div className="neo-card bg-white shadow-neo-xl overflow-hidden">
          <div className="h-80 sm:h-96 border-b-2 border-mg-ink">
            <iframe
              title="Lokasi Kantor MahaGo"
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-11 h-11 shrink-0 bg-mg-red text-white border-2 border-mg-ink rounded-neo shadow-neo-sm">
                <MapPin size={24} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-mg-ink/70">
                  Koordinat
                </p>
                <p className="font-display font-black text-lg text-mg-ink">
                  {OFFICE_COORDS.lat.toFixed(6)}, {OFFICE_COORDS.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <a
              href={OFFICE_MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="neo-btn bg-mg-sun text-mg-ink px-6 py-3"
            >
              Buka di Google Maps
              <ArrowSquareOut size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
