import { useState, useEffect } from "react";
import { getWhatsAppLink } from "../utils/adminHelper";

export default function Hero() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(getWhatsAppLink());
  }, []);

  return (
    <section
      id="home"
      className="pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6"
    >
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
          MahaGo – <span className="text-green-600">Ojek Kampus</span> Tercepat!
        </h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Your campus ride partner made by student, for student.
        </p>
        <p className="text-green-600 font-semibold mb-6 text-base sm:text-lg">
          #SahabatMahasiswa
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold text-center shadow-lg hover:shadow-xl"
          >
            🚀 Pesan Sekarang
          </a>
          <a
            href="#promo"
            className="inline-block bg-white border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition font-semibold text-center"
          >
            Lihat Promo
          </a>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="/images/ojek.svg"
          alt="Mahago Ojek"
          className="w-64 sm:w-72 md:w-96 animate-float"
        />
      </div>
    </section>
  );
}
