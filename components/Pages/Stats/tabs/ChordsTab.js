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
    buildChordFlow
} from "../utils";

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
    const chordStats = useMemo(() => precomputedStats || {
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
    }, [precomputedStats, _chordNoteUsage, _chordIntervalUsage, _chordNeckZones, _chordFretHeatmap, _chordFretHistogram, _chordFretRanges, _chordTreemap, _chordScatter, _chordKeys, _chordShapes, _chordFlow, _chordRadarStrings, _chordModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('chords', chordStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, chordStats]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Heatmap title="Chord Heatmap" data={chordStats.fretHeatmap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Chord Note Frequency" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Chord Interval Usage" data={chordStats.intervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Chord Keys Distribution" data={chordStats.keys} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Chord Shape Distribution" data={chordStats.shapes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Modal Presence in Chords" data={chordStats.modes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadarGraph title="Chord String Usage Radar" data={chordStats.radarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Chord Neck Zones" data={chordStats.neckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <HistogramGraph title="Chord Fret Density Histogram" data={chordStats.fretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RangeGraph title="Chord Fret Range" data={chordStats.fretRanges} />
            </Grid>
            <Grid item xs={12}>
                <ScatterGraph title="Chord Fret vs String Scatter" data={chordStats.scatter} />
            </Grid>
            <Grid item xs={12}>
                <TreemapGraph title="Chord Note Weights" data={chordStats.treemap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <LineGraph title="Chord Notes Over Representation" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadialBarGraph title="Chord Radial Distribution" data={chordStats.noteUsage} />
            </Grid>
            <Grid item xs={12}>
                <FlowGraph title="Chord Transition Flow" data={chordStats.flow} />
            </Grid>
        </Grid>
    );
}
