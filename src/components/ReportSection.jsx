import { useState, useEffect } from "react";
import { getWhatsAppLink } from "../utils/adminHelper";

export default function ReportSection() {
  const [whatsappLink, setWhatsappLink] = useState("");

  useEffect(() => {
    setWhatsappLink(
      getWhatsAppLink(
        "Halo%20Admin,%20saya%20ingin%20menyampaikan%20aduan%20terkait%20layanan%20MahaGo:%0A%0A[Jelaskan%20keluhan%20Anda%20di%20sini]"
      )
    );
  }, []);

  const reportTypes = [
    {
      icon: "fa fa-clock-o",
      title: "Driver Terlambat",
      desc: "Laporkan jika driver datang terlambat dari waktu yang dijanjikan",
    },
    {
      icon: "fa fa-frown-o",
      title: "Pelayanan Kurang Baik",
      desc: "Sampaikan jika pelayanan driver tidak sesuai harapan",
    },
    {
      icon: "fa fa-exclamation-circle",
      title: "Masalah Lainnya",
      desc: "Laporkan kendala atau masalah lain yang kamu alami",
    },
  ];

  return (
    <section id="report" className="py-12 sm:py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            📢 Aduan <span className="text-red-600">Customer</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Kami menghargai feedback Anda! Sampaikan keluhan atau masalah yang
            kamu alami, kami siap membantu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reportTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-2 border-gray-100"
            >
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <i
                  className={`${type.icon} text-2xl text-red-600`}
                  aria-hidden="true"
                ></i>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">
                {type.title}
              </h4>
              <p className="text-gray-600 text-sm">{type.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-red-200 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i
                className="fa fa-commenting text-3xl text-red-600"
                aria-hidden="true"
              ></i>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Sampaikan Keluhan Anda
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Tim kami akan segera menindaklanjuti dan memberikan solusi terbaik
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold shadow-lg hover:shadow-xl"
            >
              <i className="fa fa-whatsapp text-xl" aria-hidden="true"></i>
              Kirim Aduan via WhatsApp
            </a>
            <p className="text-xs text-gray-500 mt-4">
              Aduan Anda akan ditangani dengan cepat dan profesional
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
