import InnerHero from "@/components/ui/InnerHero/InnerHero";
import Workflow from "@/sections/how/Workflow/Workflow";
import Receive from "@/sections/how/Receive/Receive";
import WhyHuman from "@/sections/how/WhyHuman/WhyHuman";
import AfterReview from "@/sections/how/AfterReview/AfterReview";

export const metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <>
      <InnerHero variant="process" eyebrow="How it works" title="From Website Review to" accent="a Clear Action Plan." text="A simple, human-led process that turns website issues into clear, prioritized recommendations." secondary="See What We Check" secondaryHref="/services" />
      <Workflow />
      <Receive />
      <WhyHuman />
      <AfterReview />
    </>
  );
}
