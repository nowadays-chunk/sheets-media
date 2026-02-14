import React, { useMemo, useEffect } from "react";
import { Grid } from "@mui/material";
import {
    Heatmap,
    BarGraph,
    PieGraph,
    RadarGraph,
    HistogramGraph,
    RangeGraph,
    ScatterGraph,
    TreemapGraph,
    LineGraph,
    RadialBarGraph,
    FlowGraph
} from "../Charts";
import {
    combineStats
} from "../utils";

import Interpretation from "../Interpretation";

export default function ArpeggiosTab({ boards, precomputedStats, saveStats, isHomepage }) {

    const _arpNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const _arpIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const _arpNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const _arpFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const _arpFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const _arpFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const _arpTreemap = useMemo(() => buildTreemapNotes(boards), [boards]);
    const _arpScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const _arpKeys = useMemo(() => buildKeyUsage(boards), [boards]);
    const _arpShapes = useMemo(() => buildShapeUsage(boards), [boards]);
    const _arpFlow = useMemo(() => buildChordFlow(boards), [boards]);
    const _arpRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const _arpModes = useMemo(() => buildModeUsage(boards), [boards]);

    const arpStats = useMemo(() => combineStats({
        noteUsage: _arpNoteUsage,
        intervalUsage: _arpIntervalUsage,
        neckZones: _arpNeckZones,
        fretHeatmap: _arpFretHeatmap,
        fretHistogram: _arpFretHistogram,
        fretRanges: _arpFretRanges,
        treemap: _arpTreemap,
        scatter: _arpScatter,
        keys: _arpKeys,
        shapes: _arpShapes,
        flow: _arpFlow,
        radarStrings: _arpRadarStrings,
        modes: _arpModes
    }, precomputedStats), [precomputedStats, _arpNoteUsage, _arpIntervalUsage, _arpNeckZones, _arpFretHeatmap, _arpFretHistogram, _arpFretRanges, _arpTreemap, _arpScatter, _arpKeys, _arpShapes, _arpFlow, _arpRadarStrings, _arpModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('arpeggios', arpStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, arpStats]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Interpretation text="Visualizes the geometric density of arpeggio note placements across the fretboard, representing the spatial distribution of linear harmonic structures." />
                <Heatmap title="Arpeggio Heatmap" data={arpStats.fretHeatmap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Displays the frequency of specific notes within arpeggios, identifying the most common melodic anchors." />
                <BarGraph title="Arpeggio Note Frequency" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Analyzes the intervals that define arpeggio structures, revealing the harmonic skeleton of the analyzed elements." />
                <PieGraph title="Arpeggio Interval Usage" data={arpStats.intervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Identifies the root keys most frequently used in arpeggio practice or analysis sessions." />
                <BarGraph title="Arpeggio Key Distribution" data={arpStats.keys} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Distribution of arpeggios across CAGED shapes, representing positional efficiency." />
                <PieGraph title="Arpeggio Shape Usage" data={arpStats.shapes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Presence of specific modal degrees within arpeggio structures." />
                <BarGraph title="Mode Occurrence in Arpeggios" data={arpStats.modes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Visualizes string workload for arpeggios, highlighting picking patterns and string skipping frequency." />
                <RadarGraph title="Arpeggio String Usage Radar" data={arpStats.radarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Vertical distribution of arpeggios across different neck registers (Open, Mid, High)." />
                <PieGraph title="Arpeggio Neck Zones" data={arpStats.neckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Statistical density of arpeggio notes across the horizontal axis of the fretboard." />
                <HistogramGraph title="Arpeggio Fret Histogram" data={arpStats.fretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="The mathematical range (span) covered by arpeggio patterns on the neck." />
                <RangeGraph title="Arpeggio Fret Range" data={arpStats.fretRanges} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Discrete coordinate mapping of arpeggio note positions across strings and frets." />
                <ScatterGraph title="Arpeggio Fret vs String Scatter" data={arpStats.scatter} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Hierarchical view of note importance within the arpeggio dataset." />
                <TreemapGraph title="Arpeggio Note Treemap" data={arpStats.treemap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Identifies arpeggio notes that appear with statistical significance relative to a uniform distribution." />
                <LineGraph title="Arpeggio Note Popularity Trend" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Polar representation of arpeggio note distribution, highlighting tonal symmetry." />
                <RadialBarGraph title="Arpeggio Radial Note Distribution" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Voice leading and transition patterns between arpeggio nodes." />
                <FlowGraph title="Arpeggio Flow Pattern" data={arpStats.flow} />
            </Grid>
        </Grid>
    );
}
