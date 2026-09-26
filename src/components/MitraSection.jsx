import { useState, useEffect } from "react";
import { Handshake, CheckFat, WhatsappLogo } from "@phosphor-icons/react";
import { getWhatsAppLink } from "../utils/adminHelper";
import { Highlight } from "./neo/SectionHeading";

const benefits = [
  "Waktu kerja fleksibel",
  "Penghasilan tambahan stabil",
  "Bonus menarik setiap minggu",
];

export default function MitraSection() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(
      getWhatsAppLink("Halo, saya mau daftar jadi mitra Mahago!")
    );
  }, []);

  return (
    <section className="relative overflow-hidden bg-mg-cream bg-neo-grid py-16 sm:py-24">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center px-4 sm:px-6 gap-12">
        <div className="w-full md:w-1/2">
          <span className="inline-flex items-center gap-2 -rotate-2 bg-mg-sun text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo-sm px-3 py-1 mb-5 text-xs font-bold uppercase tracking-wider">
            <Handshake size={16} aria-hidden="true" />
            Mitra Driver
          </span>
          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl leading-[1.15] text-mg-ink mb-4">
            Mau Jadi <Highlight tone="green">Mitra MahaGo</Highlight>?
          </h2>
          <p className="text-mg-ink/80 mb-6 text-sm sm:text-base">
            MahaGo membuka peluang bagi mahasiswa untuk menjadi mitra driver.
            Atur waktu kerja sesuka hati, dapat penghasilan tambahan, dan bantu
            sesama mahasiswa!
          </p>
          <ul className="space-y-3 mb-8">
            {benefits.map((text) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid place-items-center w-8 h-8 shrink-0 bg-mg-green text-mg-cream border-2 border-mg-ink rounded-neo">
                  <CheckFat size={16} weight="fill" aria-hidden="true" />
                </span>
                <span className="font-semibold text-mg-ink text-sm sm:text-base">
                  {text}
                </span>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="neo-btn bg-mg-sun text-mg-ink px-6 py-3"
          >
            <WhatsappLogo size={20} aria-hidden="true" />
            Daftar Jadi Mitra
          </a>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="neo-card bg-mg-teal bg-neo-dots rotate-2 shadow-neo-xl w-72 sm:w-80 aspect-square">
            <img
              src="/images/mahago-driver.webp"
              alt="Mitra driver MahaGo"
              width="1000"
              height="1057"
              loading="lazy"
              className="w-full h-full object-contain p-6 -rotate-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
