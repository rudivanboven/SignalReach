// Builds public/reports/SignalReach-Sample-Website-QA-Report.docx from the
// same data the /sample-report page uses (src/sections/sample/reportData.json)
// and the screenshots in public/reports/screens/.
//
//   npm i --no-save docx
//   node scripts/sample-report/make-docx.mjs
//
// `docx` is resolved from the current working directory, so it doesn't need
// to be a project dependency.

import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(path.join(process.cwd(), "noop.js"));
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, HeadingLevel, WidthType, ShadingType, BorderStyle, PageNumber, PageBreak,
  LevelFormat, VerticalAlign, TableLayoutType, PositionalTab, PositionalTabAlignment,
  PositionalTabRelativeTo, PositionalTabLeader,
} = require("docx");

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const data = JSON.parse(readFileSync(path.join(root, "src/sections/sample/reportData.json"), "utf8"));
const outFile = path.join(root, "public", data.meta.docx);

// ---------- Brand ----------
const NAVY = "0B1D44";
const NAVY_2 = "163A86";
const BLUE = "2F6BFF";
const CYAN = "24B7D8";
const GOLD = "C99A4A";
const MUTED = "5B6478";
const LINE = "D6DEEA";
const FONT = "Arial";

const SEV = {
  critical: { fill: "FDE8E7", text: "B42318" },
  high: { fill: "FFF1EB", text: "C4320A" },
  medium: { fill: "FBF1DF", text: "8A6424" },
  low: { fill: "EEF2F6", text: "475467" },
  quickwin: { fill: "E3F6EC", text: "067647" },
};
const sevLabel = Object.fromEntries(data.severities.map((s) => [s.id, s.label]));

// A4 with 0.9" margins → content width 6.47" (≈ 9317 DXA)
const PAGE = { width: 11906, height: 16838 };
const MARGIN = 1296;
const CONTENT = PAGE.width - MARGIN * 2;
const EMU_PX = 96; // docx ImageRun sizes are in px at 96 dpi

// ---------- Helpers ----------
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  throw new Error("Not a JPEG");
}

const run = (text, o = {}) => new TextRun({ text, font: FONT, ...o });
const p = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [run(children)], ...o });
const spacer = (after = 120) => new Paragraph({ spacing: { after }, children: [] });

const label = (text, color = GOLD) => p([run(text.toUpperCase(), { bold: true, size: 17, color, characterSpacing: 40 })], { spacing: { after: 60 } });

const noBorders = { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } };
const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const lineBorders = { top: thin, bottom: thin, left: thin, right: thin };

function cell(children, { width, fill, borders = lineBorders, margins = { top: 110, bottom: 110, left: 150, right: 150 }, vAlign = VerticalAlign.TOP } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    borders,
    margins,
    verticalAlign: vAlign,
    children: Array.isArray(children) ? children : [children],
  });
}

function table(rows, columnWidths, o = {}) {
  return new Table({
    width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths,
    layout: TableLayoutType.FIXED,
    rows,
    ...o,
  });
}

function sevChip(id) {
  const s = SEV[id];
  return p([run(`  ${sevLabel[id].toUpperCase()}  `, { bold: true, size: 18, color: s.text, shading: { type: ShadingType.CLEAR, fill: s.fill, color: "auto" } })]);
}

function image(file, maxWidthIn) {
  const buf = readFileSync(path.join(root, "public", file));
  const { width, height } = jpegSize(buf);
  const w = Math.round(maxWidthIn * EMU_PX);
  return new ImageRun({ type: "jpg", data: buf, transformation: { width: w, height: Math.round((w * height) / width) } });
}

// ---------- Cover ----------
const cover = [
  table([
    new TableRow({
      children: [cell([
        p([run("SignalReach", { bold: true, size: 30, color: "FFFFFF" })], { spacing: { after: 360 } }),
        p([run("SAMPLE / DEMONSTRATION REPORT", { bold: true, size: 18, color: "F1D49A", characterSpacing: 40 })], { spacing: { after: 140 } }),
        p([run(data.meta.title, { bold: true, size: 56, color: "FFFFFF" })], { spacing: { after: 160 } }),
        p([run(data.meta.website, { size: 26, color: "C9D6F2" })], { spacing: { after: 120 } }),
      ], { width: CONTENT, fill: NAVY, borders: noBorders, margins: { top: 560, bottom: 520, left: 560, right: 560 } })],
    }),
  ], [CONTENT]),
  p([], { border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: GOLD, space: 1 } }, spacing: { after: 360 } }),
  p([image(data.findings[0].image, 6.47)], { alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
  p([run("Demo website screenshot used throughout this sample report.", { italics: true, size: 16, color: MUTED })], { alignment: AlignmentType.CENTER, spacing: { after: 360 } }),
  table(
    [
      ["Website", data.meta.website],
      ["Report type", data.meta.reportType],
      ["Status", data.meta.status],
      ["Reviewed at", data.meta.reviewedOn],
      ["Prepared by", data.meta.preparedBy],
    ].map(([k, v]) => new TableRow({
      children: [
        cell(p([run(k, { bold: true, size: 19, color: NAVY })]), { width: 2400, fill: "F3F6FB" }),
        cell(p([run(v, { size: 19, color: "1F2937" })]), { width: CONTENT - 2400 }),
      ],
    })),
    [2400, CONTENT - 2400],
  ),
  spacer(240),
  p([run(data.disclaimer, { italics: true, size: 18, color: MUTED })]),
];

// ---------- Contents ----------
const contentsLine = (text, sub, level = 0) => p([
  run(text, { bold: level === 0, size: level === 0 ? 21 : 19, color: level === 0 ? NAVY : "374151" }),
  ...(sub ? [new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.DOT })] }), run(sub, { size: 18, color: MUTED })] : []),
], { spacing: { after: level === 0 ? 80 : 50 }, indent: { left: level * 360 } });

const contents = [
  p([run("Contents", { bold: true, size: 36, color: NAVY })], { spacing: { after: 240 } }),
  contentsLine("Executive Summary"),
  ...data.sections.flatMap((s) => [
    contentsLine(s.title),
    ...data.findings.filter((f) => f.section === s.id).map((f) => contentsLine(`Finding ${f.id} — ${f.title}`, sevLabel[f.severity], 1)),
  ]),
  contentsLine("Prioritized Recommendations & Next Steps"),
  contentsLine("About This Sample Report"),
];

// ---------- Executive summary ----------
const counts = data.severities.map((s) => ({ ...s, count: data.findings.filter((f) => f.severity === s.id).length }));
const half = CONTENT / 2;

const summary = [
  p([new PageBreak()]),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run("Executive Summary")] }),
  p([run(data.summary.text, { size: 21 })], { spacing: { after: 160 } }),
  p([run(data.summary.overall, { size: 21 })], { spacing: { after: 280 } }),
  label("Findings by priority — demo data"),
  table([
    new TableRow({
      tableHeader: true,
      children: ["Priority", "Findings", "What it means"].map((h, i) => cell(p([run(h, { bold: true, size: 18, color: "FFFFFF" })]), { width: [2000, 1300, CONTENT - 3300][i], fill: NAVY })),
    }),
    ...counts.map((s) => new TableRow({
      children: [
        cell(sevChip(s.id), { width: 2000 }),
        cell(p([run(String(s.count), { bold: true, size: 22, color: NAVY })]), { width: 1300 }),
        cell(p([run(s.meaning, { size: 19 })]), { width: CONTENT - 3300 }),
      ],
    })),
    new TableRow({
      children: [
        cell(p([run("Total", { bold: true, size: 19 })]), { width: 2000, fill: "F3F6FB" }),
        cell(p([run(String(data.findings.length), { bold: true, size: 22, color: NAVY })]), { width: 1300, fill: "F3F6FB" }),
        cell(p([run("Sample counts for demonstration — not measured client results.", { italics: true, size: 18, color: MUTED })]), { width: CONTENT - 3300, fill: "F3F6FB" }),
      ],
    }),
  ], [2000, 1300, CONTENT - 3300]),
  spacer(320),
  label("Areas covered in a SignalReach review"),
  table(
    Array.from({ length: Math.ceil(data.categories.length / 2) }, (_, r) => new TableRow({
      children: [0, 1].map((c) => {
        const cat = data.categories[r * 2 + c];
        return cell(cat ? [
          p([run(cat.title, { bold: true, size: 19, color: NAVY })], { spacing: { after: 40 } }),
          p([run(cat.items.join(" · "), { size: 17, color: MUTED })]),
        ] : p(""), { width: half });
      }),
    })),
    [half, half],
  ),
];

// ---------- Findings ----------
const imageWidth = { wide: 6.47, tall: 2.9, page: 3.4 };

function findingBlock(f) {
  const s = data.sections.find((x) => x.id === f.section);
  const rows = [
    ["Issue", [p([run(f.found, { size: 20 })])]],
    ["Why It Matters", [p([run(f.why, { size: 20 })])]],
    ["Priority", [sevChip(f.severity)]],
    ["Recommended Improvement", [p([run(f.fix, { size: 20 })])]],
  ];
  return [
    p([new PageBreak()]),
    label(`Finding ${f.id}  ·  ${s.short}  ·  ${f.category}`),
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run(f.title)] }),
    p([
      run(`${f.page} — ${f.area}`, { bold: true, size: 19, color: NAVY_2 }),
      run(`   |   ${f.device}`, { size: 19, color: MUTED }),
    ], { spacing: { after: 200 } }),
    p([image(f.image, imageWidth[f.shape])], {
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      border: { top: thin, bottom: thin, left: thin, right: thin },
    }),
    p([run(`Screenshot — ${f.page}, ${f.area} (${f.device}). Marker ${f.shape === "page" ? "A/B" : Number(f.id)} highlights the issue.`, { italics: true, size: 16, color: MUTED })], { alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
    table(rows.map(([k, v]) => new TableRow({
      cantSplit: true,
      children: [
        cell(p([run(k, { bold: true, size: 19, color: NAVY })]), { width: 2300, fill: "F3F6FB" }),
        cell(v, { width: CONTENT - 2300 }),
      ],
    })), [2300, CONTENT - 2300]),
  ];
}

const findings = data.sections.flatMap((s) => [
  p([new PageBreak()]),
  label(`Section · ${s.short}`, CYAN),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(s.title)] }),
  p([run(s.intro, { size: 21, color: MUTED })], { spacing: { after: 200 } }),
  table([
    new TableRow({ children: ["Finding", "Issue", "Priority"].map((h, i) => cell(p([run(h, { bold: true, size: 18, color: "FFFFFF" })]), { width: [1300, CONTENT - 3300, 2000][i], fill: NAVY })) }),
    ...data.findings.filter((f) => f.section === s.id).map((f) => new TableRow({
      children: [
        cell(p([run(f.id, { bold: true, size: 19, color: NAVY })]), { width: 1300 }),
        cell(p([run(f.title, { size: 19 })]), { width: CONTENT - 3300 }),
        cell(sevChip(f.severity), { width: 2000 }),
      ],
    })),
  ], [1300, CONTENT - 3300, 2000]),
  ...data.findings.filter((f) => f.section === s.id).flatMap(findingBlock),
]);

// ---------- Recommendations ----------
const order = data.severities.map((s) => s.id);
const sorted = [...data.findings].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity) || a.id.localeCompare(b.id));

const recommendations = [
  p([new PageBreak()]),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run("Prioritized Recommendations")] }),
  p([run("All findings in recommended order of work, from the most to the least urgent.", { size: 21, color: MUTED })], { spacing: { after: 200 } }),
  table([
    new TableRow({ tableHeader: true, children: ["#", "Priority", "Recommended improvement"].map((h, i) => cell(p([run(h, { bold: true, size: 18, color: "FFFFFF" })]), { width: [800, 1900, CONTENT - 2700][i], fill: NAVY })) }),
    ...sorted.map((f) => new TableRow({
      cantSplit: true,
      children: [
        cell(p([run(f.id, { bold: true, size: 19, color: NAVY })]), { width: 800 }),
        cell(sevChip(f.severity), { width: 1900 }),
        cell([p([run(f.title, { bold: true, size: 19, color: NAVY })], { spacing: { after: 40 } }), p([run(f.fix, { size: 18 })])], { width: CONTENT - 2700 }),
      ],
    })),
  ], [800, 1900, CONTENT - 2700]),
  spacer(320),
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [run("Suggested Next Steps")] }),
  ...data.nextSteps.map((t) => new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 80 }, children: [run(t, { size: 20 })] })),
];

// ---------- About ----------
const about = [
  p([new PageBreak()]),
  new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run("About This Sample Report")] }),
  p([run(data.disclaimer, { size: 21 })], { spacing: { after: 160 } }),
  p([run("Northstar Creative Studio is a fictional business created for this demonstration. The screenshots come from a demo website built for this purpose, and all findings, counts and values are sample data.", { size: 21 })], { spacing: { after: 160 } }),
  p([run("Every real SignalReach report is created by a person reviewing your actual website — page by page, section by section, across desktop, tablet and mobile — with screenshots, clear explanations, priorities and practical recommendations like the ones in this example.", { size: 21 })], { spacing: { after: 360 } }),
  table([
    new TableRow({
      children: [cell([
        p([run("Ready to see what your website is missing?", { bold: true, size: 30, color: "FFFFFF" })], { spacing: { after: 120 } }),
        p([run("Submit your website and we’ll manually review the experience page by page, then send you a practical QA report like this example.", { size: 21, color: "C9D6F2" })], { spacing: { after: 200 } }),
        p([run("Get Your Free QA Report  →  SignalReach website › Get Your Free QA Report", { bold: true, size: 20, color: "F1D49A" })]),
      ], { width: CONTENT, fill: NAVY, borders: noBorders, margins: { top: 360, bottom: 360, left: 420, right: 420 } })],
    }),
  ], [CONTENT]),
];

// ---------- Header / footer ----------
const header = new Header({
  children: [p([
    run("SignalReach", { bold: true, size: 17, color: NAVY }),
    run("  ·  Sample Website QA Report", { size: 17, color: MUTED }),
    new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.NONE })] }),
    run("SAMPLE / DEMO", { bold: true, size: 15, color: GOLD, characterSpacing: 30 }),
  ], { border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 6 } } })],
});

const footer = new Footer({
  children: [p([
    run(data.meta.website, { size: 15, color: MUTED }),
    new TextRun({ children: [new PositionalTab({ alignment: PositionalTabAlignment.RIGHT, relativeTo: PositionalTabRelativeTo.MARGIN, leader: PositionalTabLeader.NONE })] }),
    new TextRun({ font: FONT, size: 15, color: MUTED, children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] }),
  ], { border: { top: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 6 } } })],
});

// ---------- Document ----------
const doc = new Document({
  creator: "SignalReach",
  title: "SignalReach Sample Website QA Report",
  description: "Sample / demonstration website QA report for a fictional business.",
  styles: {
    default: { document: { run: { font: FONT, size: 20, color: "1F2937" }, paragraph: { spacing: { line: 300 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 30, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{ reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } }, run: { bold: true, color: BLUE } } }] }],
  },
  sections: [
    { properties: { page: { size: PAGE, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } }, children: cover },
    {
      properties: { page: { size: PAGE, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN, header: 600, footer: 600 } } },
      headers: { default: header },
      footers: { default: footer },
      children: [...contents, ...summary, ...findings, ...recommendations, ...about],
    },
  ],
});

mkdirSync(path.dirname(outFile), { recursive: true });
writeFileSync(outFile, await Packer.toBuffer(doc));
console.log("saved", path.relative(root, outFile));
