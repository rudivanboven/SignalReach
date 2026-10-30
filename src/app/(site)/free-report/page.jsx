import InnerHero from "@/components/ui/InnerHero/InnerHero";
import AuditForm from "@/sections/report/AuditForm/AuditForm";
import Highlights from "@/sections/report/Highlights/Highlights";

export const metadata = { title: "Website QA Report — $45" };

export default function FreeReportPage() {
  return (
    <>
      <InnerHero variant="report" eyebrow="Website QA report — $45" title="Show Us Your Website." accent="We’ll Show You What To Improve." text="Submit your website for a manual QA review covering design, layout, responsiveness, content, usability and functionality. No payment is required when you submit; we’ll send a $45 invoice before delivering the completed report." primary="Start My Website Review" primaryHref="#audit-form" secondary="See How It Works" secondaryHref="/how-it-works" />
      <Highlights />
      <div id="audit-form" style={{ scrollMarginTop: 56 }}>
        <AuditForm />
      </div>
    </>
  );
}
