// ============================================
// STATS.JSX — REFACTORED FOR PERFORMANCE
// ============================================
// Light mode only
// Tabs: All, Chords, Arpeggios, Scales
// 15 data visualizations per tab (60 charts total)
// ============================================

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";


import ChordsTab from "./tabs/ChordsTab";
import ArpeggiosTab from "./tabs/ArpeggiosTab";
import ScalesTab from "./tabs/ScalesTab";

import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../../data/seo';

export default function Stats({
  boards = [],
  chords = [],
  arpeggios = [],
  scales = [],
  /* ---------------------------------------------------------
  // PRECOMPUTED STATS HANDLING
  // --------------------------------------------------------- */
  usage = null,
  precomputedStats = {},
  p // padding between /play page and /stats page
}) {
  const [tab, setTab] = useState(0);

  // ---------------------------------------------------------
  // DETECT HOMEPAGE
  // ---------------------------------------------------------
  const isHomepage =
    boards.length > 0 &&
    chords.length === 0 &&
    arpeggios.length === 0 &&
    scales.length === 0 &&
    !usage;

  const saveStats = async (filename, data) => {
    try {
      await fetch('/api/save_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, data }),
      });
      console.log(`Saved stats for ${filename}`);
    } catch (error) {
      console.error(`Error saving stats for ${filename}:`, error);
    }
  };


  // ---------------------------------------------------------
  // SELECT SOURCE DATA
  // ---------------------------------------------------------
  const sourceBoards = useMemo(() => {
    // Homepage: use boards only
    if (isHomepage) {
      return boards.map((b) => {
        const choice = b.generalSettings.choice;
        const fb = b[choice + "Settings"]?.fretboard || [];
        return {
          fretboard: fb,
          chord: b.chordSettings?.chord || null,
          arpeggio: b.arppegioSettings?.arppegio || null,
          scale: b.scaleSettings?.scale || null,
          keyIndex: b.keySettings?.[choice] ?? null,
          shape: b[choice + "Settings"]?.shape || null,
          mode: b.modeSettings?.mode || null,
          general: b.generalSettings
        };
      });
    }

    // Stats page: merge chords + arpeggios + scales
    return [...chords, ...arpeggios, ...scales];
  }, [boards, chords, arpeggios, scales, isHomepage]);


  // ---------------------------------------------------------
  // TABS DEFINITION
  // ---------------------------------------------------------
  const tabs = ["Chords", "Arpeggios", "Scales"];

  // -------------------------------------------
  // FILTERED BOARDS FOR TABS
  // -------------------------------------------
  const chordBoards = useMemo(
    () => sourceBoards.filter(b => b.chord || (b.general?.choice === "chord")),
    [sourceBoards]
  );

  const arpBoards = useMemo(
    () => sourceBoards.filter(b => b.arpeggio || (b.general?.choice === "arppegio")),
    [sourceBoards]
  );

  const scaleBoards = useMemo(
    () => sourceBoards.filter(b => b.scale || (b.general?.choice === "scale")),
    [sourceBoards]
  );

  // -------------------------------------------------------------------------
  // RENDER SWITCH
  // -------------------------------------------------------------------------
  return (
    <Box sx={{ height: '100%', p: p == 0 ? 0 : 12, m: 0 }}>
      <Head>
        <title>Analyze The Guitar Fretboard In Digits</title>
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
        <meta
          name="description"
          content="Analyzee the Guitar Fretboard on all keys, chorsd, shapes, scales, modes, arpeggios."
        />
      </Head>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🎸 The guitar fretboard in digits :
      </Typography>

      {/* TABS */}
      <Box sx={{ display: "flex", mb: 3 }}>
        {tabs.map((label, idx) => (
          <Button
            key={idx}
            onClick={() => setTab(idx)}
            variant={tab === idx ? "contained" : "outlined"}
            sx={{ flex: 1, borderRadius: 0 }}
          >
            {label}
          </Button>
        ))}
      </Box>


      {/* ===========================================================
          TAB 0 — CHORD ANALYTICS
      ============================================================ */}
      {tab === 0 && (
        <ChordsTab
          boards={chordBoards}
          precomputedStats={precomputedStats?.chords}
          saveStats={saveStats}
          isHomepage={isHomepage}
        />
      )}

      {/* ===========================================================
          TAB 1 — ARPEGGIO ANALYTICS
      ============================================================ */}
      {tab === 1 && (
        <ArpeggiosTab
          boards={arpBoards}
          precomputedStats={precomputedStats?.arpeggios}
          saveStats={saveStats}
          isHomepage={isHomepage}
        />
      )}

      {/* ===========================================================
          TAB 2 — SCALE ANALYTICS
      ============================================================ */}
      {tab === 2 && (
        <ScalesTab
          boards={scaleBoards}
          precomputedStats={precomputedStats?.scales}
          saveStats={saveStats}
          isHomepage={isHomepage}
        />
      )}
    </Box>
  );
}
