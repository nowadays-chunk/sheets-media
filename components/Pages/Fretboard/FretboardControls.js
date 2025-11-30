import React from 'react';
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import guitar from '../../../config/guitar.js';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const FullWidthButton = styled(Button)({
  width: '100%',
});

const SelectContainer = styled(FormControl)({
  width: '100%',
});

const ButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
});

// ---------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------
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
  selectedFret,
  selectedShape,
  saveProgression,
  playSelectedNotes,
  progression,
}) => {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const slugSharp = (s) => (s || '').replace('#', 'sharp');

  const buildReferencePath = () => {
    const keyName = guitar.notes.sharps[selectedKey];
    if (!keyName) return null;

    const keySlug = slugSharp(keyName);

    if (choice === 'chord') {
      if (!selectedChord) return null;
      const chordSlug = slugSharp(selectedChord);
      return `/references/chords/${keySlug}/${chordSlug}`;
    }

    if (choice === 'arppegio') {
      if (!selectedArppegio) return null;
      const arpSlug = slugSharp(selectedArppegio);
      return `/references/arppegios/${keySlug}/${arpSlug}`;
    }

    if (choice === 'scale') {
      if (!selectedScale) return null;

      if (guitar.scales[selectedScale]?.isModal) {
        if (selectedMode === '' || selectedMode == null) return null;

        const modeIndex = parseInt(selectedMode, 10);
        const modeName = scaleModes[modeIndex]?.name;
        if (!modeName) return null;

        const modeSlug = modeName.toLowerCase().replace(/\s+/g, '-');
        return `/references/scales/${keySlug}/${selectedScale}/modal/${modeSlug}`;
      }

      return `/references/scales/${keySlug}/${selectedScale}/single`;
    }

    return null;
  };

  const printUrl = (url) => {
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) return;

    const tryPrint = () => {
      try {
        w.focus();
        w.print();
      } catch {}
    };

    w.onload = () => setTimeout(tryPrint, 300);
    setTimeout(tryPrint, 1500);
  };

  const handlePrintTwoPages = () => {
    const refPath = buildReferencePath();
    if (!refPath) return;

    const origin = window.location.origin;

    printUrl(origin + refPath);
    printUrl(origin + refPath.replace('/references/', '/spreading/'));
  };

  const canPrint = !!buildReferencePath();

  // ---------------------------------------------------------
  // JSX
  // ---------------------------------------------------------
  return (
    <footer>

      {/* ------------------- OUTLINED TABS ------------------- */}
      <Tabs
        value={choice}
        onChange={(e, val) => handleChoiceChange(val)}
        TabIndicatorProps={{ style: { display: 'none' } }}
        sx={{
          width: '100%',
          display: 'flex',
          border: '1px solid #ccc',
          padding: 0,
          margin: 0,
          minHeight: 45,
        }}
      >
        <Tab
          label="Scales"
          value="scale"
          sx={{
            flex: 1,
            minHeight: 45,
            margin: 0,
            borderRight: '1px solid #ccc',
            '&.Mui-selected': {
              backgroundColor: '#e0e0e0',
            },
          }}
        />

        <Tab
          label="Chords"
          value="chord"
          sx={{
            flex: 1,
            minHeight: 45,
            margin: 0,
            borderRight: '1px solid #ccc',
            '&.Mui-selected': {
              backgroundColor: '#e0e0e0',
            },
          }}
        />

        <Tab
          label="Arpeggios"
          value="arppegio"
          sx={{
            flex: 1,
            minHeight: 45,
            margin: 0,
            '&.Mui-selected': {
              backgroundColor: '#e0e0e0',
            },
          }}
        />
      </Tabs>

      <Grid container spacing={2} style={{ marginTop: 10 }}>
        {/* ---------------------------------------------------
            SCALE FORM
        --------------------------------------------------- */}
        {choice === 'scale' && (
          <>
            <Grid item xs={12}>
              <KeySelector
                selectedKey={selectedKey}
                onElementChange={onElementChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectContainer variant="outlined">
                <Select
                  label=""
                  value={selectedScale || ''}
                  onChange={(e) => onElementChange(e.target.value, 'scale')}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Choose Scale</em>
                  </MenuItem>

                  {Object.keys(guitar.scales).map((s, i) => (
                    <MenuItem key={i} value={s}>
                      {capitalize(s)}
                    </MenuItem>
                  ))}
                </Select>
              </SelectContainer>
            </Grid>

            {scaleModes.length > 0 && (
              <Grid item xs={12}>
                <SelectContainer variant="outlined">
                  <Select
                    label=""
                    value={selectedMode === '' || selectedMode == null ? '' : Number(selectedMode)}
                    onChange={(e) => onElementChange(e.target.value, 'mode')}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Choose Mode</em>
                    </MenuItem>

                    {scaleModes.map((m, i) => (
                      <MenuItem key={i} value={Number(i)}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </SelectContainer>
              </Grid>
            )}
          </>
        )}

        {/* ---------------------------------------------------
            CHORD FORM
        --------------------------------------------------- */}
        {choice === 'chord' && (
          <>
            <Grid item xs={12}>
              <KeySelector
                selectedKey={selectedKey}
                onElementChange={onElementChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectContainer variant="outlined">
                <Select
                  label=""
                  value={selectedChord || ''}
                  onChange={(e) => onElementChange(e.target.value, 'chord')}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Choose Chord</em>
                  </MenuItem>

                  {Object.keys(guitar.arppegios).map((c, i) => (
                    <MenuItem key={i} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </SelectContainer>
            </Grid>
          </>
        )}

        {/* ---------------------------------------------------
            ARPEGGIO FORM
        --------------------------------------------------- */}
        {choice === 'arppegio' && (
          <>
            <Grid item xs={12}>
              <KeySelector
                selectedKey={selectedKey}
                onElementChange={onElementChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectContainer variant="outlined">
                <Select
                  label=""
                  value={selectedArppegio || ''}
                  onChange={(e) => onElementChange(e.target.value, 'arppegio')}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Choose Arpeggio</em>
                  </MenuItem>

                  {arppegiosNames.map((a, i) => (
                    <MenuItem key={i} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </SelectContainer>
            </Grid>
          </>
        )}

        {/* ---------------------------------------------------
            SHAPE SELECT
        --------------------------------------------------- */}
        <Grid item xs={12}>
          <SelectContainer variant="outlined">
            <Select
              label=""
              value={selectedShape || ''}
              onChange={(e) => onElementChange(e.target.value, 'shape')}
              displayEmpty
            >
              <MenuItem value="">
                <em>Choose Shape</em>
              </MenuItem>

              {guitar.shapes.names.map((shape, i) => (
                <MenuItem key={i} value={shape}>
                  {shape}
                </MenuItem>
              ))}
            </Select>
          </SelectContainer>
        </Grid>

        {/* ---------------------------------------------------
            BUTTONS
        --------------------------------------------------- */}
        <Grid item xs={6}>
          <FullWidthButton
            variant="contained"
            color="primary"
            onClick={onCleanFretboard}
          >
            Clean
          </FullWidthButton>
        </Grid>

        <Grid item xs={6}>
          <FullWidthButton
            variant="contained"
            color="secondary"
            onClick={saveProgression}
            disabled={!progression || progression.length === 0}
          >
            Save
          </FullWidthButton>
        </Grid>

        <Grid item xs={6}>
          <FullWidthButton
            onClick={playSelectedNotes}
            variant="contained"
            color="primary"
          >
            Play Sound
          </FullWidthButton>
        </Grid>

        <Grid item xs={6}>
          <FullWidthButton
            onClick={handlePrintTwoPages}
            variant="contained"
            color="success"
            disabled={!canPrint}
          >
            Print (Refs + Spread)
          </FullWidthButton>
        </Grid>
      </Grid>
    </footer>
  );
};

// ---------------------------------------------------------
// KEY SELECTOR
// ---------------------------------------------------------
export const KeySelector = ({ selectedKey, onElementChange }) => (
  <SelectContainer variant="outlined">
    <Select
      label=""
      value={selectedKey ?? ''}
      onChange={(e) => onElementChange(e.target.value, 'key')}
      displayEmpty
    >
      <MenuItem value="">
        <em>Choose Key</em>
      </MenuItem>

      {guitar.notes.sharps.map((key, index) => (
        <MenuItem key={index} value={index}>
          {key}
        </MenuItem>
      ))}
    </Select>
  </SelectContainer>
);

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
  selectedFret: PropTypes.string,
  saveProgression: PropTypes.func.isRequired,
  progression: PropTypes.array,
  onElementChange: PropTypes.func.isRequired,
  playSelectedNotes: PropTypes.func.isRequired,
};

export default FretboardControls;
