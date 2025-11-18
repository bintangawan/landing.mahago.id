import { useState, useEffect } from "react";

export default function InstallPWASection() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  const androidSteps = [
    {
      number: 1,
      title: "Buka Browser",
      desc: "Buka website Mahago.id di Chrome atau browser favorit kamu",
      icon: "fa fa-chrome",
    },
    {
      number: 2,
      title: 'Tap Menu "⋮"',
      desc: "Tap ikon titik tiga (⋮) di pojok kanan atas browser",
      icon: "fa fa-ellipsis-v",
    },
    {
      number: 3,
      title: 'Pilih "Install App"',
      desc: 'Tap "Install App" atau "Add to Home Screen"',
      icon: "fa fa-download",
    },
    {
      number: 4,
      title: "Selesai!",
      desc: "Icon MahaGo akan muncul di home screen kamu",
      icon: "fa fa-check-circle",
    },
  ];

  const iosSteps = [
    {
      number: 1,
      title: "Buka Safari",
      desc: "Buka website Mahago.id di browser Safari (harus Safari)",
      icon: "fa fa-safari",
    },
    {
      number: 2,
      title: 'Tap "Share" 📤',
      desc: "Tap tombol Share di bagian bawah atau atas browser",
      icon: "fa fa-share-square-o",
    },
    {
      number: 3,
      title: 'Tap "Add to Home Screen"',
      desc: 'Scroll kebawah dan pilih "Add to Home Screen"',
      icon: "fa fa-plus-square",
    },
    {
      number: 4,
      title: "Tap Add",
      desc: "Tap tombol Add di pojok kanan atas, selesai!",
      icon: "fa fa-check-circle",
    },
  ];

  const pcSteps = [
    {
      number: 1,
      title: "Buka Browser",
      desc: "Buka website Mahago.id di Chrome, Edge, atau browser modern",
      icon: "fa fa-laptop",
    },
    {
      number: 2,
      title: "Lihat Address Bar",
      desc: "Perhatikan icon install (⊕) di sebelah kanan address bar",
      icon: "fa fa-search",
    },
    {
      number: 3,
      title: "Klik Install",
      desc: 'Klik icon tersebut atau tombol "Install" yang muncul',
      icon: "fa fa-download",
    },
    {
      number: 4,
      title: "Selesai!",
      desc: "MahaGo akan terbuka di window terpisah seperti aplikasi",
      icon: "fa fa-check-circle",
    },
  ];

  const [activeTab, setActiveTab] = useState("android");

  const benefits = [
    {
      icon: "fa fa-lock fa-2x",
      title: "Privasi Terjaga",
      desc: "Pesan langsung ke admin tanpa terlihat publik di grup",
    },
    {
      icon: "fa fa-mobile fa-2x",
      title: "Seperti Aplikasi Native",
      desc: "Pengalaman menggunakan seperti aplikasi asli, fullscreen",
    },
    {
      icon: "fa fa-bolt fa-2x",
      title: "Akses Lebih Cepat",
      desc: "Buka langsung dari home screen tanpa buka browser",
    },

    // {
    //   icon: "fa fa-database",
    //   title: "Hemat Storage",
    //   desc: "Tidak perlu download app besar, langsung pakai via web",
    // },
  ];

  return (
    <section
      id="install-pwa"
      className="py-12 sm:py-20 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            📲 Install <span className="text-green-600">MahaGo Web App</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Install MahaGo di perangkat kamu dan gunakan seperti aplikasi
            native! Lebih cepat, praktis, hemat data, dan privasi terjaga.
          </p>
        </div>

        {/* Status Banner */}
        {isInstalled && (
          <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 mb-8 text-center max-w-2xl mx-auto">
            <i
              className="fa fa-check-circle text-3xl text-green-600 mb-2"
              aria-hidden="true"
            ></i>
            <p className="text-green-800 font-semibold">
              ✅ MahaGo sudah terinstall di perangkat kamu!
            </p>
          </div>
        )}

        {/* Quick Install Button */}
        {isInstallable && !isInstalled && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white shadow-2xl mb-12 max-w-2xl mx-auto">
            <i className="fa fa-mobile text-5xl mb-4" aria-hidden="true"></i>
            <h4 className="text-2xl font-bold mb-3">
              Install MahaGo Sekarang!
            </h4>
            <p className="text-sm mb-6 opacity-90">
              Browser kamu mendukung instalasi langsung. Klik tombol di bawah!
            </p>
            <button
              onClick={handleInstallClick}
              className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-bold shadow-lg text-lg inline-flex items-center gap-2"
            >
              <i className="fa fa-download" aria-hidden="true"></i>
              Install Aplikasi
            </button>
          </div>
        )}

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-2 border-green-100 text-center"
            >
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i
                  className={`${benefit.icon} text-2xl text-green-600`}
                  aria-hidden="true"
                ></i>
              </div>
              <h4 className="font-bold text-gray-900 text-lg mb-2">
                {benefit.title}
              </h4>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Installation Guide Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="grid grid-cols-3 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("android")}
              className={`py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === "android"
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className="fa fa-android text-xl" aria-hidden="true"></i>
              <span className="hidden sm:inline">Android</span>
            </button>
            <button
              onClick={() => setActiveTab("ios")}
              className={`py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === "ios"
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className="fa fa-apple text-xl" aria-hidden="true"></i>
              <span className="hidden sm:inline">iPhone/iPad</span>
            </button>
            <button
              onClick={() => setActiveTab("pc")}
              className={`py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === "pc"
                  ? "bg-green-600 text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <i className="fa fa-laptop text-xl" aria-hidden="true"></i>
              <span className="hidden sm:inline">PC/Laptop</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "android" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {androidSteps.map((step) => (
                  <div key={step.number} className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <i
                        className={`${step.icon} text-2xl text-white`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm mb-3 inline-block">
                      Step {step.number}
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">
                      {step.title}
                    </h5>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "ios" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {iosSteps.map((step) => (
                  <div key={step.number} className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <i
                        className={`${step.icon} text-2xl text-white`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm mb-3 inline-block">
                      Step {step.number}
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">
                      {step.title}
                    </h5>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pc" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pcSteps.map((step) => (
                  <div key={step.number} className="text-center">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <i
                        className={`${step.icon} text-2xl text-white`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm mb-3 inline-block">
                      Step {step.number}
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">
                      {step.title}
                    </h5>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <i
              className="fa fa-info-circle text-2xl text-yellow-600 mt-1"
              aria-hidden="true"
            ></i>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">💡 Tips Penting:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    Untuk iOS: <strong>HARUS</strong> menggunakan Safari browser
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    Untuk Android: Gunakan Chrome, Firefox, atau Samsung
                    Internet
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    Setelah install, kamu bisa buka MahaGo langsung dari home
                    screen seperti aplikasi biasa!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
