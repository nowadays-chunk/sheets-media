// ===========================================
//   SongsSelector.jsx (FULL LYRICS VERSION)
// ===========================================

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/system';
import guitar from '../../../config/guitar';
import { mostCommonSongs } from '../../../config/mostCommonSongs';

/* -------------------- Styles -------------------- */
const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledButton = styled(Button)({
  borderRadius: '20px',
  margin: '10px',
});

const BackButton = styled(Button)({
  margin: 20,
  borderRadius: '20px',
});

const SectionContainer = styled('div')({
  marginBottom: '30px',
});

const BarRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  marginLeft: 20,
  marginBottom: 20,
  alignItems: 'flex-start',
});

const ChordBox = styled('div')({
  padding: '8px 12px',
  marginRight: 10,
  borderRadius: 8,
  background: '#fafafa',
  border: '1px solid #ccc',
  minWidth: 55,
  textAlign: 'center',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: 14,
  transition: '0.2s',
  '&:hover': {
    background: '#f0f0f0',
    transform: 'scale(1.05)',
  },
});

const StyledCard = styled(Card)({
  minWidth: 180,
  cursor: 'pointer',
  margin: '10px',
  transition: 'transform 0.3s ease',
  '&:hover': { transform: 'scale(1.03)' },
});

/* -------------------- Parse Chord -------------------- */
function parseChordName(chordName) {
  let root = chordName[0];
  if (chordName[1] === "#" || chordName[1] === "b") root += chordName[1];

  const remainder = chordName.slice(root.length);
  let degree = remainder.startsWith("m") ? "min" : "M";

  const keyIndex = guitar.notes.sharps.indexOf(root);

  return { name: degree, root, chord: chordName, key: keyIndex };
}

/* -------------------- Flatten Bars -------------------- */
const buildFullBars = (song) => {
  const bars = [];
  let barCount = 1;

  song.sections.forEach((section) => {
    for (let r = 0; r < section.repeat; r++) {
      section.bars.forEach((bar) => {
        bars.push({
          number: barCount++,
          chords: bar.chords.map((ch) => {
            const parsed = parseChordName(ch.name);
            return {
              ...parsed,
              shape: ch.shape,
              fret: ch.fret,
            };
          }),
          lyrics: bar.lyrics || [],
        });
      });
    }
  });

  return bars;
};

/* -------------------- Component -------------------- */
const SongsSelector = ({ playProgression, playSingleChord }) => {
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(mostCommonSongs.songs);
  const [showSongView, setShowSongView] = useState(false);
  const [tabView, setTabView] = useState('bars');

  const selectedSong =
    selectedSongIndex !== null ? filteredSongs[selectedSongIndex] : null;

  /* -------------------- Play Section -------------------- */
  const handlePlaySection = (section) => {
    const chords = [];

    for (let r = 0; r < section.repeat; r++) {
      section.bars.forEach((bar) => {
        bar.chords.forEach((ch) => {
          const parsed = parseChordName(ch.name);
          chords.push({
            ...parsed,
            shape: ch.shape,
            fret: ch.fret,
          });
        });
      });
    }

    playProgression(chords);
  };

  /* -------------------- Play Full Song -------------------- */
  const handlePlayFullSong = (song) => {
    const fullBars = buildFullBars(song);
    const flat = [];
    fullBars.forEach((bar) => bar.chords.forEach((c) => flat.push(c)));
    playProgression(flat);
  };

  /* -------------------- Genre Filter -------------------- */
  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    const filtered = mostCommonSongs.songs.filter((s) =>
      s.genre.toLowerCase().includes(genre.toLowerCase())
    );
    setFilteredSongs(filtered);
    setSelectedSongIndex(null);
  };

  const uniqueGenres = Array.from(
    new Set(mostCommonSongs.songs.map((s) => s.genre))
  );

  /* -------------------- Render -------------------- */
  return (
    <Root>
      {showSongView && selectedSong ? (
        <>
          <Typography variant="h5" style={{ marginLeft: 20, marginTop: 10 }}>
            {selectedSong.title} – {selectedSong.artist}
          </Typography>

          <BackButton
            variant="outlined"
            onClick={() => {
              setShowSongView(false);
              setSelectedSongIndex(null);
            }}
          >
            Back
          </BackButton>

          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 20, marginBottom: 20 }}
            onClick={() => handlePlayFullSong(selectedSong)}
          >
            Play Full Song
          </Button>

          {/* ===================== TABS ===================== */}
          <Tabs
            value={tabView}
            onChange={(e, v) => setTabView(v)}
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              width: '100%',
              minWidth: '100%',
              display: 'flex',
              border: '1px solid #ccc',
              marginBottom: 2,
              padding: 0,
            }}
          >
            <Tab
              label="All Bars"
              value="bars"
              sx={{
                flex: 1,
                maxWidth: '50%',
                margin: 0,
                borderRight: '1px solid black',
                '&.Mui-selected': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            />
            <Tab
              label="Sections"
              value="sections"
              sx={{
                flex: 1,
                maxWidth: '50%',
                margin: 0,
                '&.Mui-selected': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            />
          </Tabs>

          {/* ===================== BARS VIEW ===================== */}
          {tabView === 'bars' && (
            <>
              <Typography variant="h6" style={{ marginLeft: 20 }}>
                Full Bars List
              </Typography>

              {buildFullBars(selectedSong).map((bar) => (
                <BarRow key={bar.number}>

                  <Typography
                    variant="body2"
                    style={{ width: 60, fontWeight: 'bold', marginRight: 15 }}
                  >
                    Bar {bar.number}
                  </Typography>

                  {/* Chords + Lyrics */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* CHORD ROW */}
                    <div style={{ display: 'flex' }}>
                      {bar.chords.map((ch, i) => (
                        <ChordBox key={i} onClick={() => playSingleChord(ch)}>
                          {ch.root}{ch.name === "min" ? "m" : ""}
                        </ChordBox>
                      ))}
                    </div>

                    {/* LYRICS ROW */}
                    <div style={{ display: 'flex', marginTop: 4 }}>
                      {bar.lyrics?.map((ly, i) => (
                        <Typography
                          key={i}
                          variant="caption"
                          style={{
                            width: 55,
                            marginRight: 10,
                            textAlign: 'center',
                          }}
                        >
                          {ly}
                        </Typography>
                      ))}
                    </div>
                  </div>
                </BarRow>
              ))}
            </>
          )}

          {/* ===================== SECTIONS VIEW ===================== */}
          {tabView === 'sections' && (
            <>
              {selectedSong.sections.map((section, idx) => (
                <SectionContainer key={idx}>
                  <Typography variant="subtitle1" style={{ marginLeft: 20 }}>
                    {section.name} × {section.repeat}
                  </Typography>

                  {section.bars.map((bar, bIndex) => (
                    <BarRow key={bIndex}>

                      <Typography
                        variant="body2"
                        style={{
                          width: 60,
                          fontWeight: 'bold',
                          marginRight: 15,
                        }}
                      >
                        Bar {bIndex + 1}
                      </Typography>

                      {/* CHORDS + LYRICS */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {/* CHORD ROW */}
                        <div style={{ display: 'flex' }}>
                          {bar.chords.map((ch, i) => {
                            const parsed = parseChordName(ch.name);
                            return (
                              <ChordBox
                                key={i}
                                onClick={() =>
                                  playSingleChord({
                                    ...parsed,
                                    shape: ch.shape,
                                    fret: ch.fret,
                                  })
                                }
                              >
                                {ch.name}
                              </ChordBox>
                            );
                          })}
                        </div>

                        {/* LYRICS ROW */}
                        <div style={{ display: 'flex', marginTop: 4 }}>
                          {bar.lyrics?.map((ly, i) => (
                            <Typography
                              key={i}
                              variant="caption"
                              style={{
                                width: 55,
                                marginRight: 10,
                                textAlign: 'center',
                              }}
                            >
                              {ly}
                            </Typography>
                          ))}
                        </div>
                      </div>
                    </BarRow>
                  ))}

                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ marginLeft: 20 }}
                    onClick={() => handlePlaySection(section)}
                  >
                    Play {section.name}
                  </Button>
                </SectionContainer>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {/* Genres */}
          <Typography variant="h6" style={{ marginLeft: 20, marginTop: 20 }}>
            Genres
          </Typography>

          <div style={{ marginLeft: 20 }}>
            {uniqueGenres.map((genre, i) => (
              <StyledButton
                key={i}
                variant={selectedGenre === genre ? 'contained' : 'outlined'}
                onClick={() => handleGenreFilter(genre)}
              >
                {genre}
              </StyledButton>
            ))}
          </div>

          {/* Song List */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {filteredSongs.map((song, i) => (
              <StyledCard
                key={i}
                onClick={() => {
                  setSelectedSongIndex(i);
                  setShowSongView(true);
                }}
              >
                <CardContent>
                  <Typography variant="h6">{song.title}</Typography>
                  <Typography variant="subtitle1">{song.artist}</Typography>
                  <Typography variant="body2">Key: {song.key}</Typography>
                  <Typography variant="body2">Genre: {song.genre}</Typography>
                  <Typography variant="body2">
                    Sections: {song.sections.length}
                  </Typography>
                </CardContent>
              </StyledCard>
            ))}
          </div>
        </>
      )}
    </Root>
  );
};

export default SongsSelector;
