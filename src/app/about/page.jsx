import InnerHero from "@/components/ui/InnerHero/InnerHero";
import Story from "@/sections/about/Story/Story";
import Values from "@/sections/about/Values/Values";
import Technology from "@/sections/home/Technology/Technology";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <InnerHero variant="about" eyebrow="About SignalReach" title="Human-Led Website QA With" accent="Real Implementation Experience." text="We review websites from both the user’s perspective and the developer’s perspective, helping teams understand what should improve and why." secondary="See What We Check" secondaryHref="/services" />
      <Story />
      <Values />
      <Technology />
      <FinalCTA />
    </>
  );
}
