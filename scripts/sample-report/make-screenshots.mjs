// Generates the annotated demo screenshots for the SignalReach sample QA report.
//
//   npm i --no-save playwright && npx playwright install chromium
//   node scripts/sample-report/make-screenshots.mjs
//
// Loads demo-site.html (a fictional website), adds a numbered highlight marker
// over each documented issue and saves JPGs to public/reports/screens/.
// Packages are resolved from the current working directory, so they don't
// need to be project dependencies. Resizing uses macOS `sips`.

import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(path.join(process.cwd(), "noop.js"));
const { chromium } = require("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const out = path.join(root, "public/reports/screens");
const site = pathToFileURL(path.join(here, "demo-site.html")).href;
mkdirSync(out, { recursive: true });

const DESKTOP = { width: 1280, height: 820 };
const TABLET = { width: 820, height: 1000 };
const MOBILE = { width: 390, height: 844 };

// Draws a highlight box + numbered badge + label over `selector`.
function mark({ selector, num, label, pad = 10, place = "top" }) {
  const el = document.querySelector(selector);
  const r = el.getBoundingClientRect();
  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "absolute", zIndex: 9999, pointerEvents: "none",
    left: `${r.left + scrollX - pad}px`, top: `${r.top + scrollY - pad}px`,
    width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`,
    border: "3px solid #e5534b", borderRadius: "12px",
    boxShadow: "0 0 0 6px rgba(229,83,75,.18), 0 10px 30px rgba(229,83,75,.25)",
  });
  const badge = document.createElement("span");
  badge.textContent = num;
  Object.assign(badge.style, {
    position: "absolute", left: "-15px", top: "-15px", width: "30px", height: "30px",
    display: "grid", placeItems: "center", borderRadius: "50%", background: "#e5534b",
    color: "#fff", font: "700 14px Helvetica, Arial, sans-serif", boxShadow: "0 4px 12px rgba(0,0,0,.25)",
  });
  const tag = document.createElement("span");
  tag.textContent = label;
  Object.assign(tag.style, {
    position: "absolute", left: "22px", [place === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
    padding: "7px 12px", borderRadius: "8px", background: "#0b1d44", color: "#fff",
    font: "600 13px Helvetica, Arial, sans-serif", whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(0,0,0,.25)",
  });
  box.append(badge, tag);
  document.body.append(box);
}

// Region of the page (document coordinates) around a selector.
async function regionOf(page, selector, { padX = 0, padTop = 0, padBottom = 0, fullWidth = true } = {}) {
  return page.evaluate(({ selector, padX, padTop, padBottom, fullWidth }) => {
    const r = document.querySelector(selector).getBoundingClientRect();
    const x = fullWidth ? 0 : Math.max(0, r.left + scrollX - padX);
    const w = fullWidth ? document.documentElement.clientWidth : Math.min(document.documentElement.clientWidth - x, r.width + padX * 2);
    const y = Math.max(0, r.top + scrollY - padTop);
    return { x, y, width: w, height: r.height + padTop + padBottom };
  }, { selector, padX, padTop, padBottom, fullWidth });
}

const shots = [
  {
    id: "01", viewport: DESKTOP,
    marks: [{ selector: "#hero-cta", num: "1", label: "Primary CTA blends in with the secondary link", place: "bottom" }],
    clip: async () => ({ x: 0, y: 0, width: 1280, height: 640 }),
  },
  {
    id: "02", viewport: DESKTOP,
    marks: [{ selector: ".logo", num: "2", label: "Dark logo on the darkest part of the hero", place: "bottom", pad: 8 }],
    clip: async () => ({ x: 0, y: 0, width: 1280, height: 300 }),
  },
  {
    id: "03", viewport: TABLET,
    marks: [{ selector: "#nav", num: "3", label: "Links squeeze together and wrap at 820px", place: "bottom", pad: 8 }],
    clip: async () => ({ x: 0, y: 0, width: 820, height: 260 }),
  },
  {
    id: "04", viewport: MOBILE,
    marks: [{ selector: "#hero-title", num: "4", label: "Desktop-size heading breaks “Brand-ready”", place: "top", pad: 6 }],
    clip: async (page) => {
      const r = await regionOf(page, "#hero-actions", { padBottom: 40 });
      return { x: 0, y: 0, width: r.width, height: r.y + r.height };
    },
  },
  {
    id: "05", viewport: MOBILE,
    marks: [{ selector: "#hero-art", num: "5", label: "Product cropped out on mobile", place: "top", pad: 6 }],
    clip: async (page) => regionOf(page, "#hero-art", { padTop: 120, padBottom: 40 }),
  },
  {
    id: "06", viewport: { width: 900, height: 1000 },
    marks: [{ selector: "#cards", num: "6", label: "Uneven heights; third card drops to its own row", place: "top", pad: 10 }],
    clip: async (page) => regionOf(page, "#cards", { padTop: 90, padBottom: 30 }),
  },
  {
    id: "07", viewport: DESKTOP, fullPage: true, resize: 760,
    marks: [
      { selector: "#hero-cta", num: "A", label: "First CTA", place: "bottom" },
      { selector: "#send", num: "B", label: "Next clear CTA — five sections later", place: "top" },
    ],
  },
  {
    id: "08", viewport: DESKTOP,
    marks: [{ selector: "#quotes", num: "8", label: "Light grey text on white — weak contrast", place: "top", pad: 10 }],
    clip: async (page) => regionOf(page, "#quotes", { padTop: 150, padBottom: 40 }),
  },
  {
    id: "09", viewport: DESKTOP, before: async (page) => { await page.click("#send"); },
    marks: [{ selector: "#form", num: "9", label: "Pressed “Send message” — nothing changes", place: "top", pad: 10 }],
    clip: async (page) => regionOf(page, "#contact", { padTop: 0, padBottom: 0 }),
  },
  {
    id: "10", viewport: DESKTOP,
    marks: [{ selector: "#faq details[open] summary", num: "10", label: "Open item looks the same as closed items", place: "top", pad: 6 }],
    clip: async (page) => regionOf(page, "#faq", { padTop: 60, padBottom: 30 }),
  },
  {
    id: "11", viewport: DESKTOP,
    marks: [{ selector: "#story", num: "11", label: "Label, heading and body copy look the same", place: "top", pad: 12 }],
    clip: async (page) => regionOf(page, "#about", {}),
  },
  {
    id: "12", viewport: DESKTOP,
    marks: [{ selector: "#g1", num: "12", label: "gallery-01.png · 4.8 MB (demo value)", place: "top", pad: 6 }],
    clip: async (page) => regionOf(page, "#gallery", { padTop: 140, padBottom: 30 }),
  },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({ viewport: shot.viewport, deviceScaleFactor: 2 });
  await page.goto(site);
  if (shot.before) await shot.before(page);
  for (const m of shot.marks) await page.evaluate(mark, m);
  const file = path.join(out, `finding-${shot.id}.jpg`);
  if (shot.fullPage) {
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 82 });
  } else {
    const clip = await shot.clip(page);
    await page.screenshot({ path: file, clip, fullPage: true, type: "jpeg", quality: 84 });
  }
  if (shot.resize) execFileSync("sips", ["--resampleWidth", String(shot.resize * 2), file], { stdio: "ignore" });
  else execFileSync("sips", ["--resampleWidth", String(Math.min(shot.viewport.width, 1280) * 1.5), file], { stdio: "ignore" });
  console.log("saved", path.relative(root, file));
  await page.close();
}
await browser.close();
