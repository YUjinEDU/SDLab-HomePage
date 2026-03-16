/**
 * parse-publications.mjs
 *
 * Reads 연구실적-김영국-20251217-2026-03-15_09-47-50.md and extracts
 * publication data from 4 HTML table sections into a structured JSON file.
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

// ── Source file ────────────────────────────────────────────────────────────

const SOURCE_FILE = path.join(
  ROOT,
  "연구실적-김영국-20251217-2026-03-15_09-47-50.md",
);
const OUTPUT_FILE = path.join(ROOT, "scripts", "publications.json");

// ── Lightweight HTML table parser ──────────────────────────────────────────

/**
 * Parse a single <table> HTML string into rows of cells (string[][]).
 * Does NOT use cheerio — pure regex/string approach.
 */
function parseTableHtml(html) {
  const rows = [];

  // Extract all <tr>...</tr> blocks
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trPattern.exec(html)) !== null) {
    const rowHtml = trMatch[1];
    const cells = [];

    // Extract all <td>...</td> and <th>...</th> blocks
    const tdPattern = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let tdMatch;
    while ((tdMatch = tdPattern.exec(rowHtml)) !== null) {
      // Decode HTML entities and normalize whitespace
      let cell = tdMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#\d+;/g, (m) => {
          const code = parseInt(m.slice(2, -1));
          return String.fromCharCode(code);
        })
        .replace(/<[^>]+>/g, " ") // strip any nested tags
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

// ── Section splitter ───────────────────────────────────────────────────────

/**
 * Split the markdown content into named sections based on
 * <div align="center"> blocks containing Roman numerals.
 *
 * Returns: { intl_journal, intl_conference, dom_journal, dom_conference }
 * each containing the raw text/HTML for that section.
 */
function splitSections(content) {
  // Find all <div align="center"> ... </div> blocks and their positions
  const divPattern = /<div align="center">([\s\S]*?)<\/div>/gi;

  const divMatches = [];
  let m;
  while ((m = divPattern.exec(content)) !== null) {
    const innerText = m[1].trim();
    divMatches.push({
      index: m.index,
      end: m.index + m[0].length,
      text: innerText,
    });
  }

  // Identify which divs correspond to which section
  const sectionMap = {
    II: "intl_journal",
    III: "intl_conference",
    IV: "dom_journal",
    V: "dom_conference",
  };

  const sectionBoundaries = [];
  for (const div of divMatches) {
    for (const [roman, name] of Object.entries(sectionMap)) {
      // Match Roman numeral at start of div text
      if (new RegExp(`^${roman}\\.`).test(div.text)) {
        sectionBoundaries.push({ name, start: div.end });
        break;
      }
    }
  }

  // Sort by start position
  sectionBoundaries.sort((a, b) => a.start - b.start);

  // Extract content for each section (from its start to next section's start)
  const sections = {};
  for (let i = 0; i < sectionBoundaries.length; i++) {
    const { name, start } = sectionBoundaries[i];
    const end =
      i + 1 < sectionBoundaries.length
        ? sectionBoundaries[i + 1].start
        : content.length;
    sections[name] = content.slice(start, end);
  }

  return sections;
}

// ── Utility functions ──────────────────────────────────────────────────────

function clean(s) {
  if (!s) return "";
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Parse year and month from a date string.
 * Handles: "2006.2", "Sept.2013", "22.06.14(online)", "2021.01.19.(online)"
 */
function parseYearMonth(dateStr) {
  if (!dateStr) return { year: null, month: null };

  const s = dateStr.replace(/\s+/g, "");

  // Two-digit year prefix like "22.06.14" → 2022
  const twoDigitMatch = s.match(/^(\d{2})\.(\d{2})/);
  if (twoDigitMatch) {
    const yr = parseInt(twoDigitMatch[1]);
    if (yr >= 93 && yr <= 99) {
      return { year: 1900 + yr, month: parseInt(twoDigitMatch[2]) };
    } else if (yr >= 0 && yr <= 26) {
      return { year: 2000 + yr, month: parseInt(twoDigitMatch[2]) };
    }
  }

  // Full 4-digit year with optional month: "2006.2", "2006.02", "2021.01.19"
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

/**
 * Extract DOI from a text string.
 * Handles: "10.xxxx/..." and "doi.org/10.xxxx/..."
 */
function extractDoi(text) {
  if (!text) return null;

  // doi.org/10.xxx format
  const doiOrgMatch = text.match(/doi\.org\/(10\.\d{4,}\/\S+)/i);
  if (doiOrgMatch) {
    return doiOrgMatch[1].replace(/[.,)]+$/, "");
  }

  // Direct 10.xxx format
  const directMatch = text.match(/10\.\d{4,}\/\S+/);
  if (directMatch) {
    return directMatch[0].replace(/[.,)]+$/, "");
  }

  return null;
}

/**
 * Extract index type from venue and volume text.
 * Returns: 'SCIE' | 'SCI' | 'SCOPUS' | 'KCI' | null
 */
function extractIndexType(venueRaw, volumeRaw) {
  const combined = `${venueRaw} ${volumeRaw}`.toUpperCase();

  // Order matters: SCIE before SCI (SCIE contains SCI)
  if (/\(SCIE\)/.test(combined) || /\bSCIE\b/.test(combined)) return "SCIE";
  if (/\(SCI\)/.test(combined) || /\bSCI\b/.test(combined)) return "SCI";
  if (/\(SCOPUS\)/.test(combined) || /\bSCOPUS\b/.test(combined))
    return "SCOPUS";
  if (/\(KCI\)/.test(combined) || /\bKCI\b/.test(combined)) return "KCI";

  return null;
}

/**
 * Clean venue string — remove index type annotations and IF info.
 * e.g. "Transactions on Consumer Electronics (SCI)(IF:2.323)" →
 *      "Transactions on Consumer Electronics"
 */
function cleanVenue(venue) {
  return venue
    .replace(/\((?:SCI[EE]?|SCOPUS|KCI)[^)]*\)/gi, "")
    .replace(/\((?:ISSN|IF|Q\d)[^)]*\)/gi, "")
    .replace(/ISSN[:\s]*[\d\-X]+(\(print\)|\(online\))?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/[,.\s]+$/, "");
}

// ── Author parsing ─────────────────────────────────────────────────────────

/**
 * Split concatenated Korean names (no separator) into individual names.
 * Attempts 2-3 character Korean name tokens.
 * e.g. "주원군바민우취기석김용김영국" → ["주원군", "바민우", "취기석", "김용", "김영국"]
 */
function splitConcatenatedKorean(s) {
  const names = [];
  let i = 0;
  while (i < s.length) {
    // Try 3-char token first, then 2-char
    if (i + 3 <= s.length && /^[가-힣]{3}$/.test(s.slice(i, i + 3))) {
      names.push(s.slice(i, i + 3));
      i += 3;
    } else if (i + 2 <= s.length && /^[가-힣]{2}$/.test(s.slice(i, i + 2))) {
      names.push(s.slice(i, i + 2));
      i += 2;
    } else {
      // Single char or non-Korean — append to last or start new
      if (names.length > 0) {
        names[names.length - 1] += s[i];
      } else {
        names.push(s[i]);
      }
      i += 1;
    }
  }
  return names.filter((n) => n.length >= 2);
}

/**
 * Parse author string into individual author names.
 */
function parseAuthors(raw) {
  raw = clean(raw);
  if (!raw) return [];

  // Extract "외 N인/명" suffix
  const etcMatch = raw.match(/(외\s*\d+\s*[인명])/);
  const etcNote = etcMatch ? etcMatch[1] : null;
  if (etcNote) {
    raw = raw.slice(0, etcMatch.index).trim();
  }

  // Also handle "외N명" without space like "Dongwon Seo 외8명"
  const etcMatch2 = raw.match(/(외\d+명)/);
  const etcNote2 = etcMatch2 ? etcMatch2[1] : null;
  if (etcNote2) {
    raw = raw.slice(0, etcMatch2.index).trim();
  }

  let parts = [];

  if (raw.includes(",")) {
    // Comma-separated (Korean or English mixed)
    parts = raw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  } else if (/^[가-힣]+$/.test(raw.replace(/\s/g, ""))) {
    // All Korean — check if space-separated or concatenated

    if (raw.includes(" ")) {
      // Space-separated Korean tokens — merge 1-char tokens with next
      const tokens = raw.split(/\s+/);
      let i = 0;
      while (i < tokens.length) {
        const tok = tokens[i];
        if (tok.length === 1 && i + 1 < tokens.length) {
          parts.push(tok + tokens[i + 1]);
          i += 2;
        } else {
          parts.push(tok);
          i += 1;
        }
      }
    } else {
      // No spaces — try to split concatenated Korean names
      parts = splitConcatenatedKorean(raw);
      if (parts.length === 0) parts = [raw];
    }
  } else if (/^[A-Za-z\s\-\.]+$/.test(raw)) {
    // All English — pair words as First Last
    const words = raw.split(/\s+/).filter(Boolean);
    let i = 0;
    while (i < words.length) {
      if (i + 1 < words.length && /^[A-Z]/.test(words[i + 1])) {
        parts.push(`${words[i]} ${words[i + 1]}`);
        i += 2;
      } else {
        parts.push(words[i]);
        i += 1;
      }
    }
  } else {
    // Mixed Korean + English — split on double spaces or semicolons first
    const bySemicolon = raw.split(/[;]/);
    if (bySemicolon.length > 1) {
      parts = bySemicolon.map((p) => p.trim()).filter(Boolean);
    } else {
      // Single space split as fallback
      const tokens = raw.split(/\s+/).filter(Boolean);
      // Group: if token is purely Korean 2-3 chars it's likely a name
      let i = 0;
      while (i < tokens.length) {
        const tok = tokens[i];
        // Check if it looks like a standalone Korean name (2-3 chars)
        if (/^[가-힣]{2,3}$/.test(tok)) {
          parts.push(tok);
          i += 1;
        } else if (
          /^[A-Za-z\-]+$/.test(tok) &&
          i + 1 < tokens.length &&
          /^[A-Za-z\-]+$/.test(tokens[i + 1])
        ) {
          // English first + last name pair
          parts.push(`${tok} ${tokens[i + 1]}`);
          i += 2;
        } else {
          parts.push(tok);
          i += 1;
        }
      }
    }
  }

  const result = parts.map((p) => p.trim()).filter((p) => p.length > 0);
  if (etcNote) result.push(etcNote);
  if (etcNote2) result.push(etcNote2);

  return result.length > 0 ? result : [raw].filter(Boolean);
}

// ── Slug generation ────────────────────────────────────────────────────────

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

// ── is_featured heuristic ─────────────────────────────────────────────────

function isFeatured(section, year, venue, publisher) {
  if (section !== "intl_journal") return false;
  if (!year || year < 2020) return false;
  const text = `${venue} ${publisher}`.toUpperCase();
  return ["IEEE", "ELSEVIER", "SPRINGER", "MDPI", "NATURE", "ACM"].some((k) =>
    text.includes(k),
  );
}

// ── Parse a single table section ──────────────────────────────────────────

/**
 * Extract all <table border="1"> and <table class="table..."> blocks from section text,
 * parse each, and return publication objects.
 */
function parseSectionTables(sectionHtml, type, isInternational, section) {
  const results = [];

  // Extract all table HTML blocks
  const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tablePattern.exec(sectionHtml)) !== null) {
    const tableHtml = tableMatch[0];
    const rows = parseTableHtml(tableHtml);

    // Skip header row (first row) — columns are OCR-corrupted anyway
    const dataRows = rows.slice(1);

    for (const row of dataRows) {
      if (row.length < 2) continue;

      const authorsRaw = row[0] || "";
      const title = clean(row[1] || "");
      const venueRaw = clean(row[2] || "");
      const publisher = clean(row[3] || "");
      const dateStr = clean(row[4] || "");
      const volumeRaw = clean(row[5] || "");

      // Filter out blank rows
      if (!title || title.length < 5) continue;

      // Parse year/month
      let { year, month } = parseYearMonth(dateStr);
      if (!year) {
        const fallback = parseYearMonth(volumeRaw);
        year = fallback.year;
        month = fallback.month;
      }

      // Filter out entries without valid year
      if (!year || year < 1993 || year > 2026) continue;

      const doi = extractDoi(volumeRaw) || extractDoi(venueRaw);
      const indexType = extractIndexType(venueRaw, volumeRaw);
      const venueClean = cleanVenue(venueRaw);
      const authors = parseAuthors(authorsRaw);

      // Filter entries with no authors
      if (authors.length === 0) continue;

      const pub = {
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
      };

      results.push(pub);
    }
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  // Read source file
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`ERROR: Source file not found: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SOURCE_FILE, "utf-8");

  // Split into sections
  const sections = splitSections(content);

  const sectionConfig = [
    { key: "intl_journal", type: "journal", isIntl: true },
    { key: "intl_conference", type: "conference", isIntl: true },
    { key: "dom_journal", type: "journal", isIntl: false },
    { key: "dom_conference", type: "conference", isIntl: false },
  ];

  const allPublications = [];
  const counts = {};

  for (const { key, type, isIntl } of sectionConfig) {
    const sectionHtml = sections[key] || "";
    if (!sectionHtml) {
      console.warn(`WARNING: Section not found: ${key}`);
      counts[key] = 0;
      continue;
    }

    const pubs = parseSectionTables(sectionHtml, type, isIntl, key);
    counts[key] = pubs.length;
    allPublications.push(...pubs);
  }

  // Write output JSON
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(allPublications, null, 2),
    "utf-8",
  );

  // Print summary
  const total = allPublications.length;
  console.log("Parse complete!");
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
