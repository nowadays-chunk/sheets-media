import React from "react";
import {
    Box,
    Card,
    Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import {
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter,
    Treemap,
    FunnelChart, Funnel, LabelList,
    RadialBarChart, RadialBar,
    ComposedChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    ZAxis,
    ResponsiveContainer
} from "recharts";

import { COLORS } from "./utils"; // Import COLORS from utils

// ---------------------------------------------
// BASIC CARD STYLE
// ---------------------------------------------
export const StatCard = styled(Card)({
    borderRadius: "14px",
    padding: "0px",
    marginBottom: "24px",
    background: "#ffffff",
    width: "100%",
    boxShadow: "none",
});

export const GraphCard = styled(Card)({
    borderRadius: "2px",               // required
    border: "1px solid rgba(73, 58, 58, 0.3)",          // dark outline
    padding: "10px",
    overflow: "hidden",                // prevents drift
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    background: "#fff",
    width: "100%",
});

// ---------------------------------------------
// BAR GRAPH
// ---------------------------------------------
export const BarGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// PIE GRAPH
// ---------------------------------------------
export const PieGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} label>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// LINE GRAPH
// ---------------------------------------------
export const LineGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#1976d2" />
            </LineChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// AREA GRAPH
// ---------------------------------------------
export const AreaGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#1976d2" fill="url(#colorUv)" />
            </AreaChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// SCATTER GRAPH
// ---------------------------------------------
export const ScatterGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="x" name="Fret" />
                <YAxis dataKey="y" name="String" />
                <ZAxis dataKey="z" range={[10, 50]} />
                <Tooltip />
                <Scatter data={data} fill="#1976d2" />
            </ScatterChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// TREEMAP
// ---------------------------------------------
export const TreemapGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <Treemap
                data={data}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#1976d2"
            />
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// RADAR GRAPH
// ---------------------------------------------
export const RadarGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Usage" dataKey="value" stroke="#1976d2" fill="#1976d2" fillOpacity={0.6} />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// RADIAL BAR
// ---------------------------------------------
export const RadialBarGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
                innerRadius="10%"
                outerRadius="80%"
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
                <Tooltip />
            </RadialBarChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// FUNNEL GRAPH
// ---------------------------------------------
export const FunnelGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
                <Funnel dataKey="value" data={data}>
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                </Funnel>
                <Tooltip />
            </FunnelChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// RANGE GRAPH (MIN/MAX/AVG)
// ---------------------------------------------
export const RangeGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
                <Line type="monotone" dataKey="value" stroke="#d32f2f" />
            </ComposedChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// HISTOGRAM (FRET COUNT)
// ---------------------------------------------
export const HistogramGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#1976d2" />
                <Tooltip />
            </BarChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// FLOW GRAPH (Chord Sequence)
// ---------------------------------------------
export const FlowGraph = ({ data, title }) => (
    <StatCard>
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
        </ResponsiveContainer>
    </StatCard>
);

// ---------------------------------------------
// HEATMAP (FRET INTENSITY)
// ---------------------------------------------
export const Heatmap = ({ data, title }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <StatCard>
            <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
                {data.map((d) => {
                    const intensity = d.value / max;
                    return (
                        <Box
                            key={d.fret}
                            sx={{
                                width: 20,
                                height: 80,
                                backgroundColor: `rgba(25,118,210,${intensity})`,
                                color: intensity > 0.5 ? "#fff" : "#000",
                                fontSize: "0.7rem",
                                textAlign: "center",
                            }}
                        >
                            {d.fret}
                        </Box>
                    );
                })}
            </Box>
        </StatCard>
    );
};
