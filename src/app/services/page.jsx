import InnerHero from "@/components/ui/InnerHero/InnerHero";
import ServiceGrid from "@/sections/services/ServiceGrid/ServiceGrid";
import Platforms from "@/sections/services/Platforms/Platforms";
import Technology from "@/sections/home/Technology/Technology";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <InnerHero eyebrow="Website QA services" title="Find the issues holding your complete website experience back." text="We inspect pages, sections and interactions across design, responsive behavior, usability and functionality—then show you what to improve." secondary="How It Works" secondaryHref="/how-it-works" />
      <ServiceGrid />
      <Platforms />
      <Technology />
      <FinalCTA />
    </>
  );
}
