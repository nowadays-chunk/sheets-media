import React from "react";
import { Button, Box, Typography, Grid, Paper, Stack, Divider, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Link from "next/link";
import guitar from "../../../config/guitar";

// ---------------------------------------------------------
// COMPONENT STYLES
// ---------------------------------------------------------

const ControlPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: `1px solid ${theme.palette.divider}`,
}));

const OptionButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'selected' })(
  ({ theme, selected }) => ({
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: selected ? 600 : 500,
    margin: "4px",
    background: selected ? "#1976d2" : "transparent",
    color: selected ? "#fff" : "#1976d2",
    border: `1px solid ${selected ? "#1976d2" : theme.palette.divider}`,
    "&:hover": {
      background: selected ? "#11529b" : "rgba(25,118,210,0.1)",
      border: `1px solid ${selected ? "#11529b" : theme.palette.primary.main}`,
    },
    transition: 'all 0.2s ease',
    minWidth: '60px',
  })
);

const StepLabel = styled(Typography)(({ theme }) => ({
  variant: "subtitle2",
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(1),
  letterSpacing: '1px',
}));

const slugSharp = (s) => (s || "").replace("#", "sharp");

const FretboardControls = ({
  choice,
  handleChoiceChange,
  selectedKey,
  onElementChange,
  scaleModes,
  arppegiosNames,
  onCleanFretboard,
  selectedMode,
  selectedScale,
  selectedChord,
  selectedArppegio,
  selectedShape,
  saveProgression,
  playSelectedNotes,
  progression,
  createNewBoardDisplay,
  boards,
  selectedFretboardIndex,
  setSelectedFretboardIndex
}) => {
  const theme = useTheme();
  const keysSharps = guitar.notes.sharps;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const resetAll = () => {
    onCleanFretboard();
    onElementChange(-1, "key");
    onElementChange(-1, "scale");
    onElementChange(-1, "mode");
    onElementChange("", "chord");
    onElementChange(-1, "arppegio");
    onElementChange("", "shape");
  };

  const buildSpreadingPath = () => {
    const keyName = keysSharps[selectedKey];
    if (!keyName) return null;

    const keySlug = slugSharp(keyName);

    if (choice === "chord") {
      if (!selectedChord) return null;
      return `/spreading/chords/${keySlug}/${slugSharp(selectedChord)}`;
    }

    if (choice === "arppegio") {
      if (!selectedArppegio) return null;
      return `/spreading/arppegios/${keySlug}/${slugSharp(selectedArppegio)}`;
    }

    if (choice === "scale") {
      if (!selectedScale) return null;

      const scaleObj = guitar.scales[selectedScale];

      if (scaleObj?.isModal) {
        if (selectedMode === "" || selectedMode == null) return null;
        const modeName = scaleModes[Number(selectedMode)]?.name;
        if (!modeName) return null;
        const modeSlug = modeName.toLowerCase().replace(/\s+/g, "-");
        return `/spreading/scales/${keySlug}/${selectedScale}/modal/${modeSlug}`;
      }

      return `/spreading/scales/${keySlug}/${selectedScale}/single`;
    }

    return null;
  };

  const spreadingPath = buildSpreadingPath();
  const canOpenSpreading = !!spreadingPath;

  return (
    <ControlPanel>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Controls</Typography>
        <IconButton onClick={resetAll} size="small" color="primary" title="Reset All">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>


      {/* BOARD SWITCHER */}
      {boards && boards.length > 1 && (
        <StyledPaper elevation={0}>
          <SectionTitle>Active Board</SectionTitle>
          <Grid container spacing={1}>
            {boards.map((b, i) => (
              <Grid item xs={3} key={b.id}>
                <OptionButton
                  selected={props.selectedFretboardIndex === i}
                  onClick={() => props.setSelectedFretboardIndex(i)}
                  sx={{ justifyContent: 'center', minWidth: 'auto', px: 1 }}
                >
                  {i + 1}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* CATEGORY SELECTION - STEP 1 */}
      <StyledPaper elevation={0}>
        <StepLabel>Step 1: Category</StepLabel>
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {['scale', 'chord', 'arppegio'].map((cat) => (
            <OptionButton
              key={cat}
              selected={choice === cat}
              onClick={() => handleChoiceChange(cat)}
              sx={{ justifyContent: 'center' }}
            >
              {capitalize(cat === 'arppegio' ? 'Arpeggios' : cat + 's')}
            </OptionButton>
          ))}
        </Stack>
      </StyledPaper>

      {/* KEY SELECTION - STEP 2 */}
      {choice && (
        <StyledPaper elevation={0}>
          <StepLabel>Step 2: Key</StepLabel>
          <Grid container spacing={0.5}>
            {keysSharps.map((k, index) => (
              <Grid item xs={3} key={index}>
                <OptionButton
                  selected={selectedKey === index}
                  onClick={() => onElementChange(index, "key")}
                  sx={{ justifyContent: 'center', minWidth: 'auto', width: '100%', px: 0 }}
                >
                  {k}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* TYPE SELECTION - STEP 3 */}
      {(choice && selectedKey !== "" && selectedKey !== -1) && (
        <StyledPaper elevation={0}>
          <StepLabel>Step 3: {choice === 'arppegio' ? 'Arpeggio' : capitalize(choice)} Type</StepLabel>
          <Grid container spacing={0.5}>
            {choice === "scale" && Object.keys(guitar.scales).map((scaleName, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedScale === scaleName}
                  onClick={() => onElementChange(scaleName, "scale")}
                  sx={{ width: '100%' }}
                >
                  {capitalize(scaleName)}
                </OptionButton>
              </Grid>
            ))}

            {choice === "chord" && Object.keys(guitar.arppegios).map((ch, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedChord === ch}
                  onClick={() => onElementChange(ch, "chord")}
                  sx={{ width: '100%' }}
                >
                  {ch}
                </OptionButton>
              </Grid>
            ))}

            {choice === "arppegio" && arppegiosNames.map((arp, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedArppegio === arp}
                  onClick={() => onElementChange(arp, "arppegio")}
                  sx={{ width: '100%' }}
                >
                  {arp}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* MODES - STEP 4 */}
      {choice === "scale" &&
        selectedScale &&
        guitar.scales[selectedScale]?.isModal &&
        scaleModes.length > 0 && (
          <StyledPaper elevation={0}>
            <StepLabel>Step 4: Modes</StepLabel>
            <Grid container spacing={0.5}>
              {scaleModes.map((m, i) => (
                <Grid item xs={6} key={i}>
                  <OptionButton
                    selected={Number(selectedMode) === i}
                    onClick={() => onElementChange(i, "mode")}
                    sx={{ width: '100%' }}
                  >
                    {m.name}
                  </OptionButton>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        )}

      {/* SHAPE SELECTION - STEP 5/4 */}
      <StyledPaper elevation={0}>
        <StepLabel>Step {choice === 'scale' && selectedScale && guitar.scales[selectedScale]?.isModal ? '5' : '4'}: Shape</StepLabel>
        <Grid container spacing={0.5}>
          {guitar.shapes.names.map((shape, i) => (
            <Grid item xs={4} key={i}>
              <OptionButton
                selected={selectedShape === shape}
                onClick={() => onElementChange(shape, "shape")}
                sx={{ justifyContent: 'center', width: '100%' }}
              >
                {shape}
              </OptionButton>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>

      {/* ACTIONS */}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Divider sx={{ my: 1 }} />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="error" // Or primary, depending on theme preference. Error implies 'clear' action
              startIcon={<CleaningServicesIcon />}
              onClick={onCleanFretboard}
              sx={{ borderRadius: 2 }}
            >
              Clean
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={createNewBoardDisplay}
              sx={{ borderRadius: 2, color: 'white' }}
            >
              Add Fretboard
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={playSelectedNotes}
              sx={{ borderRadius: 2 }}
            >
              Play Sound
            </Button>
          </Grid>

          <Grid item xs={12}>
            {canOpenSpreading ? (
              <Link
                href={spreadingPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", width: '100%' }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  startIcon={<LibraryBooksIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Read Theory
                </Button>
              </Link>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                disabled
                startIcon={<LibraryBooksIcon />}
                sx={{ borderRadius: 2 }}
              >
                Read Theory
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </ControlPanel>
  );
};

FretboardControls.propTypes = {
  handleChoiceChange: PropTypes.func.isRequired,
  selectedKey: PropTypes.any,
  scaleModes: PropTypes.array.isRequired,
  arppegiosNames: PropTypes.array.isRequired,
  choice: PropTypes.string.isRequired,
  onCleanFretboard: PropTypes.func.isRequired,
  selectedMode: PropTypes.any,
  selectedScale: PropTypes.string,
  selectedChord: PropTypes.string,
  selectedShape: PropTypes.string,
  selectedArppegio: PropTypes.string,
  saveProgression: PropTypes.func.isRequired,
  progression: PropTypes.array,
  onElementChange: PropTypes.func.isRequired,
  playSelectedNotes: PropTypes.func.isRequired,
};

export default FretboardControls;
