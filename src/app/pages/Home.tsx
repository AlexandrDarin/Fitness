import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/home/HeroSection";
import { AboutSection } from "../components/home/AboutSection";
import { DirectionsSection } from "../components/home/DirectionsSection";
import { TrainersSection } from "../components/home/TrainersSection";
import { ScheduleSection } from "../components/home/ScheduleSection";
import { MembershipsSection } from "../components/home/MembershipsSection";
import { GallerySection } from "../components/home/GallerySection";
import { ReviewsSection } from "../components/home/ReviewsSection";
import { ContactsSection } from "../components/home/ContactsSection";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection 
          onScrollToMemberships={() => scrollToSection('memberships')}
          onScrollToTour={() => scrollToSection('tour')}
        />
        <AboutSection />
        <DirectionsSection />
        <TrainersSection />
        <ScheduleSection />
        <MembershipsSection />
        <GallerySection />
        <ReviewsSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
}
