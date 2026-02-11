import React, { useEffect, useRef, useState } from "react";
import CombinedRenderer from "@/core/music/render/CombinedRenderer";
import CursorOverlay from "./CursorOverlay";
import { useScore } from "@/core/editor/ScoreContext";

export default function ScoreCanvas() {
  const notationRef = useRef(null);
  const tabRef = useRef(null);
  const { score, selection } = useScore();

  const [activeTab, setActiveTab] = useState("notation");

  const isReady = score;

  useEffect(() => {
    if (!isReady) return;

    const renderer = new CombinedRenderer({
      notationContainer: notationRef.current,
      tabContainer: tabRef.current,
      score,
      selection
    });

    renderer.render();
  }, [score, isReady]);

  if (!score) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Loading score…
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* TOGGLE BUTTONS */}
      <div
        style={{
          display: "flex",
          width: "100%",
          borderBottom: "1px solid #ccc",
          background: "#fafafa",
          flexShrink: 0
        }}
      >
        <button
          onClick={() => setActiveTab("notation")}
          style={{
            flex: 1,
            padding: "12px 0",
            fontSize: 16,
            fontWeight: activeTab === "notation" ? "bold" : "normal",
            background: activeTab === "notation" ? "#1976d2" : "#eaeaea",
            color: activeTab === "notation" ? "#fff" : "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          SCORE
        </button>

        <button
          onClick={() => setActiveTab("tab")}
          style={{
            flex: 1,
            padding: "12px 0",
            fontSize: 16,
            fontWeight: activeTab === "tab" ? "bold" : "normal",
            background: activeTab === "tab" ? "#1976d2" : "#eaeaea",
            color: activeTab === "tab" ? "#fff" : "#333",
            border: "none",
            cursor: "pointer",
          }}
        >
          TAB
        </button>
      </div>

      {/* SCORE AREA */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          width: "100%"
        }}
      >
        <CursorOverlay activeTab={activeTab} />

        {/* CONTAINER FOR CONTENT TO ENSURE IT CAN GROW HORIZONTALLY */}
        <div style={{ display: "flex", alignItems: "center", minHeight: "100%" }}>
          {/* SCORE SVG */}
          <div
            ref={notationRef}
            className="notation"
            style={{
              display: activeTab === "notation" ? "block" : "none",
            }}
          ></div>

          {/* TAB SVG */}
          <div
            ref={tabRef}
            className="tablature"
            style={{
              display: activeTab === "tab" ? "block" : "none",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
