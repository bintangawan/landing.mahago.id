import { useState, useEffect } from "react";
import {
  Megaphone,
  Timer,
  SmileySad,
  WarningCircle,
  ChatCircleDots,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { getWhatsAppLink } from "../utils/adminHelper";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { XMark, Sparkle } from "./neo/Decor";

const reportTypes = [
  {
    icon: Timer,
    title: "Driver Terlambat",
    desc: "Laporkan jika driver datang terlambat dari waktu yang dijanjikan",
  },
  {
    icon: SmileySad,
    title: "Pelayanan Kurang Baik",
    desc: "Sampaikan jika pelayanan driver tidak sesuai harapan",
  },
  {
    icon: WarningCircle,
    title: "Masalah Lainnya",
    desc: "Laporkan kendala atau masalah lain yang kamu alami",
  },
];

export default function ReportSection() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(
      getWhatsAppLink(
        "Halo Admin, saya ingin menyampaikan aduan terkait layanan MahaGo:\n\n[Jelaskan keluhan Anda di sini]"
      )
    );
  }, []);

  return (
    <section
      id="report"
      className="relative overflow-hidden bg-mg-cream bg-neo-dots py-16 sm:py-24"
    >
      <XMark className="absolute top-16 left-[8%] w-7" color="#e11d48" />
      <Sparkle className="absolute bottom-20 right-[8%] w-9" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Aduan"
          icon={Megaphone}
          title={
            <>
              Aduan <Highlight tone="red">Customer</Highlight>
            </>
          }
          subtitle="Kami menghargai feedback Anda! Sampaikan keluhan atau masalah yang kamu alami, kami siap membantu."
        />

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reportTypes.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="neo-card neo-lift bg-white p-6">
              <span className="grid place-items-center w-14 h-14 mb-4 bg-mg-red text-white border-2 border-mg-ink rounded-neo shadow-neo-sm">
                <Icon size={28} aria-hidden="true" />
              </span>
              <h3 className="font-display font-black text-lg text-mg-ink mb-2">
                {title}
              </h3>
              <p className="text-sm text-mg-ink/80">{desc}</p>
            </li>
          ))}
        </ul>

        {/* CTA aduan: gaya "failed alert" dari Figma, teks putih agar kontras */}
        <div className="neo-card bg-mg-red text-white shadow-neo-xl max-w-2xl mx-auto p-8 text-center">
          <span className="grid place-items-center w-16 h-16 mx-auto mb-4 -rotate-6 bg-white text-mg-red border-2 border-mg-ink rounded-neo shadow-neo">
            <ChatCircleDots size={34} aria-hidden="true" />
          </span>
          <h3 className="font-display font-black text-2xl mb-3">
            Sampaikan Keluhan Anda
          </h3>
          <p className="text-sm mb-6">
            Tim kami akan segera menindaklanjuti dan memberikan solusi terbaik
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="neo-btn w-full sm:w-auto bg-white text-mg-ink px-5 sm:px-7 py-4"
          >
            <WhatsappLogo size={22} aria-hidden="true" />
            Kirim Aduan via WhatsApp
          </a>
          <p className="text-xs mt-5">
            Aduan Anda akan ditangani dengan cepat dan profesional
          </p>
        </div>
      </div>
    </section>
  );
}
