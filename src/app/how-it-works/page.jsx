import InnerHero from "@/components/ui/InnerHero/InnerHero";
import DetailedProcess from "@/sections/how/DetailedProcess/DetailedProcess";
import Deliverables from "@/sections/how/Deliverables/Deliverables";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <>
      <InnerHero variant="process" eyebrow="How it works" title="From Website Review to" accent="a Clear Action Plan." text="A simple, human-led process that turns website issues into clear, prioritized recommendations." secondary="See What We Check" secondaryHref="/services" />
      <DetailedProcess />
      <Deliverables />
      <FinalCTA />
    </>
  );
}
