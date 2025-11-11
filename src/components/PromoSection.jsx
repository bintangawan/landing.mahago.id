export default function PromoSection() {
  const promos = [
    {
      id: 1,
      title: "10 Orderan Pertama GRATIS!",
      desc: "Khusus pengguna baru, 10 orang pertama tanpa biaya sepeserpun!",
      tag: "Pengguna Baru",
      color: "bg-green-100 text-green-700",
    },
    {
      id: 2,
      title: "Cuma Rp 3.000 Bulan Ini!",
      desc: "Promo spesial! Kemana aja di area kampus hanya Rp 3.000 selama bulan ini.",
      tag: "Terbatas",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 3,
      title: "Ajak Teman, Dapat Bonus!",
      desc: "Referral teman kamu dan dapatkan 3 perjalanan gratis untuk setiap teman yang bergabung!",
      tag: "Unlimited",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <section id="promo" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            🎉 Promo MahaGo <span className="text-green-600">Spesial!</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Jangan sampai kelewatan penawaran terbaik kami!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {promos.map(({ id, title, desc, tag, color }) => (
            <div
              key={id}
              className="bg-white border-2 border-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition"
            >
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {id}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
              <p className="text-gray-600 text-sm mb-4">{desc}</p>
              <span
                className={`inline-block ${color} px-3 py-1 rounded-full text-xs font-semibold`}
              >
                {tag}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-linear-to-br from-green-600 to-green-700 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Tunggu Apa Lagi? Yuk Pesan Sekarang! 🚀
          </h3>
          <p className="text-sm sm:text-base mb-6 opacity-90 max-w-2xl mx-auto">
            Gak usah jalan kaki lagi di bawah terik matahari atau kehujanan.
            MahaGo siap antar kamu ke mana aja dengan cepat, aman, dan hemat!
          </p>
          <a
            href="https://wa.me/6285765714991?text=Bang,%20mau%20dianter%20ke%20...%20dong!"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg text-base sm:text-lg"
          >
            💬 Chat WhatsApp Sekarang
          </a>
          <p className="text-xs sm:text-sm mt-4 opacity-75">
            Atau hubungi: <span className="font-semibold">0857-6571-4991</span>
          </p>
        </div>
      </div>
    </section>
  );
}
