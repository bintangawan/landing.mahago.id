export default function PromoBanner() {
  return (
    <section className="py-8 bg-linear-to-r from-green-600 to-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white text-center md:text-left">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              🎊 Promo Spesial Bulan Ini!
            </h3>
            <p className="text-sm sm:text-base opacity-90">
              Hanya Rp 3.000 untuk semua tujuan di kampus!
            </p>
          </div>
          <a
            href="https://wa.me/6285765714991?text=Bang,%20mau%20dianter%20ke%20...%20dong!"
            target="_blank"
            rel="noreferrer"
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg"
          >
            Manfaatkan Sekarang!
          </a>
        </div>
      </div>
    </section>
  );
}
