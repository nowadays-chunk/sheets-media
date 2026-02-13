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

export default function ScalesTab({ boards, precomputedStats, saveStats, isHomepage }) {

    const _scaleNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const _scaleIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const _scaleNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const _scaleFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const _scaleFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const _scaleFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const _scaleTreemap = useMemo(() => buildTreemapNotes(boards), [boards]);
    const _scaleScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const _scaleKeys = useMemo(() => buildKeyUsage(boards), [boards]);
    const _scaleShapes = useMemo(() => buildShapeUsage(boards), [boards]);
    const _scaleFlow = useMemo(() => buildChordFlow(boards), [boards]);
    const _scaleRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const _scaleModes = useMemo(() => buildModeUsage(boards), [boards]);

    const scaleStats = useMemo(() => combineStats({
        noteUsage: _scaleNoteUsage,
        intervalUsage: _scaleIntervalUsage,
        neckZones: _scaleNeckZones,
        fretHeatmap: _scaleFretHeatmap,
        fretHistogram: _scaleFretHistogram,
        fretRanges: _scaleFretRanges,
        treemap: _scaleTreemap,
        scatter: _scaleScatter,
        keys: _scaleKeys,
        shapes: _scaleShapes,
        flow: _scaleFlow,
        radarStrings: _scaleRadarStrings,
        modes: _scaleModes
    }, precomputedStats), [precomputedStats, _scaleNoteUsage, _scaleIntervalUsage, _scaleNeckZones, _scaleFretHeatmap, _scaleFretHistogram, _scaleFretRanges, _scaleTreemap, _scaleScatter, _scaleKeys, _scaleShapes, _scaleFlow, _scaleRadarStrings, _scaleModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('scales', scaleStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, scaleStats]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Heatmap title="Scale Heatmap" data={scaleStats.fretHeatmap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Scale Note Frequency" data={scaleStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Scale Interval Distribution" data={scaleStats.intervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Scale Key Distribution" data={scaleStats.keys} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Scale Shape Distribution" data={scaleStats.shapes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Mode Distribution (Scales)" data={scaleStats.modes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadarGraph title="Scale String Usage Radar" data={scaleStats.radarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Scale Neck Zones Distribution" data={scaleStats.neckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <HistogramGraph title="Scale Fret Histogram" data={scaleStats.fretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RangeGraph title="Scale Fret Range" data={scaleStats.fretRanges} />
            </Grid>
            <Grid item xs={12}>
                <ScatterGraph title="Scale Fret vs String Scatter" data={scaleStats.scatter} />
            </Grid>
            <Grid item xs={12}>
                <TreemapGraph title="Scale Note Treemap" data={scaleStats.treemap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <LineGraph title="Scale Note Trend" data={scaleStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadialBarGraph title="Scale Radial Note Distribution" data={scaleStats.noteUsage} />
            </Grid>
            <Grid item xs={12}>
                <FlowGraph title="Scale Flow Pattern" data={scaleStats.flow} />
            </Grid>
        </Grid>
    );
}
