/**
 * seed-publications.mjs
 * Reads scripts/publications.json and inserts into Supabase publications table.
 * Uses only Node.js built-ins — no npm dependencies.
 */

import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// 1. Load environment variables from frontend/.env.local
// ---------------------------------------------------------------------------
function loadEnv(envPath) {
  const env = {};
  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      env[key] = value;
    }
  } catch (err) {
    console.error("Failed to read .env.local:", err.message);
    process.exit(1);
  }
  return env;
}

const envPath = join(__dirname, "..", "frontend", ".env.local");
const env = loadEnv(envPath);

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_ROLE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Supabase REST API helpers
// ---------------------------------------------------------------------------
function headers(extra = {}) {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function supabaseGet(table, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params ? "?" + params : ""}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${table} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function supabaseDelete(table, filter) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE ${table} failed (${res.status}): ${text}`);
  }
  return true;
}

async function supabaseInsert(table, rows) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers({ Prefer: "return=minimal" }),
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`INSERT ${table} failed (${res.status}): ${text}`);
  }
  return true;
}

// ---------------------------------------------------------------------------
// 3. Slug generation
// ---------------------------------------------------------------------------
function generateSlug(title, year, usedSlugs) {
  let base;
  const isEnglish = /^[\x20-\x7E]+$/.test(title);

  if (isEnglish) {
    base = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60)
      .replace(/-$/, "");
  } else {
    // Korean title: use short uuid + year
    const shortId = randomUUID().slice(0, 8);
    base = `pub-${year}-${shortId}`;
  }

  let slug = base;
  let counter = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);
  return slug;
}

// ---------------------------------------------------------------------------
// 4. Transform JSON entry to DB row
// ---------------------------------------------------------------------------
function transformEntry(entry, usedSlugs) {
  return {
    id: randomUUID(),
    slug: generateSlug(entry.title, entry.year, usedSlugs),
    title: entry.title,
    authors: entry.authors,
    type: entry.type,
    is_international: entry.is_international ?? false,
    venue: entry.venue || null,
    year: entry.year,
    month: entry.month || null,
    doi: entry.doi || null,
    pdf_url: null,
    abstract: null,
    keywords: [],
    bibtex: null,
    is_featured: entry.is_featured || false,
    is_public: true,
    index_type: entry.index_type || null,
    volume_info: entry.volume_info || null,
  };
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== Seed Publications ===");
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  // Load JSON
  const jsonPath = join(__dirname, "publications.json");
  let rawEntries;
  try {
    rawEntries = JSON.parse(readFileSync(jsonPath, "utf8"));
  } catch (err) {
    console.error("Failed to read publications.json:", err.message);
    process.exit(1);
  }
  console.log(`Loaded ${rawEntries.length} publications from JSON`);

  // ---------------------------------------------------------------------------
  // Step 1: Delete existing data (clean slate)
  // ---------------------------------------------------------------------------
  console.log("\n[1/5] Cleaning existing data...");
  try {
    await supabaseDelete(
      "publication_authors",
      "publication_id=neq.00000000-0000-0000-0000-000000000000",
    );
    console.log("  - Deleted publication_authors rows");
  } catch (err) {
    console.warn(
      "  - publication_authors delete skipped (may not exist):",
      err.message,
    );
  }

  try {
    await supabaseDelete(
      "publication_research_areas",
      "publication_id=neq.00000000-0000-0000-0000-000000000000",
    );
    console.log("  - Deleted publication_research_areas rows");
  } catch (err) {
    console.warn("  - publication_research_areas delete skipped:", err.message);
  }

  try {
    await supabaseDelete(
      "publication_projects",
      "publication_id=neq.00000000-0000-0000-0000-000000000000",
    );
    console.log("  - Deleted publication_projects rows");
  } catch (err) {
    console.warn("  - publication_projects delete skipped:", err.message);
  }

  try {
    await supabaseDelete(
      "publications",
      "id=neq.00000000-0000-0000-0000-000000000000",
    );
    console.log("  - Deleted publications rows");
  } catch (err) {
    console.error("  - Failed to delete publications:", err.message);
    process.exit(1);
  }

  // ---------------------------------------------------------------------------
  // Step 2: Transform entries
  // ---------------------------------------------------------------------------
  console.log("\n[2/5] Transforming entries...");
  const usedSlugs = new Set();
  const rows = rawEntries.map((entry) => transformEntry(entry, usedSlugs));
  console.log(`  Prepared ${rows.length} rows for insert`);

  // ---------------------------------------------------------------------------
  // Step 3: Insert in batches of 50
  // ---------------------------------------------------------------------------
  console.log("\n[3/5] Inserting publications...");
  const BATCH_SIZE = 50;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    try {
      await supabaseInsert("publications", batch);
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${rows.length}...`);
    } catch (err) {
      failed += batch.length;
      console.error(
        `  Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
        err.message,
      );
    }
  }

  console.log(`  Done: ${inserted} inserted, ${failed} failed`);

  // ---------------------------------------------------------------------------
  // Step 4: Fetch members for author linking
  // ---------------------------------------------------------------------------
  console.log("\n[4/5] Linking authors to members...");
  let members = [];
  try {
    members = await supabaseGet("members", "select=id,name_ko");
    console.log(`  Fetched ${members.length} members`);
  } catch (err) {
    console.warn("  Could not fetch members:", err.message);
  }

  let authorLinks = 0;
  let authorLinksFailed = 0;

  if (members.length > 0) {
    const memberMap = new Map();
    for (const m of members) {
      if (m.name_ko) memberMap.set(m.name_ko.trim(), m.id);
    }

    const linkRows = [];
    for (const row of rows) {
      for (let i = 0; i < row.authors.length; i++) {
        const authorName = row.authors[i].trim();
        const memberId = memberMap.get(authorName);
        if (memberId) {
          linkRows.push({
            publication_id: row.id,
            member_id: memberId,
            author_order: i + 1,
          });
        }
      }
    }

    console.log(`  Found ${linkRows.length} author-member links to insert`);

    // Insert links in batches
    for (let i = 0; i < linkRows.length; i += BATCH_SIZE) {
      const batch = linkRows.slice(i, i + BATCH_SIZE);
      try {
        await supabaseInsert("publication_authors", batch);
        authorLinks += batch.length;
      } catch (err) {
        authorLinksFailed += batch.length;
        console.error(`  Author link batch failed:`, err.message);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Step 5: Summary
  // ---------------------------------------------------------------------------
  console.log("\n[5/5] Summary");
  console.log("=====================================");
  console.log(`  Publications inserted : ${inserted}`);
  console.log(`  Publications failed   : ${failed}`);
  console.log(`  Author links created  : ${authorLinks}`);
  console.log(`  Author links failed   : ${authorLinksFailed}`);
  console.log("=====================================");

  if (failed > 0) {
    console.warn(
      "\nWARNING: Some publications failed to insert. Check errors above.",
    );
    process.exit(1);
  } else {
    console.log("\nSeed completed successfully!");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
