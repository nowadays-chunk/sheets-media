import React, { useMemo } from "react";
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

export default function OverviewTab({ boards }) {

    const allNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const allIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const allKeyUsage = useMemo(() => buildKeyUsage(boards), [boards]);
    const allShapeUsage = useMemo(() => buildShapeUsage(boards), [boards]);
    const allModeUsage = useMemo(() => buildModeUsage(boards), [boards]);
    const allNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const allFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const allFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const allFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const allTreemapNotes = useMemo(() => buildTreemapNotes(boards), [boards]);
    const allScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const allRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const allFlow = useMemo(() => buildChordFlow(boards), [boards]);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <GraphCard>
                    <Heatmap title="Fretboard Heatmap (All Data)" data={allFretHeatmap} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Global Note Frequency" data={allNoteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Interval Usage Ratio" data={allIntervalUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <BarGraph title="Key Usage Distribution" data={allKeyUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Shape Preference Distribution" data={allShapeUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <BarGraph title="Mode Usage" data={allModeUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadarGraph title="String Usage Radar" data={allRadarStrings} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <PieGraph title="Neck Zones Heat Distribution" data={allNeckZones} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <HistogramGraph title="Fret Density Histogram" data={allFretHistogram} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RangeGraph title="Fret Range Analysis" data={allFretRanges} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <ScatterGraph title="Fret vs String Density Map" data={allScatter} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <TreemapGraph title="Note Importance (Treemap)" data={allTreemapNotes} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <LineGraph title="Notes Trend (Sorted Alphabetically)" data={allNoteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12} md={6}>
                <GraphCard>
                    <RadialBarGraph title="Radial Distribution of Notes" data={allNoteUsage} />
                </GraphCard>
            </Grid>
            <Grid item xs={12}>
                <GraphCard>
                    <FlowGraph title="Chord / Scale Flow Transitions" data={allFlow} />
                </GraphCard>
            </Grid>
        </Grid>
    );
}
