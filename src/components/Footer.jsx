export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-green-500">MahaGo</h1>
            </div>
            <p className="text-sm text-gray-400">Ojek Kampus Terpercaya</p>
          </div>
          <div className="flex gap-5">
            {["Instagram", "Twitter", "Facebook"].map((s) => (
              <a
                key={s}
                href="#"
                className="hover:text-green-500 transition text-sm"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; 2025 MahaGo – Ojek Kampus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
