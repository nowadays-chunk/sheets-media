// =======================================================
// SCRIPT B — scrape-chordie-song-pages.js
// Iterates index JSON → scrapes chords + lyrics
// Supports Chordie HTML-rendered format
// RESUMABLE — skips already scraped songs
// =======================================================

import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";

// -------------------------------------------------------
// CONFIG
// -------------------------------------------------------
const INDEX_FILE = "./output_songs/second-songs.json";
const OUTPUT_DIR = "./songs";
const REQUEST_DELAY = 1200;

// -------------------------------------------------------
// Setup
// -------------------------------------------------------
await fs.ensureDir(OUTPUT_DIR);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// -------------------------------------------------------
// Fetch helper
// -------------------------------------------------------
async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.text();
}

// -------------------------------------------------------
// Parse Chordie HTML (textline + chordline)
// -------------------------------------------------------
function parseChordieHTML($) {
  const sections = [];
  let currentSection = { name: "Verse", lines: [] };

  $("#firstcol > div").each((_, el) => {
    const $el = $(el);

    // ------------------------------------
    // TEXT LINE (lyrics only)
    // ------------------------------------
    if ($el.hasClass("textline")) {
      const text = $el.text().replace(/\s+/g, " ").trim();
      if (!text) return;

      currentSection.lines.push({
        chunks: [
          {
            chord: null,
            lyrics: text
          }
        ]
      });
      return;
    }

    // ------------------------------------
    // CHORD LINE (mixed lyrics + chords)
    // ------------------------------------
    if ($el.hasClass("chordline")) {
      const chunks = [];
      let currentChord = null;
      let lyricBuffer = "";

      $el.contents().each((_, node) => {
        // Text node → lyrics
        if (node.type === "text") {
          lyricBuffer += node.data;
          return;
        }

        const $node = $(node);

        // Chord container
        if ($node.hasClass("relc") || $node.hasClass("inlc")) {
          if (currentChord !== null || lyricBuffer.trim()) {
            chunks.push({
              chord: currentChord,
              lyrics: lyricBuffer.replace(/\s+/g, " ").trim()
            });
            lyricBuffer = "";
          }

          currentChord = $node.find(".absc").text().trim();
        }
      });

      // Flush remaining buffer
      if (currentChord !== null || lyricBuffer.trim()) {
        chunks.push({
          chord: currentChord,
          lyrics: lyricBuffer.replace(/\s+/g, " ").trim()
        });
      }

      if (chunks.length) {
        currentSection.lines.push({ chunks });
      }
    }
  });

  if (currentSection.lines.length) {
    sections.push(currentSection);
  }

  return sections;
}

// -------------------------------------------------------
// Scrape one song page
// -------------------------------------------------------
async function scrapeSong(entry) {
  const html = await fetchHTML(entry.tab_url);
  const $ = cheerio.load(html);

  const title =
    $("h1.titleLeft")
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim() || entry.song_name;

  const artist =
    $("h1.titleLeft a span").text().trim() ||
    entry.artist_name;

  // Best-effort key detection
  let key = null;
  $(".textline").each((_, el) => {
    const m = $(el).text().match(/key\s*:\s*([A-G][#b]?m?)/i);
    if (m) key = m[1];
  });

  const sections = parseChordieHTML($);

  if (!sections.length) {
    throw new Error("No lyrics/chords found");
  }

  return {
    url: entry.tab_url,
    title,
    artist,
    key,
    scrapedAt: new Date().toISOString(),
    sections
  };
}

// -------------------------------------------------------
// MAIN
// -------------------------------------------------------
(async () => {
  const index = await fs.readJson(INDEX_FILE);

  let scraped = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of index) {
    const safeName =
      `${entry.artist_name}-${entry.song_name}`
        .replace(/[^\w\d]+/g, "_")
        .toLowerCase();

    const outFile = path.join(OUTPUT_DIR, `${safeName}.json`);
    const tmpFile = outFile + ".tmp";

    // ------------------------------------
    // Resume support
    // ------------------------------------
    if (await fs.pathExists(outFile)) {
      console.log(`↩︎ Skipping: ${entry.artist_name} — ${entry.song_name}`);
      skipped++;
      continue;
    }

    try {
      console.log(`🎵 Scraping: ${entry.artist_name} — ${entry.song_name}`);

      const song = await scrapeSong(entry);

      // Atomic write
      await fs.writeJson(tmpFile, song, { spaces: 2 });
      await fs.move(tmpFile, outFile, { overwrite: true });

      scraped++;
    } catch (err) {
      failed++;
      console.error(`❌ ${entry.song_name}: ${err.message}`);
    }

    await sleep(REQUEST_DELAY);
  }

  console.log("\n==============================");
  console.log("✅ DONE — All songs processed");
  console.log(`🎵 Scraped: ${scraped}`);
  console.log(`↩︎ Skipped: ${skipped}`);
  console.log(`❌ Failed : ${failed}`);
  console.log("==============================\n");
})();
