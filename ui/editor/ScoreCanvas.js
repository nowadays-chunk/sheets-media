// ui/editor/ScoreCanvas.jsx
import React, { useEffect, useRef } from "react";
import CombinedRenderer from "@/core/music/render/CombinedRenderer";
import { useScore } from "@/core/editor/ScoreContext";

export default function ScoreCanvas() {
  const { score, selection } = useScore();
  const container = useRef(null);
  const renderer = useRef(null);

  useEffect(() => {
    if (!container.current || !score) return;

    renderer.current = new CombinedRenderer(container.current);

    renderer.current.onNoteClick = (note) => {
      selection.select(note);
    };

    renderer.current.render(score);
  }, [score]);

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        overflowX: "auto",
        borderBottom: "1px solid #eee",
      }}
    />
  );
}
