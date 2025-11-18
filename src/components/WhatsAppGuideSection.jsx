export default function WhatsAppGuideSection() {
  const steps = [
    {
      number: 1,
      title: "Unduh WhatsApp",
      desc: "Pastikan kamu sudah install aplikasi WhatsApp di smartphone",
      icon: "fa fa-download",
    },
    {
      number: 2,
      title: "Join Grup MahaGo",
      desc: "Klik link untuk bergabung dengan grup WhatsApp MahaGo",
      icon: "fa fa-users",
    },
    {
      number: 3,
      title: "Mulai Pesan!",
      desc: 'Ketik "Maha" di grup dan driver akan merespons dengan "Go"',
      icon: "fa fa-paper-plane",
    },
  ];

  return (
    <section id="whatsapp-guide" className="py-12 sm:py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            📱 Panduan <span className="text-green-600">WhatsApp</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Ikuti langkah mudah ini untuk mulai menggunakan MahaGo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-green-100"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i
                  className={`${step.icon} text-3xl text-white`}
                  aria-hidden="true"
                ></i>
              </div>
              <div className="text-center">
                <div className="inline-block bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm mb-3">
                  Langkah {step.number}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 sm:p-10 text-center text-white shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <i
              className="fa fa-whatsapp text-6xl mb-4"
              aria-hidden="true"
            ></i>
            <h4 className="text-2xl sm:text-3xl font-bold mb-4">
              Siap Bergabung dengan Grup MahaGo?
            </h4>
            <p className="text-sm sm:text-base mb-6 opacity-90">
              Gabung sekarang dan nikmati kemudahan pesan ojek langsung dari
              grup WhatsApp. Ratusan mahasiswa sudah bergabung!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://chat.whatsapp.com/KqVoGZ6tjJH2RtkdPMMKAu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg text-base sm:text-lg"
              >
                <i className="fa fa-users" aria-hidden="true"></i>
                Join Grup WhatsApp
              </a>
              <a
                href="https://www.whatsapp.com/download"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg hover:bg-white/20 transition font-bold text-base sm:text-lg"
              >
                <i className="fa fa-download" aria-hidden="true"></i>
                Download WhatsApp
              </a>
            </div>
            <p className="text-xs sm:text-sm mt-6 opacity-75">
              Belum punya WhatsApp? Download dulu, gratis kok! 😊
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
