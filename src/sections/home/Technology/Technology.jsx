import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Technology.module.css";

const capabilities = [
  { icon:"layout", group:"Frontend", title:"React", text:"Component-based implementation, reusable UI patterns and behavior review." },
  { icon:"arrowUpRight", group:"Framework", title:"Next.js", text:"Routing, layout structure, rendering behavior and modern frontend experience." },
  { icon:"cursor", group:"No-code", title:"Webflow", text:"Layout, CMS, responsive behavior and interactions for marketing websites." },
  { icon:"report", group:"CMS", title:"WordPress", text:"Theme consistency, content layouts, components and page-level QA." },
  { icon:"target", group:"Commerce", title:"Shopify", text:"Storefront design, product journeys, mobile usability and conversion flow." },
  { icon:"scan", group:"Quality assurance", title:"Frontend QA", text:"Implementation issues, broken layouts, spacing and visual inconsistencies." },
  { icon:"smartphone", group:"Cross-device", title:"Responsive QA", text:"Testing across desktop, tablet, mobile and small-screen breakpoints." },
  { icon:"check", group:"Interactions", title:"Functional Testing", text:"Buttons, forms, links, menus, popups and important user flows." },
  { icon:"cursor", group:"Experience", title:"UI / UX Review", text:"Usability, clarity, visual hierarchy, navigation and page flow." },
  { icon:"target", group:"Growth", title:"Conversion Review", text:"CTA clarity, layout flow, trust cues and friction affecting leads or sales." },
  { icon:"layout", group:"Consistency", title:"Design System Review", text:"Typography, color, spacing and component consistency across the website." },
  { icon:"report", group:"Content systems", title:"CMS & Form QA", text:"Dynamic content, editing patterns, submissions and interaction feedback." },
];

export default function Technology() {
  return <section className={`${styles.section} section`}>
    <div className={styles.decor} aria-hidden="true"><span/><span/></div>
    <div className="container">
      <SectionHeading eyebrow="Technology & implementation" title="We Understand the Platforms Behind the Problems We Identify." text="The review is more useful when recommendations are grounded in how modern websites are actually designed, built, maintained and improved." align="center" />
      <div className={styles.grid}>{capabilities.map((item,index)=><Reveal key={item.title} delay={(index%4)*70} className={styles.cell}><article className={styles.card}><div className={styles.top}><span className={styles.icon}><Icon name={item.icon}/></span><span className={styles.number}>{String(index+1).padStart(2,"0")}</span></div><span className={styles.group}>{item.group}</span><h3>{item.title}</h3><p>{item.text}</p><span className={styles.edge} aria-hidden="true"/></article></Reveal>)}</div>
    </div>
  </section>;
}
