import InnerHero from "@/components/ui/InnerHero/InnerHero";
import Story from "@/sections/about/Story/Story";
import Values from "@/sections/about/Values/Values";
import Technology from "@/sections/home/Technology/Technology";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <InnerHero eyebrow="About SignalReach" title="We review websites from the perspective of both the user and the developer." text="SignalReach combines practical QA, design review, responsive testing, UX thinking and implementation knowledge in one clear improvement report." secondary="See What We Check" secondaryHref="/services" />
      <Story />
      <Values />
      <Technology />
      <FinalCTA />
    </>
  );
}
