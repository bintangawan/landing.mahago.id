import { useState } from "react";
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
import MitraSection from "./components/MitraSection";
import Footer from "./components/Footer";
import { DEFAULT_ORDER_MESSAGE } from "./utils/adminHelper";
import "./index.css";

export default function App() {
  const [orderMessage, setOrderMessage] = useState(DEFAULT_ORDER_MESSAGE);

  return (
    <div className="font-[Poppins] bg-gray-50 text-gray-800 scroll-smooth">
      <Navbar />
      <Hero />
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
      <Footer />
    </div>
  );
}
