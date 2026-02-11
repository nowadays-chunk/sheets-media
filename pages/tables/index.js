import React from 'react';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Grid
} from '@mui/material';

const scalesData = [
  { key: "C", notes: ["C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E", "C, C#, D, D#, E"] },
  { key: "C#", notes: ["C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F", "C#, D, D#, E, F"] },
  { key: "D", notes: ["D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#", "D, D#, E, F, F#"] },
  { key: "D#", notes: ["D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G", "D#, E, F, F#, G"] },
  { key: "E", notes: ["E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#", "E, F, F#, G, G#"] },
  { key: "F", notes: ["F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A", "F, F#, G, G#, A"] },
  { key: "F#", notes: ["F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#", "F#, G, G#, A, A#"] },
  { key: "G", notes: ["G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B", "G, G#, A, A#, B"] },
  { key: "G#", notes: ["G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C", "G#, A, A#, B, C"] },
  { key: "A", notes: ["A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#", "A, A#, B, C, C#"] },
  { key: "A#", notes: ["A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D", "A#, B, C, C#, D"] },
  { key: "B", notes: ["B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#", "B, C, C#, D, D#"] },
];

const relativesData = [
  { key: "C", rel: "Am", chords: ["C maj", "D min", "E min", "F maj", "G maj", "A min", "B dim"] },
  { key: "G", rel: "Em", chords: ["G maj", "A min", "B min", "C maj", "D maj", "E min", "F# dim"] },
  { key: "D", rel: "Bm", chords: ["D maj", "E min", "F# min", "G maj", "A maj", "B min", "C# dim"] },
  { key: "A", rel: "F#m", chords: ["A maj", "B min", "C# min", "D maj", "E maj", "F# min", "G# dim"] },
  { key: "E", rel: "Dbm", chords: ["E maj", "F# min", "G# min", "A maj", "B maj", "C# min", "D# dim"] },
  { key: "B", rel: "Abm", chords: ["B maj", "Db min", "Eb min", "E maj", "Gb maj", "Ab min", "Bb dim"] },
  { key: "Gb", rel: "Ebm", chords: ["Gb maj", "Ab min", "Bb min", "Cb maj", "Db maj", "Ebm", "F dim"] },
  { key: "Db", rel: "Bbm", chords: ["Db maj", "Eb min", "F min", "Gb maj", "Ab maj", "Bbm", "C dim"] },
  { key: "Ab", rel: "Fm", chords: ["Ab maj", "Bb min", "C min", "Db maj", "Eb maj", "F min", "G dim"] },
  { key: "Eb", rel: "Cm", chords: ["Eb maj", "F min", "G min", "Ab maj", "Bb maj", "C min", "D dim"] },
  { key: "Bb", rel: "Gm", chords: ["Bb maj", "C min", "D min", "Eb maj", "F maj", "G min", "A dim"] },
  { key: "F", rel: "Dm", chords: ["F maj", "G min", "A min", "Bb maj", "C maj", "D min", "E dim"] },
];

const TablesPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 10, bgcolor: '#f8fafc' }}>
      <Head>
        <title>Music Theory Tables | Scales & Chords Reference</title>
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
        <meta
          name="description"
          content="Complete reference tables for guitar scales, chords, and the circle of fifths. Find yourself in the maze with comprehensive music theory formulas and diatonic chord progressions."
        />
      </Head>

      <Container maxWidth="xl">
        {/* Main Title */}
        <Typography
          variant="h2"
          component="h1"
          align="center"
          sx={{
            fontWeight: 900,
            mb: 8,
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}
        >
          Find yourself in the maze
        </Typography>

        <Grid container spacing={8}>

          {/* Relatives Table */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 40, bgcolor: 'secondary.main', borderRadius: 1 }} />
              <Typography variant="h4" component="h2" fontWeight="bold">
                Circle of Fifths Reference
              </Typography>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Table sx={{ minWidth: 650 }} aria-label="relatives table">
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#475569' }}>Key</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#475569' }}>Relative Minor</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#475569' }}>Chords (Diatonic)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {relativesData.map((row) => (
                    <TableRow key={row.key} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}>
                        {row.key}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>{row.rel}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {row.chords.map((chord, idx) => (
                            <Chip
                              key={idx}
                              label={chord}
                              size="small"
                              color={idx === 0 || idx === 3 || idx === 4 ? 'primary' : 'default'} // Highlight major chords I, IV, V
                              variant={idx === 6 ? 'outlined' : 'filled'} // Diminished as outlined
                            />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Scales Table */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 8, height: 40, bgcolor: 'primary.main', borderRadius: 1 }} />
              <Typography variant="h4" component="h2" fontWeight="bold">
                Scales & Formulas
              </Typography>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <Table sx={{ minWidth: 650 }} aria-label="scales table">
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Root Key</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Major</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Minor</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Harmonic</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Melodic</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Blues Minor</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569' }}>Blues Major</TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'text.secondary' }}>Formulas</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, 2, 3, 4, 5, 6, 7</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, 2, b3, 4, 5, b6, b7</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, 2, b3, 4, 5, b6, 7</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, 2, b3, 4, 5, 6, 7</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, b3, 4, b5, 5</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>1, 2, b3, 3, 5</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scalesData.map((row) => (
                    <TableRow key={row.key} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', color: 'secondary.main', fontSize: '1.2rem' }}>
                        {row.key}
                      </TableCell>
                      {row.notes.map((notes, idx) => (
                        <TableCell key={idx} align="center" sx={{ fontSize: '0.9rem' }}>{notes}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default TablesPage;