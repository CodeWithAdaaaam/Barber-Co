import HeroSection from '../components/home/HeroSection';
import ServicesIntroSection from '../components/home/ServicesIntroSection';
import OurServicesSection from '../components/home/OurServiceSection';
import SalonSection from '../components/home/SalonSection';
import ClientReviewsSection from '../components/home/ClientReviewSection';

export default function HomePage() {
  return (
    <>
      <div className="overflow-x-hidden">
        <HeroSection />
        <ServicesIntroSection />
        <OurServicesSection />
        <SalonSection />
        <ClientReviewsSection /> 
      </div>
    </>
  );
}