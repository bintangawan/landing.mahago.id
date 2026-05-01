const OFFICE_COORDS = {
  lat: 3.500243416002398,
  lng: 98.59222686788182,
};

const OFFICE_MAP_LINK = "https://maps.app.goo.gl/yqrdZnpr2nKEtCed9";

export default function OfficeLocationSection() {
  const embedUrl = `https://www.google.com/maps?q=${OFFICE_COORDS.lat},${OFFICE_COORDS.lng}&z=16&output=embed`;

  return (
    <section id="office-location" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Lokasi <span className="text-green-600">Kantor MahaGo</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Kamu bisa datang langsung ke kantor kami sesuai koordinat berikut.
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-80 sm:h-96">
            <iframe
              title="Lokasi Kantor MahaGo"
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Koordinat</p>
              <p className="text-lg font-semibold text-gray-900">
                {OFFICE_COORDS.lat.toFixed(6)}, {OFFICE_COORDS.lng.toFixed(6)}
              </p>
            </div>
            <a
              href={OFFICE_MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
