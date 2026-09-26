import { useState } from "react";
import { IconContext } from "@phosphor-icons/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoBanner from "./components/PromoBanner";
import Fitur from "./components/Fitur";
import PromoSection from "./components/PromoSection";
import PriceCalculatorSection from "./components/PriceCalculatorSection";
import HowToOrderSection from "./components/HowToOrderSection";
import ContactSection from "./components/ContactSection";
import OfficeLocationSection from "./components/OfficeLocationSection";
import ReportSection from "./components/ReportSection";
import WhatsAppGuideSection from "./components/WhatsAppGuideSection";
import InstallPWASection from "./components/InstallPWASection";
// import MitraSection from "./components/MitraSection";
import Footer from "./components/Footer";
import Marquee from "./components/neo/Marquee";
import { DEFAULT_ORDER_MESSAGE } from "./utils/adminHelper";

const MARQUEE_ITEMS = [
  "#SahabatMahasiswa",
  "Ojek Kampus UINSU",
  "Mulai Rp 5.000",
  "Driver Mahasiswa",
  "Antar Makanan",
  "Pesan via WhatsApp",
  "Siap 24 Jam",
];

export default function App() {
  const [orderMessage, setOrderMessage] = useState(DEFAULT_ORDER_MESSAGE);

  return (
    <IconContext.Provider value={{ weight: "bold" }}>
      <div className="bg-mg-cream text-mg-ink">
        <Navbar />
        <main>
          <Hero />
          <Marquee
            items={MARQUEE_ITEMS}
            className="bg-mg-ink text-mg-sun"
          />
          <PromoBanner />
          <Fitur />
          <PromoSection />
          <PriceCalculatorSection onOrderMessageChange={setOrderMessage} />
          <HowToOrderSection />
          <WhatsAppGuideSection />
          <InstallPWASection />
          <ContactSection orderMessage={orderMessage} />
          <OfficeLocationSection />
          <ReportSection />
          {/* <MitraSection /> */}
        </main>
        <Footer />
      </div>
    </IconContext.Provider>
  );
}
