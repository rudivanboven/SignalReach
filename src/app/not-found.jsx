import Link from "next/link";
import Header from "@/components/global/Header/Header";
import Footer from "@/components/global/Footer/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container" style={{textAlign:"center", padding:"80px 0"}}>
            <span className="eyebrow">404</span>
            <h1>That signal went somewhere else.</h1>
            <p style={{maxWidth:600, margin:"22px auto 30px"}}>The page you’re looking for could not be found.</p>
            <Link className="btnPrimary" href="/">Back to Home</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
