// =======================================================
// scrape-chordie-index.js (FIXED)
// - Correct per-song extraction
// - Scrapes letter main page FIRST
// - Then scrapes label ranges
// =======================================================

import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs-extra";

// -------------------------------------------------------
// CONFIG
// -------------------------------------------------------
const BASE = "https://www.chordie.com";
const OUTPUT_FILE = "./chordie-song-index.json";
const DELAY_LABEL = 400;
const DELAY_LETTER = 1200;

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} → ${url}`);
  }

  return res.text();
}

// -------------------------------------------------------
// Extract label-range links
// -------------------------------------------------------
function extractLabelLinks($, letterUrl) {
  const links = [];

  $(".labelWrap a.label").each((_, el) => {
    const href = $(el).attr("href");
    const label = $(el).text().trim();

    if (!href) return;

    links.push({
      url: href.startsWith("http") ? href : `${letterUrl}${href}`,
      label
    });
  });

  return links;
}

// -------------------------------------------------------
// Extract songs (ONE SONG PER ROW)
// -------------------------------------------------------
function extractSongs($, letter, label = "ALL") {
  const songs = [];

  $(".brwsSongListOuter a.songtitle").each((_, el) => {
    const songLink = $(el);

    // The artist is ALWAYS in the next <i> sibling
    const artistLink = songLink
      .next("i")
      .find("a.browseartistname");

    if (!artistLink.length) return;

    const song_name = songLink.text().trim();
    const artist_name = artistLink.text().trim();

    const songHref = songLink.attr("href");
    const artistHref = artistLink.attr("href");

    songs.push({
      id: Number(songHref?.match(/(\d+)/)?.[1] ?? null),
      song_name,
      artist_name,
      tab_url: BASE + songHref,
      artist_url: BASE + artistHref,
      source: "chordie",
      letter,
      label
    });
  });

  return songs;
}

// -------------------------------------------------------
// Crawl one letter
// -------------------------------------------------------
async function crawlLetter(letter) {
  console.log(`\n🔤 Letter: ${letter}`);

  const letterUrl = `${BASE}/browsesong.php/${letter}.php`;
  const html = await fetchHTML(letterUrl);
  const $ = cheerio.load(html);

  const results = [];

  // ✅ 1. FIRST: scrape the main letter page
  const baseSongs = extractSongs($, letter, "ALL");
  console.log(`  Base page songs: ${baseSongs.length}`);
  results.push(...baseSongs);

  // ✅ 2. THEN: scrape label ranges
  const labelLinks = extractLabelLinks($, letterUrl);
  console.log(`  Labels: ${labelLinks.length}`);

  for (const lbl of labelLinks) {
    console.log(`   ▶ ${lbl.label}`);

    const labelHtml = await fetchHTML(lbl.url);
    const $$ = cheerio.load(labelHtml);

    const songs = extractSongs($$, letter, lbl.label);
    results.push(...songs);

    await sleep(DELAY_LABEL);
  }

  console.log(`  ✅ Total collected: ${results.length}`);
  return results;
}

// -------------------------------------------------------
// MAIN
// -------------------------------------------------------
(async () => {
  const letters = [..."abcdefghijklmnopqrstuvwxyz", "#"];
  const allSongs = [];

  for (const letter of letters) {
    try {
      const songs = await crawlLetter(letter);
      allSongs.push(...songs);
      await sleep(DELAY_LETTER);
    } catch (err) {
      console.error(`❌ Letter ${letter} failed`, err.message);
    }
  }

  // Deduplicate by tab_url
  const unique = Object.values(
    allSongs.reduce((acc, s) => {
      acc[s.tab_url] = s;
      return acc;
    }, {})
  );

  await fs.writeJson(OUTPUT_FILE, unique, { spaces: 2 });

  console.log(
    `\n🎸 DONE → ${unique.length} unique songs saved to ${OUTPUT_FILE}`
  );
})();
