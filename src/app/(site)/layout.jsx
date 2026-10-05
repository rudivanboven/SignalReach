import Header from "@/components/global/Header/Header";
import Footer from "@/components/global/Footer/Footer";

// Public website shell: shared Header + Footer around every marketing page.
// (The private /super-admin area has its own layout and never renders these.)
export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
