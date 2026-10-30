"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { supabase } from "@/lib/supabase";
import { checks, EMAIL, industries, services, URL_PATTERN, URL_TEST } from "@/lib/free-report/fields";
import styles from "./AuditForm.module.css";

// Website QA report request — animated intro, live 3-step indicator and a layered
// form card (Contact / Website / Challenge) with "Other" fields that reveal
// when chosen.
//
const included = ["Page & section layout", "UI design quality", "Mobile responsiveness", "Images & media", "Navigation, buttons & forms", "Content presentation", "UX & conversion flow", "Basic performance & SEO"];

const steps = [
  { id: "contact", label: "Contact", hint: "Who should we send the report to?" },
  { id: "website", label: "Website", hint: "Which website should we review?" },
  { id: "challenge", label: "Challenge", hint: "What would you like us to focus on?" },
];

function newSubmissionId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Team email notification — sent server-side, only after Supabase confirmed the
// insert. Fire-and-forget: a failed email never affects the visitor's success
// state (the route logs it). `keepalive` lets it finish if the page is closed.
function notifyTeam(payload) {
  try {
    fetch("/api/free-report/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: newSubmissionId(), ...payload }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let the notification interfere with the submission.
  }
}

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
  const [submissionDecision, setSubmissionDecision] = useState(null);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [checksError, setChecksError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const groupRefs = useRef({});
  const submittingRef = useRef(false);
  const modalRef = useRef(null);
  const cancelRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;

    setSubmitError("");
    if (!data.checks.length) {
      setChecksError(true);
      goTo("challenge");
      return;
    }

    const payload = {
      first_name: data.first.trim(),
      last_name: data.last.trim(),
      email: data.email.trim(),
      phone: data.phone.trim() || null,
      website_url: data.url.trim(),
      industry: data.industry,
      industry_other: data.industry === "Other" ? data.industryOther.trim() : null,
      service_needed: data.service,
      service_other: data.service === "Other" ? data.serviceOther.trim() : null,
      check_items: data.checks,
      check_other: data.checks.includes("Other") ? data.checkOther.trim() : null,
      details: data.message.trim() || null,
    };

    setPendingPayload(payload);
    setAgreementChecked(false);
  };

  const submitDecision = async (pricingDecision) => {
    if (!pendingPayload || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const decidedPayload = {
        ...pendingPayload,
        pricing_decision: pricingDecision,
        pricing_decision_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("qa_report_requests").insert(decidedPayload);
      if (error) throw error;
      notifyTeam(decidedPayload);
      setSubmissionDecision(pricingDecision);
      setSubmitted(true);
      setPendingPayload(null);
      setAgreementChecked(false);
    } catch (error) {
      console.error("Failed to submit QA report request:", error);
      setSubmitError("We couldn’t send your request right now. Please try again in a moment.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setData(initial);
    setSubmitted(false);
    setSubmissionDecision(null);
    setPendingPayload(null);
    setAgreementChecked(false);
    setChecksError(false);
    setSubmitError("");
    setFocusGroup("contact");
  };

  useEffect(() => {
    if (!pendingPayload) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        setPendingPayload(null);
        setAgreementChecked(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = modalRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pendingPayload, isSubmitting]);

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
          <h2>Request your <span>$45 website QA report.</span></h2>
          <p>Three short steps. We’ll manually review your website across design, layout, responsiveness, content, usability and functionality. No payment is required when submitting the form; once the review is complete, we’ll send a $45 invoice before delivering your final report.</p>
          <ul className={styles.trust}>
            <li><Icon name="user" />Human-led review</li>
            <li><Icon name="clock" />Target delivery within 6–12 hours</li>
            <li><Icon name="check" />Invoice sent before delivery</li>
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
                  <h3>{submissionDecision === "agreed" ? "Your Website QA Request Is Confirmed" : "Your Website Details Have Been Received"}</h3>
                  <p>{submissionDecision === "agreed"
                    ? "We’ll review your website and send the $45 invoice before your completed report is delivered."
                    : "You haven’t accepted the $45 report charge. Our team may contact you regarding your request."}</p>
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
                    <button className={styles.submit} type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                      <span>{isSubmitting ? "Submitting..." : "Request My QA Report — $45"}</span>
                      <i><Icon name="arrowRight" /></i>
                    </button>
                    <small>By submitting, you agree to be contacted about your website review.</small>
                    {submitError && <p className={styles.submitError} role="alert">{submitError}</p>}
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
      {pendingPayload && (
        <div className={styles.modalOverlay} role="presentation" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) {
            setPendingPayload(null);
            setAgreementChecked(false);
          }
        }}>
          <div ref={modalRef} className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="qa-confirm-title" aria-describedby="qa-confirm-copy">
            <header className={styles.modalHead}>
              <div>
                <span>Website QA Report</span>
                <h2 id="qa-confirm-title">Confirm Your $45 Website QA Report</h2>
              </div>
              <strong aria-label="Report price: 45 dollars">$45</strong>
            </header>
            <div className={styles.modalBody}>
              <p id="qa-confirm-copy">SignalReach will manually review your website and prepare your Website QA Report. No payment is required at this stage. Once the review is complete, we’ll send you a $45 invoice. Your final report will be delivered after payment is confirmed.</p>
              <div className={styles.modalColumns}>
                <section>
                  <h3>What’s included</h3>
                  <ul>{["Manual website QA", "Page and section review", "UI/UX and usability observations", "Mobile responsiveness review", "Functionality checks", "Screenshots and documented findings", "Prioritized recommendations", "Final Website QA Report"].map((item) => <li key={item}><Icon name="check" />{item}</li>)}</ul>
                </section>
                <section>
                  <h3>Payment process</h3>
                  <ol>
                    <li><b>1</b>Submit your website</li>
                    <li><b>2</b>SignalReach completes the review</li>
                    <li><b>3</b>We send the $45 invoice</li>
                    <li><b>4</b>After payment, your final report is delivered</li>
                  </ol>
                </section>
              </div>
              <label className={styles.agreement}>
                <input type="checkbox" checked={agreementChecked} onChange={(e) => setAgreementChecked(e.target.checked)} disabled={isSubmitting} />
                <span><i><Icon name="check" /></i>I understand that the Website QA Report costs $45 and that an invoice will be sent before the final report is delivered.</span>
              </label>
              {submitError && <p className={styles.modalError} role="alert">{submitError}</p>}
              <div className={styles.modalActions}>
                <button ref={cancelRef} type="button" className={styles.modalCancel} onClick={() => submitDecision("declined")} disabled={isSubmitting}>Cancel</button>
                <button type="button" className={styles.modalConfirm} onClick={() => submitDecision("agreed")} disabled={!agreementChecked || isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Agree & Submit Request"}
                </button>
              </div>
              <small className={styles.modalDismiss}>Use Escape or click outside to return to the form without submitting.</small>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
