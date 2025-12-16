// ui/editor/InspectorPanel.jsx
import React, { useEffect, useState } from "react";
import { useScore } from "@/core/editor/ScoreContext";

export default function InspectorPanel() {
  const { selection } = useScore();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    return selection.subscribe(setSelected);
  }, [selection]);

  if (!selected) {
    return <div style={{ padding: 16 }}>No selection</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>Selected Note</h3>
      <pre style={{ fontSize: 12 }}>
        {JSON.stringify(selected.serialize(), null, 2)}
      </pre>
    </div>
  );
}
