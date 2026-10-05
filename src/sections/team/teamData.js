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
// `team` is the Leadership Team (Rudi + Ayush) — the only members with profile pages.

export const team = [
  {
    slug: "rudi-van-boven",
    accent: "gold",
    roleIcon: "star",
    name: "Rudi Van Boven",
    role: "Founder & Chief Executive Officer",
    cardRole: "Founder & CEO",
    image: "/founder.jpeg",
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
];

export const getMember = (slug) => team.find((m) => m.slug === slug);
