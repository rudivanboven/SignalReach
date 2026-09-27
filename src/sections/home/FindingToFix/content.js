export const journeySteps = [
  {
    key: "before",
    label: "Before",
    title: "A typical mobile hero",
    text: "The page looks acceptable at first glance. The primary call to action sits low on the screen with soft contrast, so most visitors never notice it without scrolling.",
  },
  {
    key: "issue",
    label: "Issue found",
    title: "CTA is difficult to find on mobile",
    text: "The review flags the button as a high-impact finding: it sits below the fold on common phone sizes, blends into the background and competes with a large image for attention.",
  },
  {
    key: "recommend",
    label: "Recommendation",
    title: "Move primary CTA higher and improve contrast",
    text: "Bring the action into the first screen, shorten the hero image, and use a high-contrast button style so the next step is obvious before anyone scrolls.",
  },
  {
    key: "improved",
    label: "Improved",
    title: "The corrected version",
    text: "The CTA now sits in the first screen with clear contrast and breathing room. Every important finding in your report follows this same path: problem, priority, recommendation.",
  },
];

// Illustrative examples of how findings are written. Not client results.
export const examples = [
  { icon: "smartphone", tag: "Mobile Layout", severity: "critical", severityLabel: "Critical", problem: "Content overlaps at smaller widths.", fix: "Rebuild grid behavior for mobile breakpoints." },
  { icon: "target", tag: "Hero CTA", severity: "high", severityLabel: "High", problem: "Primary action is visually buried.", fix: "Improve hierarchy and CTA placement." },
  { icon: "image", tag: "Images", severity: "high", severityLabel: "High", problem: "Important content is cropped on tablet.", fix: "Adjust aspect ratio and responsive positioning." },
  { icon: "form", tag: "Form UX", severity: "medium", severityLabel: "Medium", problem: "User receives no clear success confirmation.", fix: "Add confirmation state and next-step messaging." },
];

export const priorities = [
  { key: "critical", label: "Critical", text: "Functionality / broken user flow" },
  { key: "high", label: "High", text: "Responsive / conversion problem" },
  { key: "medium", label: "Medium", text: "Visual consistency / UX issue" },
  { key: "quick", label: "Quick Win", text: "Small improvement with immediate benefit" },
];
