import { Manrope, Inter, DM_Sans } from "next/font/google";
import "./globals.css";

// Headings & statistics
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Body copy, descriptions, forms
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Buttons, navigation, links, UI labels
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "SignalReach — Complete Website QA & Improvement Report",
    template: "%s | SignalReach",
  },
  description:
    "Manual, page-by-page website QA covering design, layout, responsive behavior, content, usability and functionality.",
};

// Root layout only owns <html>/<body>, fonts and global tokens.
// The public Header/Footer live in app/(site)/layout.jsx so the private
// /super-admin area can render its own shell.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
