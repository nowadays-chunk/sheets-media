// =======================================================
// scrape-heartwood-index.js
// =======================================================

import fs from "fs";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const URL = "https://www.heartwoodguitar.com/chords/";
const OUTPUT = "./output_songs/heartwood-songs.json";

// --------------------------------
// Helpers
// --------------------------------
const clean = (s) => s?.replace(/\s+/g, " ").trim() ?? "";

const normalizeArtist = (artist) => {
  // "Adams, Bryan" → "Bryan Adams"
  if (artist.includes(",")) {
    const [last, first] = artist.split(",").map(clean);
    return `${first} ${last}`;
  }
  return artist;
};

// --------------------------------
// Fetch page
// --------------------------------
const html = await fetch(URL, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/120.0",
  },
}).then((r) => r.text());

const $ = cheerio.load(html);

// --------------------------------
// Parse inside x-raw-content
// --------------------------------
const songs = [];
let currentKey = null;
let id = 1;

$(".x-raw-content").children().each((_, el) => {
  const tag = el.tagName;

  // ----------------------------
  // Section letter (A, B, C...)
  // ----------------------------
  if (tag === "h4") {
    const letter = $(el).find("a[name]").attr("name");
    if (letter) currentKey = letter;
    return;
  }

  // ----------------------------
  // Song link
  // ----------------------------
  if (tag === "a") {
    const href = $(el).attr("href") ?? "";
    const text = clean($(el).text());

    // Skip join / strum buttons
    if (!href.startsWith("http")) return;
    if (!text.includes(" - ")) return;

    const [rawArtist, rawSong] = text.split(" - ");

    songs.push({
      id: id++,
      song_id: 100000 + id,
      song_name: clean(rawSong),
      artist_name: normalizeArtist(clean(rawArtist)),
      key: currentKey,
      tab_url: href,
      artist_url: null,
      rating: null,
      difficulty: null,
      source: "heartwoodguitar",
    });
  }
});

// --------------------------------
// Save
// --------------------------------
fs.writeFileSync(OUTPUT, JSON.stringify(songs, null, 2), "utf8");

console.log(`🎸 Extracted ${songs.length} songs`);
console.log(`💾 Saved to ${OUTPUT}`);
