export default function HowToOrderSection() {
  const methods = [
    {
      id: 1,
      title: "Melalui Grup WhatsApp",
      icon: "fa fa-users",
      color: "from-gray-500 to-gray-600",
      badge: null,
      steps: [
        { text: 'Ketik "Maha" di grup MahaGo', icon: "💬" },
        { text: 'Driver jawab "Go"', icon: "✅" },
        { text: "Driver otomatis hubungi kamu", icon: "📞" },
      ],
    },
    {
      id: 2,
      title: "Melalui Website/Admin",
      icon: "fa fa-globe",
      color: "from-green-500 to-green-600",
      badge: "🔒 Privasi Terjaga",
      steps: [
        { text: "Ketik Mahago.id di browser kamu", icon: "🌐" },
        { text: 'Klik "Pesan Sekarang" atau "Manfaatkan Sekarang"', icon: "🖱️" },
        { text: "Admin carikan driver & driver hubungi kamu langsung", icon: "🚀" },
        { text: "Pesanan kamu tidak terlihat publik di grup!", icon: "🔐" },
      ],
    },
  ];

  const notes = [
    "Berlaku hanya di sekitar area Kampus UINSU Tuntungan",
    "Maksimal 1 tujuan per order. Jika lebih, dikenakan biaya tambahan 1k per tujuan",
    "Berlaku sampai akhir bulan Desember 2025",
  ];

  return (
    <section id="howtoorder" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            📋 Cara <span className="text-green-600">Pesan MahaGo</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Pilih metode pemesanan yang paling mudah untuk kamu!
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {methods.map(({ id, title, icon, color, badge, steps }) => (
            <div
              key={id}
              className={`bg-white border-2 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative ${
                badge ? "border-green-400" : "border-gray-200"
              }`}
            >
              {/* Badge */}
              {badge && (
                <div className="absolute -top-3 right-4 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-1 rounded-full text-xs font-bold shadow-md">
                  {badge}
                </div>
              )}
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${color} rounded-xl p-4 mb-6 flex items-center gap-3`}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <i
                    className={`${icon} text-3xl text-white`}
                    aria-hidden="true"
                  ></i>
                </div>
                <h4 className="text-xl font-bold text-white">{title}</h4>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center font-bold text-green-700 border-2 border-green-300">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-700 font-medium flex items-center gap-2">
                        <span className="text-xl">{step.icon}</span>
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <i
              className="fa fa-exclamation-triangle text-3xl text-yellow-600"
              aria-hidden="true"
            ></i>
            <h4 className="text-xl font-bold text-gray-900">
              Catatan Penting
            </h4>
          </div>
          <ul className="space-y-3">
            {notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-yellow-600 font-bold text-lg mt-0.5">
                  •
                </span>
                <span className="text-gray-700 text-sm sm:text-base">
                  {note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
