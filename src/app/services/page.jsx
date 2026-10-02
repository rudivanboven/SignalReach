import InnerHero from "@/components/ui/InnerHero/InnerHero";
import ServiceGrid from "@/sections/services/ServiceGrid/ServiceGrid";
import Platforms from "@/sections/services/Platforms/Platforms";
import Support from "@/sections/services/Support/Support";
import Technology from "@/sections/home/Technology/Technology";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <InnerHero variant="services" eyebrow="Our services" title="Complete Website QA," accent="From Design to Functionality." text="We review the parts of your website that shape the real user experience — layout, responsiveness, content, interactions and performance." secondary="How It Works" secondaryHref="/how-it-works" />
      <ServiceGrid />
      <Platforms />
      <Support />
      <Technology />
    </>
  );
}
