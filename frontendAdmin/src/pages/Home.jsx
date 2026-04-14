import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import MetricsSection from '../components/home/MetricsSection';
import ProgressSection from '../components/home/ProgressSection';
import MapPreview from '../components/home/MapPreview';
import LatestStages from '../components/home/LatestStages';
import PhotoGallery from '../components/home/PhotoGallery';
import DonationFeed from '../components/home/DonationFeed';
import CTA from '../components/home/CTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MetricsSection />
        <ProgressSection />
        <MapPreview />
        <LatestStages />
        <PhotoGallery />
        <DonationFeed />
        <CTA />
      </main>
      <Footer />
    </>
  );
}