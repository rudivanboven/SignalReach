// QA categories shown beside the live inspection visual.
export const categories = [
  { key: "design", icon: "layout", title: "Design Consistency", text: "Spacing, alignment, typography and component consistency." },
  { key: "responsive", icon: "smartphone", title: "Responsive Behavior", text: "Layouts that hold together on desktop, tablet and mobile." },
  { key: "media", icon: "image", title: "Images & Media", text: "Cropping, aspect ratios, quality and broken assets." },
  { key: "navigation", icon: "cursor", title: "Buttons & Navigation", text: "Destinations, menus, tap targets and link behavior." },
  { key: "forms", icon: "form", title: "Forms & Interactions", text: "Validation, feedback, success states and popups." },
  { key: "content", icon: "text", title: "Content & UX", text: "Hierarchy, clarity, readability and page flow." },
];

// Issues in the order the inspection reveals them (desktop top-to-bottom, then mobile).
export const issues = [
  { key: "nav", device: "desktop", title: "Navigation", label: "Menu behavior unclear", detail: "tap target unclear", text: "Mobile menu or navigation behavior is unclear.", severity: "medium", category: "navigation" },
  { key: "hierarchy", device: "desktop", title: "Content Hierarchy", label: "Key message buried", detail: "headline lighter than body", text: "Important information is visually buried.", severity: "medium", category: "content" },
  { key: "cta", device: "desktop", title: "Broken CTA", label: "CTA leads nowhere", detail: 'href="#"', text: "Primary button does not lead to the expected action.", severity: "critical", category: "navigation" },
  { key: "spacing", device: "desktop", title: "Spacing Issue", label: "Inconsistent padding", detail: "40px vs 18px", text: "Section padding becomes inconsistent at a breakpoint.", severity: "medium", category: "design" },
  { key: "form", device: "desktop", title: "Form Experience", label: "Missing confirmation", detail: "no success state", text: "Validation / success state is missing or confusing.", severity: "high", category: "forms" },
  { key: "overflow", device: "phone", title: "Mobile Overflow", label: "Button off-screen", detail: "+22px past edge", text: "A button extends outside the screen.", severity: "critical", category: "responsive" },
  { key: "crop", device: "phone", title: "Image Crop", label: "Subject cropped", detail: "focal point cut off", text: "Important image content disappears on tablet/mobile.", severity: "high", category: "media" },
  { key: "cards", device: "phone", title: "Responsive Layout", label: "Cards uneven", detail: "grid collapses", text: "Cards break or become uneven on smaller screens.", severity: "high", category: "responsive" },
];

export const severities = [
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
];
