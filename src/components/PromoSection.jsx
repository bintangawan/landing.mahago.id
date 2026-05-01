export default function PromoSection() {
  return (
    <section id="promo" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Promo MahaGo <span className="text-green-600">Coming Soon</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Promo saat ini sudah berakhir. Tunggu promo menarik lainnya!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 sm:p-10 text-center shadow-xl">
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              Coming Soon
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Promo baru sedang kami siapkan
            </h4>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Pantau terus info terbaru dari MahaGo. Begitu promo terbaru rilis,
              kamu jadi yang pertama tahu!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
