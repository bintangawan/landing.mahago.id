import {
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  DeviceMobile,
  Rocket,
} from "@phosphor-icons/react";
import { GMark, Sparkle, DotRings } from "./neo/Decor";

const socialMedia = [
  {
    name: "Instagram",
    icon: InstagramLogo,
    url: "https://www.instagram.com/mahago.id",
  },
  {
    name: "Facebook",
    icon: FacebookLogo,
    url: "https://www.facebook.com/share/1Bq3fZigvw/?mibextid=wwXIfr",
  },
  {
    name: "TikTok",
    icon: TiktokLogo,
    url: "https://www.tiktok.com/@mahago.id?_r=1&_t=ZS-91VeQ7YhUsU",
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-mg-ink text-mg-cream border-t-2 border-mg-ink pt-12 pb-32 sm:pb-36">
      <GMark className="absolute -bottom-10 -right-6 w-40 sm:w-52 opacity-90 rotate-12" />
      <DotRings className="absolute top-6 left-[45%] w-16 opacity-60 hidden md:block" />
      <Sparkle className="absolute top-10 right-[12%] w-8" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          <div className="text-center md:text-left">
            <img
              src="/images/MahaGo Logo Footer.svg"
              alt="MahaGo"
              width="1000"
              height="430"
              loading="lazy"
              className="h-12 w-auto mx-auto md:mx-0 mb-3"
            />
            <p className="inline-block -rotate-2 bg-mg-sun text-mg-ink border-2 border-mg-cream rounded-neo px-3 py-1 text-sm font-bold">
              #SahabatMahasiswa
            </p>
          </div>

          <ul className="flex gap-4 items-center">
            {socialMedia.map(({ name, icon: Icon, url }) => (
              <li key={name}>
                <a
                  href={url}
                  title={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-mg-cream text-mg-ink border-2 border-mg-cream rounded-neo px-3 py-2.5 text-sm font-bold shadow-[4px_4px_0_0_#ffd166] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#ffd166]"
                >
                  <Icon size={22} aria-hidden="true" />
                  <span className="max-sm:sr-only">{name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t-2 border-dashed border-mg-cream/30 pt-6 text-center">
          <p className="text-xs sm:text-sm mb-3">
            &copy; {year} MahaGo – Sahabat Mahasiswa. All rights reserved.
          </p>
          <p className="flex items-start justify-center gap-2 text-xs">
            <DeviceMobile
              size={18}
              className="text-mg-sun shrink-0"
              aria-hidden="true"
            />
            <span>
              Segera hadir dalam bentuk aplikasi mobile! Stay tuned{" "}
              <Rocket
                size={16}
                className="inline align-[-3px] text-mg-sun"
                aria-hidden="true"
              />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
