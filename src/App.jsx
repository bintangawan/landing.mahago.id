import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PromoBanner from "./components/PromoBanner";
import Fitur from "./components/Fitur";
import PromoSection from "./components/PromoSection";
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
      <MitraSection />
      <Footer />
    </div>
  );
}
