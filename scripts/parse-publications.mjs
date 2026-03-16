/**
 * parse-publications.mjs
 *
 * Reads 연구실적-김영국.json (PDF-parsed structured data) and extracts
 * publication data from 4 HTML table sections into a structured JSON file.
 *
 * Source: PDF parsing API output with element IDs for section boundaries.
 * Much cleaner than OCR'd markdown — no character corruption.
 *
 * Usage: node scripts/parse-publications.mjs
 * Output: scripts/publications.json
 */

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE_FILE = path.join(ROOT, "연구실적-김영국.json");
const OUTPUT_FILE = path.join(ROOT, "scripts", "publications.json");

// ── Section boundaries (element ID ranges from Python script) ────────────
// II  국제학술지:   id=6~16   → type='journal',    international=true
// III 국제학술회의: id=19~42  → type='conference', international=true
// IV  국내학술지:   id=45~53  → type='journal',    international=false
// V   국내학술회의: id=56~86  → type='conference', international=false

const SECTIONS = [
  { key: "intl_journal", idStart: 6, idEnd: 17, type: "journal", isIntl: true },
  {
    key: "intl_conference",
    idStart: 19,
    idEnd: 43,
    type: "conference",
    isIntl: true,
  },
  {
    key: "dom_journal",
    idStart: 45,
    idEnd: 55,
    type: "journal",
    isIntl: false,
  },
  {
    key: "dom_conference",
    idStart: 56,
    idEnd: 88,
    type: "conference",
    isIntl: false,
  },
];

// ── HTML table parser ────────────────────────────────────────────────────

function parseTableHtml(html) {
  const rows = [];
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trPattern.exec(html)) !== null) {
    const rowHtml = trMatch[1];
    const cells = [];
    const tdPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let tdMatch;
    while ((tdMatch = tdPattern.exec(rowHtml)) !== null) {
      let cell = tdMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#\d+;/g, (m) =>
          String.fromCharCode(parseInt(m.slice(2, -1))),
        )
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      cells.push(cell);
    }
    if (cells.length > 0 && cells.some((c) => c.length > 0)) {
      rows.push(cells);
    }
  }
  return rows;
}

// ── Utility functions ────────────────────────────────────────────────────

function clean(s) {
  if (!s) return "";
  return s.replace(/\s+/g, " ").trim();
}

function parseYearMonth(dateStr) {
  if (!dateStr) return { year: null, month: null };
  const s = dateStr.replace(/\s+/g, "");

  const twoDigitMatch = s.match(/^(\d{2})\.(\d{2})/);
  if (twoDigitMatch) {
    const yr = parseInt(twoDigitMatch[1]);
    if (yr >= 93 && yr <= 99)
      return { year: 1900 + yr, month: parseInt(twoDigitMatch[2]) };
    if (yr >= 0 && yr <= 26)
      return { year: 2000 + yr, month: parseInt(twoDigitMatch[2]) };
  }

  const fullYearMatch = s.match(/((?:19|20)\d{2})(?:[.\-](\d{1,2}))?/);
  if (fullYearMatch) {
    const year = parseInt(fullYearMatch[1]);
    const month = fullYearMatch[2] ? parseInt(fullYearMatch[2]) : null;
    if (year >= 1993 && year <= 2026) {
      return { year, month: month && month >= 1 && month <= 12 ? month : null };
    }
  }
  return { year: null, month: null };
}

function extractDoi(text) {
  if (!text) return null;
  const doiOrgMatch = text.match(/doi\.org\/(10\.\d{4,}\/\S+)/i);
  if (doiOrgMatch) return doiOrgMatch[1].replace(/[.,)]+$/, "");
  const directMatch = text.match(/10\.\d{4,}\/\S+/);
  if (directMatch) return directMatch[0].replace(/[.,)]+$/, "");
  return null;
}

function extractIndexType(venueRaw, volumeRaw) {
  const combined = `${venueRaw} ${volumeRaw}`.toUpperCase();
  if (/\(SCIE\)/.test(combined) || /\bSCIE\b/.test(combined)) return "SCIE";
  if (/\(SCI\)/.test(combined) || /\bSCI\b/.test(combined)) return "SCI";
  if (/\(SCOPUS\)/.test(combined) || /\bSCOPUS\b/.test(combined))
    return "SCOPUS";
  if (/\(KCI\)/.test(combined) || /\bKCI\b/.test(combined)) return "KCI";
  return null;
}

function cleanVenue(venue) {
  return venue
    .replace(/\((?:SCI[EE]?|SCOPUS|KCI)[^)]*\)/gi, "")
    .replace(/\((?:ISSN|IF|Q\d)[^)]*\)/gi, "")
    .replace(/ISSN[:\s]*[\d\-X]+(\(print\)|\(online\))?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/[,.\s]+$/, "");
}

// ── Author parsing ───────────────────────────────────────────────────────

function parseAuthors(raw) {
  raw = clean(raw);
  if (!raw) return [];

  // Extract "외 N인/명" suffix
  const etcMatch = raw.match(/(외\s*\d+\s*[인명])/);
  const etcNote = etcMatch ? etcMatch[1] : null;
  if (etcNote) raw = raw.slice(0, etcMatch.index).trim();

  const etcMatch2 = raw.match(/(외\d+명)/);
  const etcNote2 = !etcNote && etcMatch2 ? etcMatch2[1] : null;
  if (etcNote2) raw = raw.slice(0, etcMatch2.index).trim();

  let parts = [];

  if (raw.includes(",")) {
    parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  } else if (/^[가-힣\s]+$/.test(raw)) {
    // Korean names with spaces — merge 1-char tokens with next
    const tokens = raw.split(/\s+/);
    let i = 0;
    while (i < tokens.length) {
      if (tokens[i].length === 1 && i + 1 < tokens.length) {
        parts.push(tokens[i] + tokens[i + 1]);
        i += 2;
      } else {
        parts.push(tokens[i]);
        i += 1;
      }
    }
  } else if (/^[A-Za-z\s\-\.,:]+$/.test(raw)) {
    // English names — comma or space separated
    if (raw.includes(",")) {
      parts = raw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      const words = raw.split(/\s+/).filter(Boolean);
      let i = 0;
      while (i < words.length) {
        if (i + 1 < words.length) {
          parts.push(`${words[i]} ${words[i + 1]}`);
          i += 2;
        } else {
          parts.push(words[i]);
          i += 1;
        }
      }
    }
  } else {
    // Mixed — try semicolons, double spaces, then single spaces
    const bySemicolon = raw.split(/[;]/);
    if (bySemicolon.length > 1) {
      parts = bySemicolon.map((p) => p.trim()).filter(Boolean);
    } else {
      const byDoubleSpace = raw.split(/\s{2,}/);
      if (byDoubleSpace.length > 1) {
        parts = byDoubleSpace.map((p) => p.trim()).filter(Boolean);
      } else {
        parts = raw.split(/\s+/).filter(Boolean);
      }
    }
  }

  const result = parts.map((p) => p.trim()).filter((p) => p.length > 0);
  if (etcNote) result.push(etcNote);
  if (etcNote2) result.push(etcNote2);
  return result.length > 0 ? result : [raw].filter(Boolean);
}

// ── Slug generation ──────────────────────────────────────────────────────

const slugSeen = {};

function generateSlug(title, year) {
  const englishPart = title.replace(/[^a-zA-Z0-9\s\-]/g, "").trim();
  let base;
  if (englishPart.length >= 10) {
    base = englishPart.toLowerCase().replace(/\s+/g, "-").slice(0, 55);
  } else {
    base = randomUUID().slice(0, 8);
  }
  const suffix = year ? `-${year}` : "";
  const slug = `${base}${suffix}`;
  const count = slugSeen[slug] || 0;
  slugSeen[slug] = count + 1;
  return count === 0 ? slug : `${slug}-${count}`;
}

// ── is_featured heuristic ────────────────────────────────────────────────

function isFeatured(section, year, venue, publisher) {
  if (section !== "intl_journal") return false;
  if (!year || year < 2020) return false;
  const text = `${venue} ${publisher}`.toUpperCase();
  return ["IEEE", "ELSEVIER", "SPRINGER", "MDPI", "NATURE", "ACM"].some((k) =>
    text.includes(k),
  );
}

// ── Parse table rows into publication objects ─────────────────────────────

function parseTableRows(rows, type, isInternational, section) {
  const results = [];

  // Skip header row (first row)
  const dataRows = rows.slice(1);

  for (const row of dataRows) {
    if (row.length < 2) continue;

    const authorsRaw = row[0] || "";
    const title = clean(row[1] || "");
    const venueRaw = clean(row[2] || "");
    const publisher = clean(row[3] || "");
    const dateStr = clean(row[4] || "");
    const volumeRaw = clean(row[5] || "");

    if (!title || title.length < 5) continue;

    let { year, month } = parseYearMonth(dateStr);
    if (!year) {
      const fallback = parseYearMonth(volumeRaw);
      year = fallback.year;
      month = fallback.month;
    }
    if (!year || year < 1990 || year > 2026) continue;

    const doi = extractDoi(volumeRaw) || extractDoi(venueRaw);
    const indexType = extractIndexType(venueRaw, volumeRaw);
    const venueClean = cleanVenue(venueRaw);
    const authors = parseAuthors(authorsRaw);

    if (authors.length === 0) continue;

    results.push({
      title,
      authors,
      type,
      is_international: isInternational,
      venue: venueClean,
      publisher,
      year,
      month: month || null,
      doi: doi || null,
      index_type: indexType,
      volume_info: volumeRaw || null,
      is_featured: isFeatured(section, year, venueRaw, publisher),
      section,
    });
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`ERROR: Source file not found: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf-8"));
  const elements = data.elements || [];

  console.log(`Loaded ${elements.length} elements from JSON`);

  const allPublications = [];
  const counts = {};

  for (const { key, idStart, idEnd, type, isIntl } of SECTIONS) {
    // Filter table elements by ID range
    const tables = elements.filter(
      (e) => e.category === "table" && e.id >= idStart && e.id < idEnd,
    );

    let sectionPubs = [];
    for (const table of tables) {
      const html = table.html || "";
      const rows = parseTableHtml(html);
      const pubs = parseTableRows(rows, type, isIntl, key);
      sectionPubs.push(...pubs);
    }

    counts[key] = sectionPubs.length;
    allPublications.push(...sectionPubs);
  }

  // Write output JSON
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(allPublications, null, 2),
    "utf-8",
  );

  const total = allPublications.length;
  console.log("\nParse complete!");
  console.log(`  International Journal:    ${counts["intl_journal"]} entries`);
  console.log(
    `  International Conference: ${counts["intl_conference"]} entries`,
  );
  console.log(`  Domestic Journal:         ${counts["dom_journal"]} entries`);
  console.log(
    `  Domestic Conference:      ${counts["dom_conference"]} entries`,
  );
  console.log(`  ─────────────────────────────────`);
  console.log(`  Total:                    ${total} entries`);
  console.log(`\nOutput: ${OUTPUT_FILE}`);
}

main();
