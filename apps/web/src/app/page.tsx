import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FeeCalculatorSection } from "@/components/sections/FeeCalculatorSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="w-full pt-20 bg-surface">
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <FeeCalculatorSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}