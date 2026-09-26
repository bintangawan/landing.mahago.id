import { useState, useEffect } from "react";
import { Megaphone, ChatCircleText } from "@phosphor-icons/react";
import { getWhatsAppLink } from "../utils/adminHelper";
import { XMark } from "./neo/Decor";

export default function PromoBanner() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(getWhatsAppLink());
  }, []);

  return (
    <section className="relative overflow-hidden bg-mg-sun border-b-2 border-mg-ink py-8">
      <XMark className="absolute top-3 right-[30%] w-6 hidden md:block" color="#0f1720" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="grid place-items-center w-14 h-14 shrink-0 -rotate-6 bg-mg-red text-white border-2 border-mg-ink rounded-neo shadow-neo">
              <Megaphone size={28} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-mg-ink">
                Promo Akan Kembali
              </h2>
              <p className="text-sm sm:text-base font-medium text-mg-ink">
                Promo sudah berakhir. Tunggu promo menarik lainnya di sini!
              </p>
            </div>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="neo-btn bg-mg-green-deep text-mg-cream px-6 py-3"
          >
            <ChatCircleText size={20} aria-hidden="true" />
            Tanya Admin
          </a>
        </div>
      </div>
    </section>
  );
}
