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

    const arpStats = useMemo(() => precomputedStats || {
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
    }, [precomputedStats, _arpNoteUsage, _arpIntervalUsage, _arpNeckZones, _arpFretHeatmap, _arpFretHistogram, _arpFretRanges, _arpTreemap, _arpScatter, _arpKeys, _arpShapes, _arpFlow, _arpRadarStrings, _arpModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('arpeggios', arpStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, arpStats]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Heatmap title="Arpeggio Heatmap" data={arpStats.fretHeatmap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Arpeggio Note Frequency" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Arpeggio Interval Usage" data={arpStats.intervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Arpeggio Key Distribution" data={arpStats.keys} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Arpeggio Shape Usage" data={arpStats.shapes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Mode Occurrence in Arpeggios" data={arpStats.modes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadarGraph title="Arpeggio String Usage Radar" data={arpStats.radarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Arpeggio Neck Zones" data={arpStats.neckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <HistogramGraph title="Arpeggio Fret Histogram" data={arpStats.fretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RangeGraph title="Arpeggio Fret Range" data={arpStats.fretRanges} />
            </Grid>
            <Grid item xs={12}>
                <ScatterGraph title="Arpeggio Fret vs String Scatter" data={arpStats.scatter} />
            </Grid>
            <Grid item xs={12}>
                <TreemapGraph title="Arpeggio Note Treemap" data={arpStats.treemap} />
            </Grid>
            <Grid item xs={12} md={6}>
                <LineGraph title="Arpeggio Note Popularity Trend" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadialBarGraph title="Arpeggio Radial Note Distribution" data={arpStats.noteUsage} />
            </Grid>
            <Grid item xs={12}>
                <FlowGraph title="Arpeggio Flow Pattern" data={arpStats.flow} />
            </Grid>
        </Grid>
    );
}
