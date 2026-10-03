import InnerHero from "@/components/ui/InnerHero/InnerHero";
import AuditForm from "@/sections/report/AuditForm/AuditForm";
import Highlights from "@/sections/report/Highlights/Highlights";

export const metadata = { title: "Free Website QA Report" };

export default function FreeReportPage() {
  return (
    <>
      <InnerHero variant="report" eyebrow="Free website QA report" title="Show Us Your Website." accent="We’ll Show You What To Improve." text="Submit your website and receive a manual QA review covering design, layout, responsiveness, content, usability and functionality." primary="Start My Free Review" primaryHref="#audit-form" secondary="See How It Works" secondaryHref="/how-it-works" />
      <Highlights />
      <div id="audit-form" style={{ scrollMarginTop: 56 }}>
        <AuditForm />
      </div>
    </>
  );
}
