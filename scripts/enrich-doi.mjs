/**
 * enrich-doi.mjs
 *
 * Enriches publications.json with DOI from CrossRef API.
 * Uses title-based search to find matching DOIs.
 *
 * Usage: node scripts/enrich-doi.mjs
 * Output: updates scripts/publications.json in-place
 *
 * Rate limit: CrossRef polite pool (50 req/sec with mailto)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBS_FILE = path.join(__dirname, "publications.json");

const MAILTO = "sdlab@cnu.ac.kr"; // polite pool access
const CROSSREF_API = "https://api.crossref.org/works";
const DELAY_MS = 300; // ~3 req/sec to be polite

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Search CrossRef for a publication by title.
 * Returns DOI if a confident match is found, null otherwise.
 */
async function searchDoi(title, year, authors) {
  const query = encodeURIComponent(title);
  const url = `${CROSSREF_API}?query.title=${query}&rows=3&mailto=${MAILTO}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const items = data.message?.items || [];

    for (const item of items) {
      // Check title similarity
      const itemTitle = (item.title?.[0] || "").toLowerCase().trim();
      const searchTitle = title.toLowerCase().trim();

      if (!itemTitle) continue;

      // Exact or very close match
      const similarity = titleSimilarity(searchTitle, itemTitle);
      if (similarity < 0.7) continue;

      // Year check (if available)
      const itemYear =
        item.published?.["date-parts"]?.[0]?.[0] ||
        item["published-print"]?.["date-parts"]?.[0]?.[0] ||
        item["published-online"]?.["date-parts"]?.[0]?.[0];

      if (year && itemYear && Math.abs(year - itemYear) > 1) continue;

      return item.DOI;
    }
  } catch {
    // Network error — skip
  }

  return null;
}

/**
 * Simple title similarity based on word overlap (Jaccard-like).
 */
function titleSimilarity(a, b) {
  const wordsA = new Set(
    a
      .replace(/[^a-z0-9\s]/gi, "")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
  const wordsB = new Set(
    b
      .replace(/[^a-z0-9\s]/gi, "")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  return intersection / Math.max(wordsA.size, wordsB.size);
}

async function main() {
  const pubs = JSON.parse(fs.readFileSync(PUBS_FILE, "utf-8"));

  // Only process English-titled publications without DOI
  const targets = pubs.filter((p) => !p.doi && /[a-zA-Z]{10,}/.test(p.title));

  console.log(`Total publications: ${pubs.length}`);
  console.log(`Already have DOI: ${pubs.filter((p) => p.doi).length}`);
  console.log(`Targets (English title, no DOI): ${targets.length}`);
  console.log("");

  let found = 0;
  let failed = 0;

  for (let i = 0; i < targets.length; i++) {
    const pub = targets[i];
    const progress = `[${i + 1}/${targets.length}]`;

    const doi = await searchDoi(pub.title, pub.year, pub.authors);

    if (doi) {
      pub.doi = doi;
      found++;
      console.log(`${progress} ✓ ${doi} — ${pub.title.substring(0, 60)}`);
    } else {
      failed++;
      if ((i + 1) % 20 === 0) {
        console.log(`${progress} ... (${found} found, ${failed} not found)`);
      }
    }

    await sleep(DELAY_MS);
  }

  // Write back
  fs.writeFileSync(PUBS_FILE, JSON.stringify(pubs, null, 2), "utf-8");

  console.log(`\n════════════════════════════════`);
  console.log(`  DOI found:     ${found}`);
  console.log(`  Not found:     ${failed}`);
  console.log(
    `  Total w/ DOI:  ${pubs.filter((p) => p.doi).length}/${pubs.length}`,
  );
  console.log(`════════════════════════════════`);
  console.log(`\nUpdated: ${PUBS_FILE}`);
}

main();
