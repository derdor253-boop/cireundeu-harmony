import Navbar from "@/components/cireundeu/Navbar";
import Hero from "@/components/cireundeu/Hero";
import StatsBar from "@/components/cireundeu/StatsBar";
import About from "@/components/cireundeu/About";
import Features from "@/components/cireundeu/Features";
import Activities from "@/components/cireundeu/Activities";
import Packages from "@/components/cireundeu/Packages";
import Cuisine from "@/components/cireundeu/Cuisine";
import Timeline from "@/components/cireundeu/Timeline";
import AdatProfile from "@/components/cireundeu/AdatProfile";
import News from "@/components/cireundeu/News";
import ContactReservation from "@/components/cireundeu/ContactReservation";
import Gallery from "@/components/cireundeu/Gallery";
import Footer from "@/components/cireundeu/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <StatsBar />
      <About />
      <Timeline />
      <Features />
      <AdatProfile />
      <Cuisine />
      <Activities />
      <Gallery />
      <News />
      <Packages />
      <ContactReservation />
    </main>
    <Footer />
  </div>
);

export default Index;
