// ── Server-only: LibreOffice-based Office → PDF conversion ───────────────────
import "server-only";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const execFileAsync = promisify(execFile);
const CACHE_DIR = process.env.NAS_PREVIEW_CACHE ?? "/tmp/nas-preview-cache";

// ── In-memory lock: prevents duplicate parallel conversions of the same file ─
const converting = new Map<string, Promise<Buffer>>();

// ── LibreOffice availability: cached at module level (avoid fork per request) ─
let _loAvailable: boolean | null = null;
export async function libreOfficeAvailable(): Promise<boolean> {
  if (_loAvailable !== null) return _loAvailable;
  try {
    await execFileAsync("libreoffice", ["--version"], { timeout: 5_000 });
    _loAvailable = true;
  } catch {
    _loAvailable = false;
  }
  return _loAvailable;
}

async function doConvert(absPath: string, cacheKey: string): Promise<Buffer> {
  const cachedPath = path.join(CACHE_DIR, `${cacheKey}.pdf`);

  // 1. Cache hit
  try {
    return await fs.readFile(cachedPath);
  } catch {
    // Cache miss — continue to convert
  }

  // 2. Ensure cache directory exists
  await fs.mkdir(CACHE_DIR, { recursive: true });

  // 3. Use a per-key isolated tmpdir to prevent filename collisions.
  //    Two files named "report.pptx" in different folders would otherwise
  //    race to write "report.pdf" into the shared CACHE_DIR.
  const tmpDir = path.join(CACHE_DIR, `tmp-${cacheKey}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // Run LibreOffice headless conversion into the isolated tmpDir
    await execFileAsync(
      "libreoffice",
      ["--headless", "--convert-to", "pdf", "--outdir", tmpDir, absPath],
      { timeout: 60_000 },
    );

    // LibreOffice names the output after the source file (minus extension)
    const generatedName = path.basename(absPath, path.extname(absPath)) + ".pdf";
    const generatedPath = path.join(tmpDir, generatedName);

    // Move to content-addressed cache key (atomic within same filesystem)
    await fs.rename(generatedPath, cachedPath).catch(async () => {
      // Fallback if tmpDir and CACHE_DIR are on different filesystems
      await fs.copyFile(generatedPath, cachedPath);
    });
  } finally {
    // Always clean up the temp directory, even on failure
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }

  return fs.readFile(cachedPath);
}

/**
 * Convert any LibreOffice-supported file to PDF.
 * Results are cached by SHA-1(absPath + mtime) — if the source file changes
 * the cache is automatically invalidated on the next request.
 */
export async function convertToPdf(absPath: string): Promise<Buffer> {
  const stat = await fs.stat(absPath);
  const cacheKey = crypto
    .createHash("sha1")
    .update(`${absPath}:${stat.mtimeMs}`)
    .digest("hex");

  // Deduplicate concurrent requests for the same file
  const existing = converting.get(cacheKey);
  if (existing) return existing;

  const promise = doConvert(absPath, cacheKey).finally(() => {
    converting.delete(cacheKey);
  });

  converting.set(cacheKey, promise);
  return promise;
}
