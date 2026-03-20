import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "../components/sections/Navbar";
import { HeroSection } from "../components/sections/HeroSection";
import { StatsBar } from "../components/sections/StatsBar";
import { HowItWorks } from "../components/sections/HowItWorks";
import { FeaturesSection } from "../components/sections/FeaturesSection";
import { FooterSection } from "../components/sections/FooterSection";

export const Route = createFileRoute("/")({
  component: index,
});

function index() {
  return (
    <div className="min-h-screen w-full bg-[#0F1117]">
      <Navbar />

      <HeroSection />

      <StatsBar />

      <HowItWorks />

      <FeaturesSection />

      <FooterSection />
    </div>
  );
}
