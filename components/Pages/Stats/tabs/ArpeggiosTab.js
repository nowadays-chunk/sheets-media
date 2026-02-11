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

    const arpStats = precomputedStats || {
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
    };

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('arpeggios', arpStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, arpStats]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <GraphCard>
                    <Heatmap title="Arpeggio Heatmap" data={arpStats.fretHeatmap} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Arpeggio Note Frequency" data={arpStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Arpeggio Interval Usage" data={arpStats.intervalUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Arpeggio Key Distribution" data={arpStats.keys} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Arpeggio Shape Usage" data={arpStats.shapes} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Mode Occurrence in Arpeggios" data={arpStats.modes} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadarGraph title="Arpeggio String Usage Radar" data={arpStats.radarStrings} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Arpeggio Neck Zones" data={arpStats.neckZones} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <HistogramGraph title="Arpeggio Fret Histogram" data={arpStats.fretHistogram} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RangeGraph title="Arpeggio Fret Range" data={arpStats.fretRanges} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <ScatterGraph title="Arpeggio Fret vs String Scatter" data={arpStats.scatter} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <TreemapGraph title="Arpeggio Note Treemap" data={arpStats.treemap} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <LineGraph title="Arpeggio Note Popularity Trend" data={arpStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadialBarGraph title="Arpeggio Radial Note Distribution" data={arpStats.noteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <FlowGraph title="Arpeggio Flow Pattern" data={arpStats.flow} />
                </GraphCard>
            </Grid>
        </Grid>
    );
}
