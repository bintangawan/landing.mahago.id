import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoBanner from "./components/PromoBanner";
import Fitur from "./components/Fitur";
import PromoSection from "./components/PromoSection";
import HowToOrderSection from "./components/HowToOrderSection";
import ContactSection from "./components/ContactSection";
import ReportSection from "./components/ReportSection";
import WhatsAppGuideSection from "./components/WhatsAppGuideSection";
import InstallPWASection from "./components/InstallPWASection";
import MitraSection from "./components/MitraSection";
import Footer from "./components/Footer";
import "./index.css";

export default function App() {
  return (
    <div className="font-[Poppins] bg-gray-50 text-gray-800 scroll-smooth">
      <Navbar />
      <Hero />
      <PromoBanner />
      <Fitur />
      <PromoSection />
      <HowToOrderSection />
      <WhatsAppGuideSection />
      <InstallPWASection />
      <ContactSection />
      <ReportSection />
      {/* <MitraSection /> */}
      <Footer />
    </div>
  );
}
