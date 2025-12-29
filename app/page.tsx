import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdSlot from "@/components/sections/AdSlot";
import CalculatorGrid from "@/components/sections/CalculatorGrid";
import CalculatorPromo from "@/components/sections/CalculatorPromo";
import DataSimplification from "@/components/sections/DataSimplification";
import FinancialPersonality from "@/components/sections/FinancialPersonality";
import WhyYoullLoveOurTools from "@/components/sections/WhyYoullLoveOurTools";
import HeroSection from "@/components/sections/HeroSection";
import InfoSection from "@/components/sections/InfoSection";
import BlogPreview from "@/components/sections/BlogPreview";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Ad Slot 1 - CLS Safe (Fixed Height) */}
        <AdSlot id="ad-slot-1" />
        
        {/* Calculator Grid */}
        <section id="calculators">
          <CalculatorGrid />
        </section>
        
        {/* Why You'll Love Our Tools Section */}
        <WhyYoullLoveOurTools />
        
        {/* Interactive Calculator Promo Section */}
        <CalculatorPromo />
        
        {/* Data Simplification Section */}
        <DataSimplification />
        
        {/* Financial Personality Section */}
        <FinancialPersonality />
        
        {/* Knowledge Hub Sections */}
        <InfoSection />
        
        {/* Blog Preview */}
        <BlogPreview />
      </main>
      
      <Footer />
    </div>
  );
}

