import Reveal from "@/components/ui/Reveal/Reveal";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./ServiceGrid.module.css";

const services = [
  ["Website QA", "Manual page-by-page review of design, layout, images, content, interactions and usability."],
  ["UI/UX Review", "Visual hierarchy, consistency, page flow, navigation clarity and conversion friction."],
  ["Responsive QA", "Section-level checks across desktop, tablet, mobile and small mobile screens."],
  ["Functional Testing", "Buttons, links, forms, menus, dropdowns, tabs, popups and key user flows."],
  ["Website Redesign", "Translate the findings into a clearer, more consistent and more effective interface."],
  ["Frontend Development", "Implement approved improvements in responsive, production-ready frontend code."],
  ["Website Improvements", "Focused fixes for layouts, components, content presentation and conversion paths."],
];

export default function ServiceGrid() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Core services" title="Find the issues. Understand the impact. Improve the website." text="Our core product is practical website QA backed by the design and development experience needed to recommend realistic fixes." />
        <div className={styles.grid}>
          {services.map((item,index) => (
            <Reveal key={item[0]} delay={(index%3)*70}>
              <article>
                <span>0{index+1}</span>
                <h3>{item[0]}</h3>
                <p>{item[1]}</p>
                <div className={styles.line} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
