import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdSlot from "@/components/sections/AdSlot";
import CalculatorGrid from "@/components/sections/CalculatorGrid";
import CalculatorPromo from "@/components/sections/CalculatorPromo";
import DataSimplification from "@/components/sections/DataSimplification";
import FinancialPersonality from "@/components/sections/FinancialPersonality";
import dynamic from "next/dynamic";

// Dynamically import heavy components for code splitting
// HeroSection uses Three.js which is heavy - lazy load it
const DynamicHeroSection = dynamic(() => import("@/components/sections/HeroSection"), {
  loading: () => (
    <section className="relative min-h-screen w-full overflow-hidden py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-4xl text-center w-full">
          <div className="h-96 flex items-center justify-center">
            <div className="animate-pulse text-white/50">Loading...</div>
          </div>
        </div>
      </div>
    </section>
  ),
  ssr: false, // Three.js components require client-side only
});

const DynamicInfoSection = dynamic(() => import("@/components/sections/InfoSection"), {
  loading: () => <div className="py-20" />,
  ssr: true, // Can be server-side rendered
});
const DynamicBlogPreview = dynamic(() => import("@/components/sections/BlogPreview"), {
  loading: () => <div className="py-20" />,
  ssr: true, // Can be server-side rendered
});

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Header />
      
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section - Lazy loaded for performance */}
        <DynamicHeroSection />
        
        {/* Ad Slot 1 - CLS Safe (Fixed Height) */}
        <AdSlot id="ad-slot-1" />
        
        {/* Calculator Grid */}
        <CalculatorGrid />
        
        {/* Interactive Calculator Promo Section */}
        <CalculatorPromo />
        
        {/* Data Simplification Section */}
        <DataSimplification />
        
        {/* Financial Personality Section */}
        <FinancialPersonality />
        
        {/* Knowledge Hub Sections */}
        <DynamicInfoSection />
        
        {/* Blog Preview */}
        <DynamicBlogPreview />
      </main>
      
      <Footer />
    </div>
  );
}

