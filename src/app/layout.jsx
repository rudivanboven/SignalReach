import { Manrope, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/global/Header/Header";
import Footer from "@/components/global/Footer/Footer";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${dmSans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
