import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';

import { styled } from '@mui/material/styles';
import guitar from '../../config/guitar.js';
import { DEFAULT_KEYWORDS } from '../../data/seo';

import Head from 'next/head';
import { getAbsoluteNotes, checkMatch } from '../../core/music/musicTheory';

// -----------------------------------------
// CONSTANTS
// -----------------------------------------

const keysSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const normalizedKeys = keysSharps.map(k => k.replace("#", "sharp"));

const degreesDynamic = Object.keys(guitar.arppegios);
const scaleTypes = Object.keys(guitar.scales);

const allModesDynamic = [
  ...new Set(
    Object.values(guitar.scales)
      .flatMap(scale => scale.modes?.map(m => m.name) || [])
  )
];

// -----------------------------------------
// HELPERS
// -----------------------------------------

const normalizeKey = (str) => str?.replace("sharp", "#");
const denormalizeKey = (str) => str?.replace("#", "sharp");

const normalizeDegree = (str) =>
  str?.replace(/sharp/g, "#").replace(/#/g, "sharp");

// NEW: Normalize mode names with spaces → hyphens for URL
const normalizeModeName = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/--+/g, "-")
    .replace(/#/g, "sharp")
    .trim();
};


// -----------------------------------------
// STYLES
// -----------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '16px',
  width: '100%',
  margin: '0 auto',
  padding: '20px',
  [theme.breakpoints.up('md')]: { maxWidth: '65%' },
  [theme.breakpoints.down('md')]: { maxWidth: '80%' },
  '@media print': { margin: 0, width: '100%', maxWidth: '100%' }
}));

const OptionButton = styled(Button)(({ selected }) => ({
  borderRadius: "20px",
  margin: "4px",
  background: selected ? "#1976d2" : "transparent",
  color: selected ? "#fff" : "#1976d2",
  border: "1px solid #1976d2",
  "&:hover": {
    background: selected ? "#11529b" : "rgba(25,118,210,0.1)"
  }
}));


// -----------------------------------------
// COMPONENT
// -----------------------------------------

const References = ({ elements = [] }) => {
  const router = useRouter();
  const { key, type, subType, quality, shape, mode } = router.query;

  // Filters
  const [searchType, setSearchType] = useState("scale");
  const [searchKey, setSearchKey] = useState("C");
  const [searchScaleType, setSearchScaleType] = useState("major");
  const [searchMode, setSearchMode] = useState("Ionian");
  const [searchDegree, setSearchDegree] = useState("M");

  // New state for Matches
  const [searchChord, setSearchChord] = useState("M");
  const [searchMatchType, setSearchMatchType] = useState("scale");
  const [searchShape, setSearchShape] = useState("E");
  const [searchCrossKey, setSearchCrossKey] = useState(false);

  const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

  // ============================================================
  // FILTER LOGIC WITH ALL FIXES
  // ============================================================
  const filteredElements = useMemo(() => {
    // If exploring Matches, we generate links dynamically instead of filtering static props
    if (searchType === "matches") {
      if (!searchKey || !searchChord || !searchMatchType || !searchShape) return [];

      const chordData = guitar.arppegios[searchChord];
      const keyIndex = guitar.notes.sharps.indexOf(searchKey);
      if (keyIndex === -1) return [];

      const chordNotes = getAbsoluteNotes('chord', searchChord, keyIndex);
      const chordSlug = slugify(chordData.name);
      const shapeSlug = searchShape.toLowerCase();

      let results = [];
      const keysToSearch = searchCrossKey ? guitar.notes.sharps : [searchKey];

      keysToSearch.forEach((targetKey) => {
        const targetKeyIndex = guitar.notes.sharps.indexOf(targetKey);
        const targetRootSlug = slugify(targetKey);

        if (searchMatchType === 'scale') {
          Object.entries(guitar.scales).forEach(([scaleKey, scaleData]) => {
            if (scaleData.modes) {
              scaleData.modes.forEach((mode, mIdx) => {
                const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex, mIdx);
                if (checkMatch(chordNotes, targetNotes)) {
                  results.push({
                    label: `Scale ${mode.name} in ${targetKey} matches Chord ${chordData.name} in ${searchKey} (${searchShape} Shape)`,
                    href: `/matches/scale_${slugify(mode.name)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${slugify(searchKey)}_key_and_${shapeSlug}_shape`
                  });
                }
              });
            } else {
              const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex);
              if (checkMatch(chordNotes, targetNotes)) {
                results.push({
                  label: `Scale ${scaleData.name} in ${targetKey} matches Chord ${chordData.name} in ${searchKey} (${searchShape} Shape)`,
                  href: `/matches/scale_${slugify(scaleKey)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${slugify(searchKey)}_key_and_${shapeSlug}_shape`
                });
              }
            }
          });
        } else {
          // Arpeggios
          Object.entries(guitar.arppegios).forEach(([arpKey, arpData]) => {
            const targetNotes = getAbsoluteNotes('arppegio', arpKey, targetKeyIndex);
            if (checkMatch(chordNotes, targetNotes)) {
              results.push({
                label: `Arpeggio ${arpData.name} in ${targetKey} matches Chord ${chordData.name} in ${searchKey} (${searchShape} Shape)`,
                href: `/matches/arpeggio_${slugify(arpData.name)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${slugify(searchKey)}_key_and_${shapeSlug}_shape`
              });
            }
          });
        }
      });

      return results;
    }

    return elements.filter(el => {
      const href = el.href;
      const parts = href.split("/");

      const elementType = parts[2];
      const elementKeyRaw = parts[3];
      const elementScaleType = parts[4];

      // ALWAYS last segment = mode
      const elementModeRaw = parts[parts.length - 1];

      // Normalize mode
      const elementMode = normalizeModeName(elementModeRaw);

      // Fix degree (7sharp5) → normalized
      const elementDegreeRaw = parts[4];
      const elementDegree = normalizeDegree(elementDegreeRaw);

      const elementKey = normalizeKey(elementKeyRaw);

      // TYPE
      if (searchType === "scale" && elementType !== "scales") return false;
      if (searchType === "chord" && elementType !== "chords") return false;
      if (searchType === "arp" && elementType !== "arppegios") return false;

      // KEY
      if (searchKey && elementKey !== searchKey) return false;

      // SCALE TYPE
      if (searchScaleType && elementType === "scales") {
        if (elementScaleType !== searchScaleType) return false;
      }

      // MODE FIX — works for multi-word mode names
      if (searchMode && elementType === "scales") {
        const normSearch = normalizeModeName(searchMode);
        if (normSearch !== elementMode) return false;
      }

      // DEGREE FIX — normalize both sides
      if (searchDegree && elementType !== "scales") {
        const normSearch = normalizeDegree(searchDegree);
        if (normSearch !== elementDegree) return false;
      }

      return true;
    });
  }, [
    elements,
    searchType,
    searchKey,
    searchScaleType,
    searchMode,
    searchDegree,
    searchChord,
    searchMatchType,
    searchShape,
    searchCrossKey
  ]);


  // ============================================================
  // Breadcrumb
  // ============================================================

  const breadcrumb = [
    { label: 'Play And Visualize', href: '/' },
    { label: 'Learn Songs', href: '/learn' },
    { label: 'The Circle Of Fifths', href: '/circle' },
    { label: 'Matches Reference Registry', href: '/matches' },
    key && { label: key, href: `/references/${key}` },
    type && { label: type, href: `/references/${key}/${type}` },
    subType && { label: subType, href: `/references/${key}/${type}/${subType}` },
    quality && { label: quality, href: `/references/${key}/${type}/${subType}/${quality}` },
    shape && { label: shape, href: `/references/${key}/${type}/${subType}/${quality}/${shape}` },
    mode && { label: mode, href: `/references/${key}/${type}/${subType}/${quality}/${shape}/${mode}` }
  ].filter(Boolean);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Container sx={{ mt: 10 }}>
      <Head>
        <title>Guitar Sheets References 800+ Elements To Visualize</title>
        <meta
          name="description"
          content="Explore chords, scales, modes and arpeggios for every key. Find matching scales and arpeggios for your chords."
        />
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
      </Head>

      {/* BREADCRUMB */}
      <StyledCard>
        <Typography variant="h3" gutterBottom>Site Pages :</Typography>
        <CardContent>
          <ol>
            {breadcrumb.map((c, i) => (
              <li key={i}><Link href={c.href}>{c.label}</Link></li>
            ))}
          </ol>
        </CardContent>
      </StyledCard>

      {/* SEARCH FILTERS */}
      <StyledCard>
        <CardContent>
          <Typography variant="h4" gutterBottom>Search References</Typography>

          {/* STEP 1 – CATEGORY */}
          <Box mb={2}>
            <Typography variant="h6">Step 1: Category</Typography>

            <OptionButton selected={searchType === "scale"} onClick={() => {
              setSearchType("scale");
              setSearchDegree("");
              setSearchScaleType("major");
              setSearchMode("Ionian");
              setSearchChord("");
            }}>Scales</OptionButton>

            <OptionButton selected={searchType === "chord"} onClick={() => {
              setSearchType("chord");
              setSearchScaleType("");
              setSearchMode("");
              setSearchChord("");
              setSearchDegree("M");
            }}>Chords</OptionButton>

            <OptionButton selected={searchType === "arp"} onClick={() => {
              setSearchType("arp");
              setSearchScaleType("");
              setSearchMode("");
              setSearchChord("");
              setSearchDegree("M");
            }}>Arpeggios</OptionButton>

            <OptionButton selected={searchType === "matches"} onClick={() => {
              setSearchType("matches");
              setSearchScaleType("");
              setSearchMode("");
              setSearchDegree("");
              setSearchChord("M");
              setSearchMatchType("scale");
            }}>Matches</OptionButton>
          </Box>

          {/* STEP 2 – KEY */}
          {searchType && (
            <Box mb={2}>
              <Typography variant="h6">Step 2: Key</Typography>

              {normalizedKeys.map((nk, idx) => {
                const display = keysSharps[idx];
                return (
                  <OptionButton
                    key={nk}
                    selected={searchKey === keysSharps[idx]}
                    onClick={() =>
                      setSearchKey(searchKey === keysSharps[idx] ? "" : keysSharps[idx])
                    }
                  >
                    {display}
                  </OptionButton>
                );
              })}
            </Box>
          )}

          {/* MATCHES FLOW */}
          {searchType === 'matches' && searchKey && (
            <>
              {/* CROSS-KEY TOGGLE */}
              <Box mb={2}>
                <Typography variant="h6">Step 3: Match Search Depth</Typography>
                <OptionButton
                  selected={!searchCrossKey}
                  onClick={() => setSearchCrossKey(false)}
                >
                  Same Key ({searchKey})
                </OptionButton>
                <OptionButton
                  selected={searchCrossKey}
                  onClick={() => setSearchCrossKey(true)}
                >
                  Cross-Key (All Keys)
                </OptionButton>
              </Box>

              {/* STEP 4 - CHORD */}
              <Box mb={2}>
                <Typography variant="h6">Step 4: Root Chord</Typography>
                {Object.entries(guitar.arppegios)
                  .filter(([_, data]) => data.matchingScales?.length > 0 || data.matchingArpeggios?.length > 0)
                  .map(([chordKey, chordData]) => (
                    <OptionButton
                      key={chordKey}
                      selected={searchChord === chordKey}
                      onClick={() => setSearchChord(chordKey === searchChord ? "" : chordKey)}
                    >
                      {chordData.name}
                    </OptionButton>
                  ))}
              </Box>

              {/* STEP 5 - MATCH TYPE */}
              {searchChord && (
                <Box mb={2}>
                  <Typography variant="h6">Step 5: Match Type</Typography>
                  <OptionButton
                    selected={searchMatchType === 'scale'}
                    onClick={() => setSearchMatchType(searchMatchType === 'scale' ? '' : 'scale')}
                  >
                    Scale
                  </OptionButton>
                  <OptionButton
                    selected={searchMatchType === 'arpeggio'}
                    onClick={() => setSearchMatchType(searchMatchType === 'arpeggio' ? '' : 'arpeggio')}
                  >
                    Arpeggio
                  </OptionButton>
                </Box>
              )}

              {/* STEP 6 - SHAPE */}
              {searchChord && searchMatchType && (
                <Box mb={2}>
                  <Typography variant="h6">Step 6: CAGED Shape</Typography>
                  {['C', 'A', 'G', 'E', 'D'].map(s => (
                    <OptionButton
                      key={s}
                      selected={searchShape === s}
                      onClick={() => setSearchShape(s)}
                    >
                      {s} Shape
                    </OptionButton>
                  ))}
                </Box>
              )}
            </>
          )}

          {/* SCALE TYPE */}
          {searchType === "scale" && searchKey && (
            <Box mb={2}>
              <Typography variant="h6">Step 3: Scale Type</Typography>
              {scaleTypes.map(s => (
                <OptionButton
                  key={s}
                  selected={searchScaleType === s}
                  onClick={() => {
                    const newScale = (searchScaleType === s ? "" : s);
                    setSearchScaleType(newScale);
                    setSearchMode("");
                  }}
                >
                  {s}
                </OptionButton>
              ))}
            </Box>
          )}

          {/* MODE */}
          {searchType === "scale" &&
            searchKey &&
            searchScaleType &&
            guitar.scales[searchScaleType].modes?.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6">Step 4: Modes</Typography>

                {guitar.scales[searchScaleType].modes.map(m => (
                  <OptionButton
                    key={m.name}
                    selected={searchMode === m.name}
                    onClick={() => setSearchMode(searchMode === m.name ? "" : m.name)}
                  >
                    {m.name}
                  </OptionButton>
                ))}
              </Box>
            )}

          {/* DEGREE */}
          {(searchType === "chord" || searchType === "arp") && searchKey && (
            <Box mb={2}>
              <Typography variant="h6">Step 3: Degree</Typography>
              {degreesDynamic.map(d => (
                <OptionButton
                  key={d}
                  selected={searchDegree === d}
                  onClick={() => setSearchDegree(d === searchDegree ? "" : d)}
                >
                  {d}
                </OptionButton>
              ))}
            </Box>
          )}

        </CardContent>
      </StyledCard>

      {/* RESULTS - ALWAYS SHOWN WITH DEFAULTS */}
      <StyledCard>
        <CardContent>
          <Typography variant="h4" gutterBottom>Results ({filteredElements.length}) :</Typography>
          <ol>
            {filteredElements.map((element, index) => (
              <li key={index}>
                <Link href={element.href}>
                  {typeof element.label === "string" ? element.label : element.label?.name}
                </Link>
              </li>
            ))}
          </ol>
        </CardContent>
      </StyledCard>
    </Container>
  );
};

export default References;