import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Meta from '../Partials/Head';

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
  const [searchType, setSearchType] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchScaleType, setSearchScaleType] = useState("");
  const [searchMode, setSearchMode] = useState("");
  const [searchDegree, setSearchDegree] = useState("");

  // ============================================================
  // FILTER LOGIC WITH ALL FIXES
  // ============================================================
  const filteredElements = useMemo(() => {
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
    searchDegree
  ]);


  // ============================================================
  // Breadcrumb
  // ============================================================

  const breadcrumb = [
    { label: 'Play And Visualize', href: '/' },
    { label: 'Learn Songs', href: '/learn' },
    { label: 'The Circle Of Fifths', href: '/circle' },
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
      <Meta
        title="Musical Guitar Sheets Complete References"
        description="Explore chords, scales, modes and arpeggios for every key."
      />

      {/* BREADCRUMB */}
      <StyledCard>
        <Typography variant="h3">Site Pages :</Typography>
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
            <Typography variant="h6">Category</Typography>

            <OptionButton selected={searchType === "scale"} onClick={() => {
              setSearchType("scale");
              setSearchDegree("");
              setSearchScaleType("");
              setSearchMode("");
            }}>Scales</OptionButton>

            <OptionButton selected={searchType === "chord"} onClick={() => {
              setSearchType("chord");
              setSearchScaleType("");
              setSearchMode("");
            }}>Chords</OptionButton>

            <OptionButton selected={searchType === "arp"} onClick={() => {
              setSearchType("arp");
              setSearchScaleType("");
              setSearchMode("");
            }}>Arpeggios</OptionButton>
          </Box>

          {/* STEP 2 – KEY */}
          {searchType && (
            <Box mb={2}>
              <Typography variant="h6">Key</Typography>

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

          {/* STEP 3 – SCALE TYPE */}
          {searchType === "scale" && searchKey && (
            <Box mb={2}>
              <Typography variant="h6">Scale Type</Typography>
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

          {/* STEP 4 – MODE */}
          {searchType === "scale" &&
            searchKey &&
            searchScaleType &&
            guitar.scales[searchScaleType].modes?.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6">Modes</Typography>

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

          {/* STEP 5 – DEGREE */}
          {(searchType === "chord" || searchType === "arp") && searchKey && (
            <Box mb={2}>
              <Typography variant="h6">Degree</Typography>
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

      {/* RESULTS */}
      <StyledCard>
        <CardContent>
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