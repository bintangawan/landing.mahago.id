import { useState, useEffect } from "react";
import {
  AndroidLogo,
  AppleLogo,
  Laptop,
  GoogleChromeLogo,
  DotsThreeVertical,
  DownloadSimple,
  CheckCircle,
  Compass,
  Export,
  PlusSquare,
  MagnifyingGlass,
  LockKey,
  DeviceMobile,
  Lightning,
  Lightbulb,
} from "@phosphor-icons/react";
import SectionHeading, { Highlight } from "./neo/SectionHeading";
import { Sparkle, Squiggle, XMark } from "./neo/Decor";

const PLATFORMS = [
  {
    id: "android",
    label: "Android",
    icon: AndroidLogo,
    steps: [
      {
        title: "Buka Browser",
        desc: "Buka website Mahago.id di Chrome atau browser favorit kamu",
        icon: GoogleChromeLogo,
      },
      {
        title: 'Tap Menu "⋮"',
        desc: "Tap ikon titik tiga (⋮) di pojok kanan atas browser",
        icon: DotsThreeVertical,
      },
      {
        title: 'Pilih "Install App"',
        desc: 'Tap "Install App" atau "Add to Home Screen"',
        icon: DownloadSimple,
      },
      {
        title: "Selesai!",
        desc: "Icon MahaGo akan muncul di home screen kamu",
        icon: CheckCircle,
      },
    ],
  },
  {
    id: "ios",
    label: "iPhone/iPad",
    icon: AppleLogo,
    steps: [
      {
        title: "Buka Safari",
        desc: "Buka website Mahago.id di browser Safari (harus Safari)",
        icon: Compass,
      },
      {
        title: 'Tap "Share"',
        desc: "Tap tombol Share di bagian bawah atau atas browser",
        icon: Export,
      },
      {
        title: 'Tap "Add to Home Screen"',
        desc: 'Scroll kebawah dan pilih "Add to Home Screen"',
        icon: PlusSquare,
      },
      {
        title: "Tap Add",
        desc: "Tap tombol Add di pojok kanan atas, selesai!",
        icon: CheckCircle,
      },
    ],
  },
  {
    id: "pc",
    label: "PC/Laptop",
    icon: Laptop,
    steps: [
      {
        title: "Buka Browser",
        desc: "Buka website Mahago.id di Chrome, Edge, atau browser modern",
        icon: Laptop,
      },
      {
        title: "Lihat Address Bar",
        desc: "Perhatikan icon install (⊕) di sebelah kanan address bar",
        icon: MagnifyingGlass,
      },
      {
        title: "Klik Install",
        desc: 'Klik icon tersebut atau tombol "Install" yang muncul',
        icon: DownloadSimple,
      },
      {
        title: "Selesai!",
        desc: "MahaGo akan terbuka di window terpisah seperti aplikasi",
        icon: CheckCircle,
      },
    ],
  },
];

const benefits = [
  {
    icon: LockKey,
    title: "Privasi Terjaga",
    desc: "Pesan langsung ke admin tanpa terlihat publik di grup",
    tile: "bg-mg-indigo text-white",
  },
  {
    icon: DeviceMobile,
    title: "Seperti Aplikasi Native",
    desc: "Pengalaman menggunakan seperti aplikasi asli, fullscreen",
    tile: "bg-mg-teal text-mg-ink",
  },
  {
    icon: Lightning,
    title: "Akses Lebih Cepat",
    desc: "Buka langsung dari home screen tanpa buka browser",
    tile: "bg-mg-sun text-mg-ink",
  },
];

const STEP_TILES = [
  "bg-mg-green text-mg-cream",
  "bg-mg-sun text-mg-ink",
  "bg-mg-teal text-mg-ink",
  "bg-mg-indigo text-white",
];

export default function InstallPWASection() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState("android");

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

  const activePlatform =
    PLATFORMS.find((platform) => platform.id === activeTab) ?? PLATFORMS[0];

  return (
    <section
      id="install-pwa"
      className="neo-grain bg-neo-grid relative overflow-hidden bg-mg-green-deep py-16 sm:py-24 [--grid-line:rgb(235_255_222/0.1)]"
    >
      <Squiggle className="absolute top-10 right-4 w-28" />
      <Sparkle className="absolute top-24 left-[8%] w-9 hidden md:block" />
      <XMark className="absolute bottom-10 left-6 w-7" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Web App"
          icon={DeviceMobile}
          title={
            <>
              Install <Highlight>MahaGo Web App</Highlight>
            </>
          }
          subtitle="Install MahaGo di perangkat kamu dan gunakan seperti aplikasi native! Lebih cepat, praktis, hemat data, dan privasi terjaga."
        />

        {/* Status sudah terinstall */}
        {isInstalled && (
          <div
            role="status"
            className="neo-card flex items-center justify-center gap-3 max-w-2xl mx-auto mb-10 p-4 text-center"
          >
            <CheckCircle
              size={28}
              weight="fill"
              className="text-mg-green-deep shrink-0"
              aria-hidden="true"
            />
            <p className="font-bold text-mg-green-deep">
              MahaGo sudah terinstall di perangkat kamu!
            </p>
          </div>
        )}

        {/* Tombol install langsung */}
        {isInstallable && !isInstalled && (
          <div className="neo-card bg-mg-sun shadow-neo-xl max-w-2xl mx-auto mb-12 p-8 text-center">
            <span className="grid place-items-center w-16 h-16 mx-auto mb-4 -rotate-6 bg-white text-mg-ink border-2 border-mg-ink rounded-neo shadow-neo">
              <DeviceMobile size={34} aria-hidden="true" />
            </span>
            <h3 className="font-display font-black text-2xl text-mg-ink mb-2">
              Install MahaGo Sekarang!
            </h3>
            <p className="text-sm text-mg-ink mb-6">
              Browser kamu mendukung instalasi langsung. Klik tombol di bawah!
            </p>
            <button
              type="button"
              onClick={handleInstallClick}
              className="neo-btn bg-mg-green-deep text-mg-cream px-8 py-4 text-lg"
            >
              <DownloadSimple size={22} aria-hidden="true" />
              Install Aplikasi
            </button>
          </div>
        )}

        {/* Keuntungan */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map(({ icon: Icon, title, desc, tile }) => (
            <li key={title} className="neo-card neo-lift p-6 text-center">
              <span
                className={`grid place-items-center w-14 h-14 mx-auto mb-4 border-2 border-mg-ink rounded-neo shadow-neo-sm ${tile}`}
              >
                <Icon size={28} aria-hidden="true" />
              </span>
              <h3 className="font-display font-black text-lg text-mg-ink mb-2">
                {title}
              </h3>
              <p className="text-sm text-mg-ink/80">{desc}</p>
            </li>
          ))}
        </ul>

        {/* Panduan install per platform */}
        <div className="neo-card bg-white shadow-neo-xl overflow-hidden">
          <div
            role="tablist"
            aria-label="Pilih perangkat"
            className="grid grid-cols-3 border-b-2 border-mg-ink"
          >
            {PLATFORMS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-2 py-4 px-3 font-bold transition not-first:border-l-2 not-first:border-mg-ink ${
                    active
                      ? "bg-mg-sun text-mg-ink"
                      : "bg-mg-cream text-mg-ink hover:bg-white"
                  }`}
                >
                  <Icon size={22} aria-hidden="true" />
                  <span className="max-sm:sr-only">{label}</span>
                </button>
              );
            })}
          </div>

          <div
            id={`panel-${activePlatform.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activePlatform.id}`}
            className="p-6 sm:p-8"
          >
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activePlatform.steps.map(({ title, desc, icon: Icon }, index) => (
                <li key={title} className="text-center">
                  <span
                    className={`grid place-items-center w-16 h-16 mx-auto mb-4 border-2 border-mg-ink rounded-neo shadow-neo ${STEP_TILES[index]}`}
                  >
                    <Icon size={30} aria-hidden="true" />
                  </span>
                  <span className="inline-block -rotate-2 mb-3 bg-mg-ink text-mg-sun rounded-neo px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Step {index + 1}
                  </span>
                  <h4 className="font-display font-bold text-mg-ink mb-2">
                    {title}
                  </h4>
                  <p className="text-sm text-mg-ink/80">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tips: gaya "info alert" dari Figma */}
        <div className="neo-card bg-mg-indigo text-white shadow-neo-lg mt-10 max-w-3xl mx-auto p-6">
          <div className="flex items-start gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 bg-mg-sun text-mg-ink border-2 border-mg-ink rounded-neo">
              <Lightbulb size={24} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display font-black text-lg mb-2">
                Tips Penting
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • Untuk iOS: <strong>HARUS</strong> menggunakan Safari browser
                </li>
                <li>
                  • Untuk Android: Gunakan Chrome, Firefox, atau Samsung
                  Internet
                </li>
                <li>
                  • Setelah install, kamu bisa buka MahaGo langsung dari home
                  screen seperti aplikasi biasa!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
