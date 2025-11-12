import { useState, useEffect } from "react";
import { getWhatsAppLink } from "../utils/adminHelper";

export default function MitraSection() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(
      getWhatsAppLink("Halo,%20saya%20mau%20daftar%20jadi%20mitra%20Mahago!")
    );
  }, []);

  const benefits = [
    "Waktu kerja fleksibel",
    "Penghasilan tambahan stabil",
    "Bonus menarik setiap minggu",
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center px-4 sm:px-6 gap-8">
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Mau Jadi <span className="text-green-600">Mitra MahaGo</span>?
          </h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            MahaGo membuka peluang bagi mahasiswa untuk menjadi mitra driver.
            Atur waktu kerja sesuka hati, dapat penghasilan tambahan, dan bantu
            sesama mahasiswa!
          </p>
          {benefits.map((text, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span className="text-gray-700 text-sm sm:text-base">{text}</span>
            </div>
          ))}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold shadow-lg mt-4"
          >
            Daftar Jadi Mitra
          </a>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135791.png"
            alt="Mitra Mahago"
            className="w-64 sm:w-72 md:w-96"
          />
        </div>
      </div>
    </section>
  );
}
