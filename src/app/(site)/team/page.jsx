import InnerHero from "@/components/ui/InnerHero/InnerHero";
import Expertise from "@/sections/team/Expertise/Expertise";
import Members from "@/sections/team/Members/Members";
import Collaboration from "@/sections/team/Collaboration/Collaboration";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <>
      <InnerHero variant="team" eyebrow="Our team" title="People Behind" accent="Better Website Experiences." text="SignalReach combines website QA, UI/UX thinking and real implementation experience to identify issues that automated tools often miss." secondary="About SignalReach" secondaryHref="/about" />
      <Expertise />
      <Members />
      <Collaboration />
    </>
  );
}
