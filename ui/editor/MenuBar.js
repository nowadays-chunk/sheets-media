// ui/editor/MenuBar.jsx
import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import FileMenu from "./FileMenu";
import { useScore } from "@/core/editor/ScoreContext";

export default function MenuBar() {
  const { undoAction, redoAction } = useScore();
  const [anchorEdit, setAnchorEdit] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        padding: 1,
        borderBottom: "1px solid #ddd",
        background: "#eee",
      }}
    >
      <FileMenu />

      <Button onClick={(e) => setAnchorEdit(e.currentTarget)}>Edit</Button>
      <Menu
        anchorEl={anchorEdit}
        open={Boolean(anchorEdit)}
        onClose={() => setAnchorEdit(null)}
      >
        <MenuItem onClick={() => { undoAction(); setAnchorEdit(null); }}>Undo</MenuItem>
        <MenuItem onClick={() => { redoAction(); setAnchorEdit(null); }}>Redo</MenuItem>
      </Menu>

      <Button disabled>View</Button>
      <Button disabled>Help</Button>
    </Box>
  );
}
