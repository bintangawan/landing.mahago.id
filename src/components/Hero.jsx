export default function Hero() {
  return (
    <section
      id="home"
      className="pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6"
    >
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold mb-4">
          🎉 10 Orderan Pertama GRATIS!
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
          MahaGo – <span className="text-green-600">Ojek Kampus</span> Tercepat!
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Antar jemput di kampus jadi lebih mudah! Ke kelas, kantin, atau
          kosan—semua ada di genggamanmu. Cepat, murah, dan terpercaya!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/6285765714991?text=Bang,%20mau%20dianter%20ke%20...%20dong!"
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
          src="/images/ojek.png"
          alt="Mahago Ojek"
          className="w-64 sm:w-72 md:w-96 animate-float"
        />
      </div>
    </section>
  );
}
