
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import VisionMission from "@/components/VisionMission";
import DepartmentSection from "@/components/DepartmentSection";
import UpcomingEvents from "@/components/UpcomingEvents";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";
import ScrollToTop from "@/components/Sponsors";
import Sponsors from "@/components/Sponsors";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <Navbar />
      <HeroSection />
      {/* <ScrollToTop /> */}
      <About />
      <VisionMission />
      <DepartmentSection />
      <Sponsors  />
      <NewsSection />
      <UpcomingEvents />
      <Footer />
    </main>     
  );
}