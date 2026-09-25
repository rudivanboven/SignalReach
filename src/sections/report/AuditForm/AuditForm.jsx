"use client";

import { useState } from "react";
import styles from "./AuditForm.module.css";

const benefits = [
  "Page & section layout",
  "UI design quality",
  "Mobile responsiveness",
  "Images & media",
  "Navigation, buttons & forms",
  "Content presentation",
  "UX & conversion flow",
  "Basic performance & SEO",
];

export default function AuditForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className={`${styles.section} gridNoise`}>
      <div className={`container ${styles.grid}`}>
        <aside className={styles.left}>
          <span className="eyebrow">Complete website QA</span>
          <h1>Get Your Free Website QA Report</h1>
          <p className={styles.intro}>We’ll manually review your website across design, layout, responsiveness, images, content, usability and functionality—then show you exactly what should be improved.</p>
          <h6>What’s included</h6>
          <div className={styles.benefits}>
            {benefits.map((item) => <span key={item}>✓ {item}</span>)}
          </div>
          <div className={styles.trust}>
            <strong>Target delivery within 6–12 hours</strong>
            <span>No obligation • No spam • Personalized recommendations</span>
          </div>
          <div className={styles.preview}>
            <small>Example QA findings</small>
            <p>Navigation spacing breaks at tablet width.</p>
            <p>Hero image crop hides important content on mobile.</p>
            <p>Form submission gives visitors no confirmation.</p>
          </div>
        </aside>

        <div className={styles.formCard}>
          {submitted ? (
            <div className={styles.success}>
              <span>✓</span>
              <h2>Request captured.</h2>
              <p>This static demo is working. The next development phase can connect this form to email and database delivery.</p>
              <button className="btnPrimary" onClick={() => setSubmitted(false)}>Submit another website</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.formHead}>
                <div><span>01</span><small>Contact</small></div>
                <div><span>02</span><small>Website</small></div>
                <div><span>03</span><small>Challenges</small></div>
              </div>
              <h3>Tell us about your website.</h3>
              <p>We’ll use this information to keep the review focused on your actual goals.</p>

              <div className={styles.fields}>
                <label>Full Name<input required placeholder="John Smith" /></label>
                <label>Business Email<input required type="email" placeholder="john@company.com" /></label>
                <label>Company Name<input required placeholder="Your Business Name" /></label>
                <label className={styles.full}>Website URL<input required type="url" placeholder="https://yourwebsite.com" /></label>
                <label>Industry
                  <select required defaultValue=""><option value="" disabled>Select industry</option><option>Professional Services</option><option>Construction</option><option>Healthcare</option><option>Real Estate</option><option>Finance</option><option>E-commerce</option><option>Manufacturing</option><option>Technology</option><option>Other</option></select>
                </label>
                <label>Main Goal
                  <select required defaultValue=""><option value="" disabled>Select goal</option><option>Improve Usability</option><option>Fix Mobile Issues</option><option>Improve Design</option><option>Fix Functionality</option><option>Increase Conversions</option><option>Complete Website Redesign</option></select>
                </label>
                <label className={styles.full}>What would you like us to check?
                  <select required defaultValue=""><option value="" disabled>Select review focus</option><option>Full Website QA</option><option>UI/UX Review</option><option>Mobile Responsiveness</option><option>Design & Layout</option><option>Functionality</option><option>Conversion Review</option><option>Not Sure — Review Everything</option></select>
                </label>
                <label className={styles.full}>Anything specific you want us to review?
                  <textarea rows="5" placeholder="Tell us about any pages, devices or interactions you are concerned about..." />
                </label>
              </div>
              <button className={`btnPrimary ${styles.submit}`} type="submit">Review My Website <span>↗</span></button>
              <small className={styles.consent}>By submitting this form, you agree to be contacted regarding your website review.</small>
              <div className={styles.consultation}>
                <div><strong>Want a faster conversation?</strong><span>Book a 15-minute strategy call and walk through the goal together.</span></div>
                <button type="button" className="btnGhost">Schedule Consultation</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
