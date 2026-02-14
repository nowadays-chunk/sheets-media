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
    buildNoteUsage,
    buildIntervalUsage,
    buildKeyUsage,
    buildShapeUsage,
    buildModeUsage,
    buildStringUsage,
    buildNeckZones,
    buildFretHeatmap,
    buildFretHistogram,
    buildFretRanges,
    buildTreemapNotes,
    buildScatterPositions,
    buildRadarStringUsage,
    buildChordFlow,
    combineStats
} from "../utils";

import Interpretation from "../Interpretation";

export default function ChordsTab({ boards, precomputedStats, saveStats, isHomepage }) {

    const _chordNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const _chordIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const _chordNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const _chordFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const _chordFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const _chordFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const _chordTreemap = useMemo(() => buildTreemapNotes(boards), [boards]);
    const _chordScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const _chordKeys = useMemo(() => buildKeyUsage(boards), [boards]);
    const _chordShapes = useMemo(() => buildShapeUsage(boards), [boards]);
    const _chordFlow = useMemo(() => buildChordFlow(boards), [boards]);
    const _chordRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const _chordModes = useMemo(() => buildModeUsage(boards), [boards]);

    // Use precomputed stats if available, otherwise use computed stats
    const chordStats = useMemo(() => combineStats({
        noteUsage: _chordNoteUsage,
        intervalUsage: _chordIntervalUsage,
        neckZones: _chordNeckZones,
        fretHeatmap: _chordFretHeatmap,
        fretHistogram: _chordFretHistogram,
        fretRanges: _chordFretRanges,
        treemap: _chordTreemap,
        scatter: _chordScatter,
        keys: _chordKeys,
        shapes: _chordShapes,
        flow: _chordFlow,
        radarStrings: _chordRadarStrings,
        modes: _chordModes
    }, precomputedStats), [precomputedStats, _chordNoteUsage, _chordIntervalUsage, _chordNeckZones, _chordFretHeatmap, _chordFretHistogram, _chordFretRanges, _chordTreemap, _chordScatter, _chordKeys, _chordShapes, _chordFlow, _chordRadarStrings, _chordModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('chords', chordStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, chordStats]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Interpretation text="Visualizes the geometric density of note placements across the fretboard, representing the spatial distribution of frequencies and finger positioning efficiency." />
                <Heatmap title="Chord Heatmap" data={chordStats.fretHeatmap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Displays the prevalence of specific notes, identifying the tonal center (tonic) and dominant pitch classes within the analyzed set." />
                <BarGraph title="Chord Note Frequency" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Analyzes the mathematical ratios between notes, revealing the harmonic character and dissonance/consonance profile of the structures." />
                <PieGraph title="Chord Interval Usage" data={chordStats.intervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Identifies the most common root keys, reflecting transpositional patterns and proximity within the circle of fifths." />
                <BarGraph title="Chord Keys Distribution" data={chordStats.keys} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Focuses on geometric CAGED patterns, representing the algebraic isomorphism between different fretboard positions of the same harmonic structure." />
                <PieGraph title="Chord Shape Distribution" data={chordStats.shapes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Measures the utilization of specific modal colors, highlighting the tonal variations derived from shifting the starting note of a scale." />
                <BarGraph title="Modal Presence in Chords" data={chordStats.modes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Visualizes workload distribution across strings, showing the mathematical balance between bass and treble registers." />
                <RadarGraph title="Chord String Usage Radar" data={chordStats.radarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Divides the fretboard into Open, Mid, and High segments to represent register usage and melodic range." />
                <PieGraph title="Chord Neck Zones" data={chordStats.neckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="A statistical concentration map of notes on the horizontal axis, identifying the 'gravitational' center of the fretboard usage." />
                <HistogramGraph title="Chord Fret Density Histogram" data={chordStats.fretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Shows the mathematical span (displacement) between the lowest and highest notes, defining the register's reach." />
                <RangeGraph title="Chord Fret Range" data={chordStats.fretRanges} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Maps individual notes as data points in a 2D coordinate system, visualizing the discrete nature of the fretboard grid." />
                <ScatterGraph title="Chord Fret vs String Scatter" data={chordStats.scatter} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Uses area to represent importance, providing a hierarchical visualization of the pitch class set importance." />
                <TreemapGraph title="Chord Note Weights" data={chordStats.treemap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="Highlights pitch classes that occur significantly more often than others, indicating specific tonal biases." />
                <LineGraph title="Chord Notes Over Representation" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Interpretation text="A polar coordinate view of note distribution, emphasizing circular relationships and key symmetry." />
                <RadialBarGraph title="Chord Radial Distribution" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12}>
                <Interpretation text="Visualizes the 'Markov chain' of musical progression, showing how notes or chords lead to one another through voice leading." />
                <FlowGraph title="Chord Transition Flow" data={chordStats.flow} />
            </Grid>
        </Grid>
    );
}
