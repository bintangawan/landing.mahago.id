import { useState, useEffect } from "react";
import { getWhatsAppLink } from "../utils/adminHelper";

export default function PromoBanner() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(getWhatsAppLink());
  }, []);

  return (
    <section className="py-8 bg-linear-to-r from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white text-center md:text-left">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Promo Akan Kembali
            </h3>
            <p className="text-sm sm:text-base opacity-90">
              Promo sudah berakhir. Tunggu promo menarik lainnya di sini!
            </p>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Tanya Admin
          </a>
        </div>
      </div>
    </section>
  );
}
