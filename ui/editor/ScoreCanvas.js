import React, { useEffect, useRef } from "react";
import CombinedRenderer from "@/core/music/render/CombinedRenderer";
import { useScore } from "@/core/editor/ScoreContext";

export default function ScoreCanvas() {
  const containerRef = useRef(null);
  const { score } = useScore();

  useEffect(() => {
    if (!score || !containerRef.current) return;

    new CombinedRenderer({
      container: containerRef.current,
      score
    }).render();

  }, [score]);

  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="notation"></div>
      <div className="tablature"></div>
    </div>
  );
}
