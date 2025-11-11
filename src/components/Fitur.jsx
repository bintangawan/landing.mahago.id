export default function Fitur() {
  const fiturList = [
    ["🚴‍♂️", "Pesan Mudah & Cepat", "Langsung order via WhatsApp, tanpa ribet!"],
    ["💰", "Harga Terjangkau", "Mulai dari Rp 3.000, hemat banget!"],
    [
      "⚡",
      "Driver Terpercaya",
      "Semua driver adalah mahasiswa kampusmu sendiri!",
    ],
    [
      "🎯",
      "Jangkauan Luas",
      "Dari gedung kuliah sampai kosan, kami siap antar!",
    ],
  ];

  return (
    <section id="fitur" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 sm:px-6 gap-8">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/ojeks.png"
            alt="Fitur Mahago"
            className="w-64 sm:w-72 md:w-96"
          />
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Kenapa Harus <span className="text-green-600">MahaGo</span>?
          </h3>
          {fiturList.map(([icon, title, desc], i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-green-50 rounded-lg mb-3"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
