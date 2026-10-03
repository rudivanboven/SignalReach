"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./AuditForm.module.css";

// Free report request — animated intro, live 3-step indicator and a layered
// form card (Contact / Website / Challenge) with "Other" fields that reveal
// when chosen.
//
// NOTE: submission is not connected to any backend yet — handleSubmit only
// switches to the success state. Wire it to email/CRM before launch.

const industries = ["Professional Services", "Construction", "Healthcare", "Real Estate", "Finance", "E-commerce", "Manufacturing", "Technology", "Hospitality", "Education", "Other"];
const services = ["Complete Website QA", "Website Redesign", "Performance / UX Review", "Other"];
const checks = ["Full Website QA", "UI/UX Review", "Mobile Responsiveness", "Design & Layout", "Functionality", "Conversion Review", "Not Sure — Review Everything", "Other"];

const included = ["Page & section layout", "UI design quality", "Mobile responsiveness", "Images & media", "Navigation, buttons & forms", "Content presentation", "UX & conversion flow", "Basic performance & SEO"];

const steps = [
  { id: "contact", label: "Contact", hint: "Who should we send the report to?" },
  { id: "website", label: "Website", hint: "Which website should we review?" },
  { id: "challenge", label: "Challenge", hint: "What would you like us to focus on?" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = "(https?://)?([\\w-]+\\.)+[a-zA-Z]{2,}(/\\S*)?";
const URL_TEST = new RegExp(`^${URL_PATTERN}$`);

const initial = { first: "", last: "", email: "", phone: "", url: "", industry: "", industryOther: "", service: "", serviceOther: "", checks: [], checkOther: "", message: "" };

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Smoothly expanding container for conditional "Other" inputs. The input is
// disabled while hidden so it is neither required nor submitted.
function Reveal({ open, children }) {
  const ref = useRef(null);
  const wasOpen = useRef(open);
  useEffect(() => {
    if (open && !wasOpen.current) ref.current?.querySelector("input")?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);
  return (
    <div ref={ref} className={styles.reveal} data-open={open || undefined} aria-hidden={!open}>
      <div>{children(!open)}</div>
    </div>
  );
}

function Field({ label, optional, full, children }) {
  return (
    <label className={`${styles.field} ${full ? styles.full : ""}`}>
      <span className={styles.label}>{label}{optional && <em>Optional</em>}</span>
      {children}
    </label>
  );
}

export default function AuditForm() {
  const [ref, inView] = useInView();
  const [data, setData] = useState(initial);
  const [focusGroup, setFocusGroup] = useState("contact");
  const [submitted, setSubmitted] = useState(false);
  const [checksError, setChecksError] = useState(false);
  const groupRefs = useRef({});

  const set = (key) => (e) => setData((d) => ({ ...d, [key]: e.target.value }));
  const toggleCheck = (value) => {
    setChecksError(false);
    setData((d) => ({ ...d, checks: d.checks.includes(value) ? d.checks.filter((c) => c !== value) : [...d.checks, value] }));
  };

  const done = {
    contact: Boolean(data.first.trim() && data.last.trim() && EMAIL.test(data.email)),
    website: Boolean(URL_TEST.test(data.url.trim()) && data.industry && (data.industry !== "Other" || data.industryOther.trim())),
    challenge: Boolean(data.service && (data.service !== "Other" || data.serviceOther.trim()) && data.checks.length && (!data.checks.includes("Other") || data.checkOther.trim())),
  };
  const doneCount = Object.values(done).filter(Boolean).length;
  const activeIndex = steps.findIndex((s) => s.id === focusGroup);

  const goTo = (id) => {
    const group = groupRefs.current[id];
    if (!group) return;
    group.scrollIntoView({ behavior: "smooth", block: "center" });
    group.querySelector("input, select, textarea")?.focus({ preventScroll: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.checks.length) {
      setChecksError(true);
      goTo("challenge");
      return;
    }
    setSubmitted(true);
  };

  const reset = () => { setData(initial); setSubmitted(false); setFocusGroup("contact"); };

  const groupProps = (id) => ({
    ref: (node) => { groupRefs.current[id] = node; },
    className: styles.group,
    "data-done": done[id] || undefined,
    "data-active": focusGroup === id || undefined,
    onFocus: () => setFocusGroup(id),
  });

  return (
    <section ref={ref} className={styles.section} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <svg className={styles.lines} viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path className={styles.line} d="M-40 240 C 260 180 460 320 760 260 S 1220 140 1480 200" />
          <path className={styles.lineRun} pathLength="1" d="M-40 240 C 260 180 460 320 760 260 S 1220 140 1480 200" />
          <path className={styles.line} d="M-40 700 C 320 640 620 780 940 720 S 1300 640 1480 680" />
          <path className={`${styles.lineRun} ${styles.lineRunWarm}`} pathLength="1" d="M-40 700 C 320 640 620 780 940 720 S 1300 640 1480 680" />
        </svg>
        {[[7, 18], [93, 12], [88, 58], [4, 70], [52, 8], [70, 92]].map(([x, y], i) => (
          <i key={`${x}-${y}`} className={styles.dot} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -1.9}s` }} />
        ))}
      </div>

      <div className="container">
        {/* ---------- A. Intro ---------- */}
        <div className={styles.intro}>
          <span className="eyebrow">Complete website QA</span>
          <h2>Request your <span>free website QA report.</span></h2>
          <p>Three short steps. We’ll manually review your website across design, layout, responsiveness, content, usability and functionality — then show you exactly what to improve.</p>
          <ul className={styles.trust}>
            <li><Icon name="user" />Human-led review</li>
            <li><Icon name="clock" />Target delivery within 6–12 hours</li>
            <li><Icon name="check" />No obligation, no spam</li>
          </ul>
        </div>

        {/* ---------- B. Step indicator ---------- */}
        <ol className={styles.steps} style={{ "--fill": doneCount / steps.length }} aria-label="Form progress">
          <li className={styles.stepTrack} aria-hidden="true"><span /></li>
          {steps.map((s, i) => (
            <li key={s.id} style={{ "--i": i }}>
              <button
                type="button"
                className={styles.step}
                data-done={done[s.id] || undefined}
                data-active={!submitted && i === activeIndex ? true : undefined}
                onClick={() => !submitted && goTo(s.id)}
                aria-current={!submitted && i === activeIndex ? "step" : undefined}
              >
                <span className={styles.stepNum}>
                  {done[s.id] ? <Icon name="check" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.stepText}>
                  <strong>{s.label}</strong>
                  <small>{done[s.id] ? "Complete" : s.hint}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>

        {/* ---------- C. Layered form ---------- */}
        <div className={styles.layout}>
          <div className={styles.stack}>
            <div className={styles.card}>
              {submitted ? (
                <div className={styles.success} role="status">
                  <span className={styles.successIcon}><Icon name="check" /></span>
                  <h3>Thanks, {data.first.trim() || "there"} — your request is in.</h3>
                  <p>We’ll review <strong>{data.url.trim()}</strong> and send your QA report to <strong>{data.email}</strong>.</p>
                  <button type="button" className={styles.again} onClick={reset}>Submit another website</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <fieldset {...groupProps("contact")}>
                    <legend className={styles.groupHead}>
                      <span className={styles.groupNum}>{done.contact ? <Icon name="check" /> : "01"}</span>
                      <span><strong>Contact</strong><small>{steps[0].hint}</small></span>
                    </legend>
                    <div className={styles.fields}>
                      <Field label="First Name"><input required autoComplete="given-name" placeholder="John" value={data.first} onChange={set("first")} /></Field>
                      <Field label="Last Name"><input required autoComplete="family-name" placeholder="Smith" value={data.last} onChange={set("last")} /></Field>
                      <Field label="Your Email"><input required type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={data.email} onChange={set("email")} /></Field>
                      <Field label="Phone Number" optional><input type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 555 000 0000" value={data.phone} onChange={set("phone")} /></Field>
                    </div>
                  </fieldset>

                  <fieldset {...groupProps("website")}>
                    <legend className={styles.groupHead}>
                      <span className={styles.groupNum}>{done.website ? <Icon name="check" /> : "02"}</span>
                      <span><strong>Website</strong><small>{steps[1].hint}</small></span>
                    </legend>
                    <div className={styles.fields}>
                      <Field label="Website URL">
                        <span className={styles.withIcon}>
                          <Icon name="link" />
                          <input required inputMode="url" autoComplete="url" pattern={URL_PATTERN} title="Enter a website address, e.g. yourwebsite.com" placeholder="yourwebsite.com" value={data.url} onChange={set("url")} />
                        </span>
                      </Field>
                      <Field label="Industry">
                        <select required value={data.industry} onChange={set("industry")}>
                          <option value="" disabled>Select industry</option>
                          {industries.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </Field>
                      <Reveal open={data.industry === "Other"}>
                        {(hidden) => (
                          <Field label="Please specify your industry" full>
                            <input required disabled={hidden} placeholder="e.g. Non-profit, Legal, Travel" value={data.industryOther} onChange={set("industryOther")} />
                          </Field>
                        )}
                      </Reveal>
                    </div>
                  </fieldset>

                  <fieldset {...groupProps("challenge")}>
                    <legend className={styles.groupHead}>
                      <span className={styles.groupNum}>{done.challenge ? <Icon name="check" /> : "03"}</span>
                      <span><strong>Challenge</strong><small>{steps[2].hint}</small></span>
                    </legend>
                    <div className={styles.fields}>
                      <Field label="Service Needed" full>
                        <div className={styles.segment} role="radiogroup" aria-label="Service needed">
                          {services.map((o) => (
                            <label key={o} className={styles.option} data-checked={data.service === o || undefined}>
                              <input type="radio" name="service" value={o} required checked={data.service === o} onChange={set("service")} />
                              {o}
                            </label>
                          ))}
                        </div>
                      </Field>
                      <Reveal open={data.service === "Other"}>
                        {(hidden) => (
                          <Field label="Please specify your request" full>
                            <input required disabled={hidden} placeholder="Tell us what you need" value={data.serviceOther} onChange={set("serviceOther")} />
                          </Field>
                        )}
                      </Reveal>

                      <div className={`${styles.field} ${styles.full}`} role="group" aria-labelledby="checks-label">
                        <span id="checks-label" className={styles.label}>What would you like us to check?<em>Select all that apply</em></span>
                        <div className={styles.chips} data-error={checksError || undefined}>
                          {checks.map((o) => (
                            <label key={o} className={styles.chip} data-checked={data.checks.includes(o) || undefined}>
                              <input type="checkbox" checked={data.checks.includes(o)} onChange={() => toggleCheck(o)} />
                              <i><Icon name="check" /></i>{o}
                            </label>
                          ))}
                        </div>
                        {checksError && <span className={styles.error} role="alert">Please choose at least one area.</span>}
                      </div>
                      <Reveal open={data.checks.includes("Other")}>
                        {(hidden) => (
                          <Field label="Please specify" full>
                            <input required disabled={hidden} placeholder="What else should we check?" value={data.checkOther} onChange={set("checkOther")} />
                          </Field>
                        )}
                      </Reveal>

                      <Field label="Anything specific you want us to review?" optional full>
                        <textarea rows={4} placeholder="Pages, devices or interactions you’re concerned about…" value={data.message} onChange={set("message")} />
                      </Field>
                    </div>
                  </fieldset>

                  <div className={styles.submitRow}>
                    <button className={styles.submit} type="submit">
                      <span>Get My Free Report</span>
                      <i><Icon name="arrowRight" /></i>
                    </button>
                    <small>By submitting, you agree to be contacted about your website review.</small>
                  </div>
                </form>
              )}
            </div>
          </div>

          <aside className={styles.side}>
            <div className={styles.sideCard}>
              <span className={styles.sideLabel}><Icon name="report" />What’s included</span>
              <ul>{included.map((t) => <li key={t}><Icon name="check" />{t}</li>)}</ul>
            </div>
            <div className={`${styles.sideCard} ${styles.preview}`}>
              <span className={styles.sideLabel}><Icon name="scan" />Example QA findings</span>
              {[["critical", "Navigation spacing breaks at tablet width."], ["high", "Hero image crop hides key content on mobile."], ["medium", "Form submission gives visitors no confirmation."]].map(([lvl, t], i) => (
                <p key={t} style={{ "--i": i }}><i data-level={lvl} />{t}</p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
