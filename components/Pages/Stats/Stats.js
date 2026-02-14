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
  Paper,
  Divider
} from "@mui/material";


import ChordsTab from "./tabs/ChordsTab";
import ArpeggiosTab from "./tabs/ArpeggiosTab";
import ScalesTab from "./tabs/ScalesTab";

import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../../data/seo';

export default function Stats({
  boards = [],
  chords: initialChords = [],
  arpeggios: initialArpeggios = [],
  scales: initialScales = [],
  /* ---------------------------------------------------------
  // PRECOMPUTED STATS HANDLING
  // --------------------------------------------------------- */
  usage: initialUsage = null,
  precomputedStats: initialPrecomputedStats = {},
  p // padding between /play page and /stats page
}) {
  const [tab, setTab] = useState(0);
  const [usage, setUsage] = useState(initialUsage);
  const [precomputedStats, setPrecomputedStats] = useState(initialPrecomputedStats);
  const [loading, setLoading] = useState(false);

  // Client-side fetching of full stats if not provided (Stats page)
  React.useEffect(() => {
    async function fetchStats() {
      // If we are on stats page (not homepage) and don't have usage data
      if (boards.length === 0 && (!usage || Object.keys(usage).length === 0)) {
        setLoading(true);
        try {
          const [usageRes, chordsRes, arpsRes, scalesRes] = await Promise.all([
            fetch('/data/stats/usage.json'),
            fetch('/data/stats/chords.json'),
            fetch('/data/stats/arpeggios.json'),
            fetch('/data/stats/scales.json')
          ]);

          const [usageData, chordsData, arpsData, scalesData] = await Promise.all([
            usageRes.ok ? usageRes.json() : {},
            chordsRes.ok ? chordsRes.json() : {},
            arpsRes.ok ? arpsRes.json() : {},
            scalesRes.ok ? scalesRes.json() : {}
          ]);

          setUsage(usageData);
          setPrecomputedStats({
            chords: chordsData,
            arpeggios: arpsData,
            scales: scalesData
          });
        } catch (error) {
          console.error("Error fetching client-side stats:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [boards.length, usage]);

  // ---------------------------------------------------------
  // DETECT HOMEPAGE
  // ---------------------------------------------------------
  const isHomepage =
    boards.length > 0 &&
    initialChords.length === 0 &&
    initialArpeggios.length === 0 &&
    initialScales.length === 0 &&
    (!usage || Object.keys(usage).length === 0);

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

    // Stats page: merge chords + arpeggios + scales from precomputed state
    return [
      ...(precomputedStats?.chords || []),
      ...(precomputedStats?.arpeggios || []),
      ...(precomputedStats?.scales || [])
    ];
  }, [boards, precomputedStats, isHomepage]);


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
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
        🎸 Fretboard Analytics
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.1)' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
          CURRENT ANALYSIS: {isHomepage ? "Active Session Data" : `Full ${tabs[tab]} Dataset`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isHomepage
            ? `You are currently analyzing the ${sourceBoards.length} fretboard(s) currently open in your play session. This data reflects your specific selections of keys, shapes, and musical structures.`
            : `You are analyzing the comprehensive database of ${tabs[tab].toLowerCase()}. This statistical overview represents the mathematical possibilities and geometric distributions across all keys and positions on the guitar neck.`
          }
        </Typography>
      </Paper>

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
