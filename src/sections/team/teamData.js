// Single source for team content — used by the Team page cards and the
// individual profile pages at /team/[slug].
//
// Fields:
//   slug       URL segment: /team/<slug>
//   name, role
//   cardRole   optional shorter role for the Team page card (defaults to role)
//   image      put photos in the project-root /public/ folder and set e.g. "/rudi-van-boven.jpg".
//              Any size works (cropped to fill, centred). While null a placeholder is shown.
//   shortBio   2–3 line introduction shown on the Team page card
//   intro      one-line introduction under the name on the profile page
//   bio        profile biography sections: [{ title, text }]
//   imagePosition  optional object-position for the photo crop (default "center")
//   eyebrow    optional label above the name on the profile page (default "The team")
//   strengths  list of short strength labels
//   experience optional background entries: [{ title, meta, text }]
//   technologies  optional list of tool/technology names
//   linkedin   full LinkedIn profile URL, or null until one is supplied
//              (the button then renders as an inactive placeholder)
//   accent     role badge colour on the Team page: "gold" | "cyan" | "teal" | "blue"
//   roleIcon   icon name (components/ui/Icon) shown in the role badge
//
// `team` is the Leadership Team — the only members with profile pages.
// `specialists` (bottom of file) are TEMPORARY placeholder profiles.

export const team = [
  {
    slug: "rudi-van-boven",
    accent: "gold",
    roleIcon: "star",
    name: "Rudi Van Boven",
    role: "Founder & Chief Executive Officer",
    cardRole: "Founder & CEO",
    image: "/founder.png",
    imagePosition: "center",
    shortBio: "Rudi is a digital entrepreneur and innovation enthusiast focused on website strategy, emerging technology and turning new digital ideas into practical business opportunities.",
    intro: "Digital entrepreneur and innovation enthusiast focused on turning emerging ideas into practical digital opportunities.",
    bio: [
      {
        title: "Digital Innovation",
        text: "Rudi is a digital entrepreneur and innovation enthusiast with a passion for creating meaningful online experiences. He focuses on identifying new website concepts, digital business opportunities and emerging technologies that can improve engagement, efficiency and growth.",
      },
      {
        title: "Technology & Experience",
        text: "His interests span web innovation, user experience, online platforms and AI-driven solutions. He continually explores how technology can improve customer interactions, streamline processes and create new business opportunities.",
      },
      {
        title: "Strategy Into Action",
        text: "With a forward-thinking approach and a strong interest in continuous learning, Rudi combines strategic thinking with practical execution. His work centers on developing ideas into useful digital concepts and scalable opportunities.",
      },
    ],
    strengths: [
      "Digital Innovation",
      "Website Strategy",
      "Product Ideation",
      "User Experience Thinking",
      "Business Development",
      "Growth Strategy",
      "Technology Trends",
      "AI & Automation",
    ],
    linkedin: null,
  },
  {
    slug: "ayush-thakur",
    accent: "cyan",
    roleIcon: "code",
    name: "Ayush Thakur",
    role: "Chief AI Technology Officer",
    eyebrow: "Leadership",
    image: "/baner.webp",
    imagePosition: "56% center",
    shortBio: "Ayush Thakur is a frontend and web development specialist focused on building modern, responsive, and high-performing websites using Webflow, React, Next.js, and scalable development workflows.",
    intro: "Ayush Thakur is a frontend and web development specialist with 8+ years of experience building modern, responsive, and performance-focused digital experiences across Webflow, React, Next.js, and other scalable web technologies.",
    bio: [
      {
        title: "Technical Leadership",
        text: "As Chief AI Technology Officer, Ayush leads technical execution at SignalReach and sets the standard for implementation quality. He translates business goals and design intent into practical, buildable web solutions — making sure every recommendation can be delivered cleanly, reliably and at production quality.",
      },
      {
        title: "Web Development Expertise",
        text: "His work centers on Webflow, React and Next.js, alongside Squarespace and modern frontend tooling. He specializes in responsive frontend systems, precise UI implementation, CMS development, smooth interactions and animation, and performance-focused builds that hold up across every screen size.",
      },
      {
        title: "Modern Workflow & Delivery",
        text: "Ayush works with modern, AI-assisted development workflows — including Claude, OpenAI Codex and Cursor — together with tools such as GitHub and Vercel. This lets him deliver high-quality websites efficiently while keeping codebases clean, reliable and ready to scale.",
      },
      {
        title: "Practical Execution",
        text: "From full website redesigns to targeted fixes, he handles the hands-on detail: turning Figma concepts into production-ready Webflow, React and Next.js builds, structuring frontend systems, connecting API integrations and resolving bugs that affect how a site looks, works and performs.",
      },
    ],
    strengths: [
      "Frontend Development",
      "Webflow Development",
      "React & Next.js Implementation",
      "Responsive Web Design",
      "UI / UX Execution",
      "CMS Development",
      "API Integrations",
      "Animation & Interaction Design",
      "Performance Optimization",
      "AI-Assisted Development Workflows",
    ],
    experience: [
      {
        title: "Frontend & Webflow Development",
        meta: "Independent · Self-employed",
        text: "Delivering modern website builds for clients end to end — Webflow development, responsive frontend UI in HTML, CSS and JavaScript, React and Next.js implementation, and API integrations, with a consistent focus on clean UI, strong performance and client-focused delivery.",
      },
    ],
    technologies: ["Webflow", "Squarespace", "React", "Next.js", "JavaScript", "HTML/CSS", "Figma", "Supabase", "GitHub", "Vercel", "Claude", "OpenAI Codex", "Cursor"],
    linkedin: null,
  },
  {
    slug: "alex-carey",
    accent: "teal",
    roleIcon: "user",
    name: "Alex Carey",
    role: "Head of People & Business Operations",
    image: "/alex.png",
    imagePosition: "center 30%",
    shortBio: "Alex leads SignalReach’s people and business operations, supporting recruitment, project coordination and the first review of new website requests before they move into the full manual QA process.",
    intro: "Alex brings together people, business operations and project coordination at SignalReach, helping ensure that every new opportunity starts with the right context, clear communication and an organized first review.",
    bio: [
      {
        title: "People & Recruitment",
        text: "Alex supports the people side of SignalReach, helping identify and coordinate new team members as the company grows. She focuses on creating a strong connection between recruitment, internal communication and the needs of the business.",
      },
      {
        title: "Business Operations",
        text: "Alongside HR, Alex helps lead business operations and coordinates the early stages of new projects. She works with incoming opportunities to understand the business context, project requirements and what the client is looking to improve.",
      },
      {
        title: "First Website Review",
        text: "When a new website enters the SignalReach process, Alex performs the initial high-level review. This first pass helps identify the areas that need attention, clarify the scope and prepare the project before it moves into the deeper, full manual QA workflow.",
      },
      {
        title: "Connecting Clients and the QA Team",
        text: "Alex helps create a smooth handoff between the initial business conversation and the complete review process. Her role helps ensure that the QA team begins with clear context, priorities and a better understanding of the website and its goals.",
      },
    ],
    strengths: [
      "People Operations",
      "Recruitment",
      "Business Operations",
      "Project Intake",
      "Client Coordination",
      "Initial Website Review",
      "Team Coordination",
      "Process Management",
    ],
    linkedin: null,
  },
];

// TEMPORARY PLACEHOLDER PROFILES — demo names, not real SignalReach team
// members. They exist for layout only until real details are supplied.
// Replace name/role/text, set `image` (e.g. "/team/<name>.jpg") and remove
// `temporary: true`. They have no profile pages. "temporary" is never shown
// on the site.
export const specialists = [
  {
    temporary: true,
    name: "Sophie Bennett",
    role: "UI/UX & Usability Specialist",
    accent: "cyan",
    roleIcon: "layout",
    image: null,
    text: "Focuses on layout, navigation, visual hierarchy and interaction patterns to help create clearer, easier-to-use website experiences.",
  },
  {
    temporary: true,
    name: "Daniel Brooks",
    role: "Website QA Specialist",
    accent: "teal",
    roleIcon: "scan",
    image: null,
    text: "Supports detailed page-by-page website reviews, checking content, links, forms, responsive behavior and common functionality issues.",
  },
  {
    temporary: true,
    name: "Maya Collins",
    role: "Content & Conversion Reviewer",
    accent: "gold",
    roleIcon: "text",
    image: null,
    text: "Reviews messaging, content presentation, calls to action and user journeys to identify opportunities for stronger clarity and engagement.",
  },
  {
    temporary: true,
    name: "Ethan Parker",
    role: "Frontend & Responsive Specialist",
    accent: "blue",
    roleIcon: "smartphone",
    image: null,
    text: "Reviews frontend behavior across desktop, tablet and mobile, focusing on responsive consistency, interactions and implementation quality.",
  },
];

export const getMember = (slug) => team.find((m) => m.slug === slug);
