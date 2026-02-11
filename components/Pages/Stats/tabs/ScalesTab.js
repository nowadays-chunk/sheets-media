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
    FlowGraph,
    GraphCard
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

    const scaleStats = precomputedStats || {
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
    };

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('scales', scaleStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, scaleStats]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <GraphCard>
                    <Heatmap title="Scale Heatmap" data={scaleStats.fretHeatmap} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Scale Note Frequency" data={scaleStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Scale Interval Distribution" data={scaleStats.intervalUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Scale Key Distribution" data={scaleStats.keys} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Scale Shape Distribution" data={scaleStats.shapes} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Mode Distribution (Scales)" data={scaleStats.modes} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadarGraph title="Scale String Usage Radar" data={scaleStats.radarStrings} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Scale Neck Zones Distribution" data={scaleStats.neckZones} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <HistogramGraph title="Scale Fret Histogram" data={scaleStats.fretHistogram} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RangeGraph title="Scale Fret Range" data={scaleStats.fretRanges} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <ScatterGraph title="Scale Fret vs String Scatter" data={scaleStats.scatter} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <TreemapGraph title="Scale Note Treemap" data={scaleStats.treemap} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <LineGraph title="Scale Note Trend" data={scaleStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadialBarGraph title="Scale Radial Note Distribution" data={scaleStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <FlowGraph title="Scale Flow Pattern" data={scaleStats.flow} />
                </GraphCard>
            </Grid>
        </Grid>
    );
}
