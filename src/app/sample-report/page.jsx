import InnerHero from "@/components/ui/InnerHero/InnerHero";
import Steps from "@/sections/sample/Steps/Steps";
import ReportViewer from "@/sections/sample/ReportViewer/ReportViewer";
import Includes from "@/sections/sample/Includes/Includes";
import Journey from "@/sections/sample/Journey/Journey";
import FinalCta from "@/sections/sample/FinalCta/FinalCta";

export const metadata = {
  title: "Sample QA Report",
  description: "Explore a sample SignalReach website QA report — screenshots, findings, priorities and practical recommendations — and download the example Word report.",
};

export default function SampleReportPage() {
  return (
    <>
      <InnerHero
        variant="sample"
        eyebrow="Sample QA report"
        title="See Exactly What Your Website"
        accent="QA Report Will Look Like."
        text="Before you submit your website, explore a sample SignalReach QA report and see how we document design, usability, responsiveness, content and functionality issues with screenshots and practical recommendations."
        primary="Get Your Free QA Report"
        primaryHref="/free-report"
        secondary="View Sample Report"
        secondaryHref="#report"
      />
      <Steps />
      <ReportViewer />
      <Includes />
      <Journey />
      <FinalCta />
    </>
  );
}
