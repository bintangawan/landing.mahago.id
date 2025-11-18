export default function Footer() {
  const socialMedia = [
    { name: "Instagram", icon: "fa fa-instagram", url: "https://www.instagram.com/mahago.id" },
    { name: "Twitter", icon: "fa fa-twitter", url: "https://twitter.com/mahago_id" },
    { name: "Facebook", icon: "fa fa-facebook", url: "https://www.facebook.com/share/1Bq3fZigvw/?mibextid=wwXIfr" },
    { name: "TikTok", icon: "fa fa-music", url: "https://www.tiktok.com/@mahago.id?_r=1&_t=ZS-91VeQ7YhUsU" }, // Font Awesome 4.7 doesn't have TikTok, using music icon
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <img
                src="/images/MahaGo Logo Footer.svg"
                alt="MahaGo Logo"
                className="h-12 w-auto"
              />
              {/* <h1 className="text-xl sm:text-2xl font-bold text-green-700">MahaGo</h1> */}
            </div>
            <p className="text-sm text-gray-400">Sahabat Mahasiswa</p>
          </div>
          <div className="flex gap-5 items-center">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="hover:text-green-500 transition flex items-center gap-2"
                title={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`${social.icon} text-xl`} aria-hidden="true"></i>
                <span className="hidden sm:inline text-sm">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3">
            &copy; 2025 MahaGo – Sahabat Mahasiswa. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <i className="fa fa-mobile text-green-500" aria-hidden="true"></i>
            <p>
              Segera hadir dalam bentuk aplikasi mobile! Stay tuned 🚀
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
