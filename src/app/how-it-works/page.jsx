import InnerHero from "@/components/ui/InnerHero/InnerHero";
import DetailedProcess from "@/sections/how/DetailedProcess/DetailedProcess";
import Deliverables from "@/sections/how/Deliverables/Deliverables";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <>
      <InnerHero eyebrow="How SignalReach works" title="A complete website QA process, from first click to final recommendation." text="We manually review your website page by page, test it across devices, and document every important design, usability and functional issue." secondary="See What We Check" secondaryHref="/services" />
      <DetailedProcess />
      <Deliverables />
      <FinalCTA />
    </>
  );
}
