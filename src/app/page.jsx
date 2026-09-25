import Hero from "@/sections/home/Hero/Hero";
import Stats from "@/sections/home/Stats/Stats";
import WhatWeDo from "@/sections/home/WhatWeDo/WhatWeDo";
import Process from "@/sections/home/Process/Process";
import AuditPreview from "@/sections/home/AuditPreview/AuditPreview";
import Technology from "@/sections/home/Technology/Technology";
import FinalCTA from "@/sections/home/FinalCTA/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <WhatWeDo />
      <Process />
      <AuditPreview />
      <Technology />
      <FinalCTA />
    </>
  );
}
