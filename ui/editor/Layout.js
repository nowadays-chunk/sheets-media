// ui/editor/Layout.jsx
import React from "react";
import PalettePanel from "./PalettePanel";
import ScoreCanvas from "./ScoreCanvas";
import InspectorPanel from "./InspectorPanel";
import MusicApp from "@/components/Containers/MusicApp";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        position: 'fixed',
        top: 211, // 65 + 40 + 50 + 56 (TransportBar)
        left: 0,
        width: "100%",
        height: "calc(100vh - 211px)", // Subtract top offset
        overflow: "hidden",
        zIndex: 1, // Below toolbars but above page content
      }}
    >
      <PalettePanel />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          minWidth: 0, // Allow flex shrinking
        }}
      >
        {/* FRETBOARD & CONTROLS */}
        <div
          style={{
            flexShrink: 0,
            height: "auto",
            maxHeight: "50%",
          }}
        >
          <MusicApp
            board="compose"
            showFretboardControls={false}
            showCircleOfFifths={false}
            showFretboard={true}
            showChordComposer={false}
            showProgressor={false}
            showSongsSelector={false}
          />
        </div>

        {/* SCORE + TAB TOGGLE + SVG */}
        <ScoreCanvas />
      </div>

      <InspectorPanel />
    </div>
  );
}
