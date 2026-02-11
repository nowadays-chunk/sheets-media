import fs from 'fs';
import path from 'path';
import guitar from '../config/guitar.js';
import { processFretboard } from '../config/fretboardProcessor.js';

const FRET_COUNT = 25;

/* ------------------------------------------------------------
   SAFELY SERIALIZE
------------------------------------------------------------ */
function safeJSON(obj) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) =>
            value === undefined ? null : value
        )
    );
}

/* ------------------------------------------------------------
   COMPUTE USAGE
------------------------------------------------------------ */
function computeUsage(allBoards) {
    const usage = {
        choices: {},
        keys: {},
        shapes: {},
        modes: {},
        tunings: {},
        intervals: {},
        neckZones: { open: 0, mid: 0, upper: 0, high: 0 },
        stringUsage: {},
        shapePositions: {},
        fretUsage: Array.from({ length: 25 }, (_, f) => ({ fret: f, value: 0 })),
    };

    allBoards.forEach((board) => {
        const fb = board.fretboard;
        if (!Array.isArray(fb)) return;

        const { chord, scale, arppegio, keyIndex, shape, mode } = board;

        /* ------ Choice type ------ */
        const choice = chord
            ? "chord"
            : scale
                ? "scale"
                : arppegio
                    ? "arppegio"
                    : "other";
        usage.choices[choice] = (usage.choices[choice] || 0) + 1;

        /* ------ Keys ------ */
        const note = guitar.notes.sharps[keyIndex];
        if (note) usage.keys[note] = (usage.keys[note] || 0) + 1;

        /* ------ Shapes ------ */
        if (shape) usage.shapes[shape] = (usage.shapes[shape] || 0) + 1;

        /* ------ Modes ------ */
        if (typeof mode === "number") {
            const modeName = guitar.scales[scale]?.modes?.[mode];
            if (modeName) usage.modes[modeName] = (usage.modes[modeName] || 0) + 1;
        }

        /* ------ Tunings ------ */
        const tuningStr = (board.tuning || [4, 7, 2, 9, 11, 4]).join("-");
        usage.tunings[tuningStr] = (usage.tunings[tuningStr] || 0) + 1;

        /* ------ Walk through fretboard ------ */
        fb.forEach((string, sIndex) => {
            string?.forEach((cell, fretIndex) => {
                if (!cell?.show) return;

                /* String usage */
                const sKey = `String ${sIndex + 1}`;
                usage.stringUsage[sKey] = (usage.stringUsage[sKey] || 0) + 1;

                /* Fret heat */
                usage.fretUsage[fretIndex].value++;

                /* Neck zones */
                if (fretIndex <= 3) usage.neckZones.open++;
                else if (fretIndex <= 9) usage.neckZones.mid++;
                else if (fretIndex <= 15) usage.neckZones.upper++;
                else usage.neckZones.high++;

                /* Intervals */
                if (cell.interval) {
                    usage.intervals[cell.interval] =
                        (usage.intervals[cell.interval] || 0) + 1;
                }
            });
        });

        /* ------ Shape Positions (min fret) ------ */
        if (shape) {
            let minFret = null;
            fb.forEach((string) =>
                string?.forEach((cell, fretIndex) => {
                    if (cell?.show) {
                        if (minFret === null || fretIndex < minFret) minFret = fretIndex;
                    }
                })
            );

            if (minFret !== null) {
                if (!usage.shapePositions[shape]) usage.shapePositions[shape] = [];
                usage.shapePositions[shape].push(minFret);
            }
        }
    });

    /* Convert arrays */
    usage.shapePositions = Object.entries(usage.shapePositions).map(
        ([shape, list]) => ({
            name: shape,
            value: Number(
                (list.reduce((a, b) => a + b, 0) / list.length).toFixed(2)
            ),
        })
    );

    usage.keys = Object.entries(usage.keys).map(([name, value]) => ({ name, value }));
    usage.choices = Object.entries(usage.choices).map(([name, value]) => ({ name, value }));
    usage.shapes = Object.entries(usage.shapes).map(([name, value]) => ({ name, value }));
    usage.modes = Object.entries(usage.modes).map(([name, value]) => ({ name, value }));
    usage.tunings = Object.entries(usage.tunings).map(([name, value]) => ({ name, value }));
    usage.intervals = Object.entries(usage.intervals).map(([name, value]) => ({ name, value }));
    usage.neckZones = Object.entries(usage.neckZones).map(([name, value]) => ({ name, value }));
    usage.stringUsage = Object.entries(usage.stringUsage).map(([name, value]) => ({ name, value }));

    return usage;
}

/* ------------------------------------------------------------
   MAIN GENERATION
------------------------------------------------------------ */
async function generateStats() {
    console.log('Generating stats...');
    const keys = guitar.notes.sharps.map((_, i) => i);
    const shapes = guitar.shapes.names;
    const chordNames = Object.keys(guitar.arppegios);
    const arpNames = Object.keys(guitar.arppegios);
    const scaleNames = Object.keys(guitar.scales);

    let chords = [];
    let arpeggios = [];
    let scales = [];

    /* -------- CHORDS -------- */
    keys.forEach((keyIndex) => {
        chordNames.forEach((chordName) => {
            shapes.forEach((shape) => {
                const fb = processFretboard({
                    keyIndex,
                    type: "chord",
                    chordName,
                    shape,
                });

                chords.push(
                    safeJSON({
                        keyIndex,
                        chord: chordName,
                        shape,
                        fretboard: fb,
                    })
                );
            });
        });
    });

    /* -------- ARPEGGIOS -------- */
    keys.forEach((keyIndex) => {
        arpNames.forEach((arpName) => {
            shapes.forEach((shape) => {
                const fb = processFretboard({
                    keyIndex,
                    type: "arppegio",
                    arpName,
                    shape,
                });

                arpeggios.push(
                    safeJSON({
                        keyIndex,
                        arppegio: arpName,
                        shape,
                        fretboard: fb,
                    })
                );
            });
        });
    });

    /* -------- SCALES -------- */
    keys.forEach((keyIndex) => {
        scaleNames.forEach((scaleName) => {
            const scale = guitar.scales[scaleName];

            if (scale.isModal && scale.modes) {
                scale.modes.forEach((_, modeIndex) => {
                    shapes.forEach((shape) => {
                        const fb = processFretboard({
                            keyIndex,
                            type: "scale",
                            scaleName,
                            shape,
                            modeIndex,
                        });

                        scales.push(
                            safeJSON({
                                keyIndex,
                                scale: scaleName,
                                mode: modeIndex,
                                shape,
                                fretboard: fb,
                            })
                        );
                    });
                });
            } else {
                shapes.forEach((shape) => {
                    const fb = processFretboard({
                        keyIndex,
                        type: "scale",
                        scaleName,
                        shape,
                        modeIndex: "", // explicit empty string for non-modal
                    });

                    scales.push(
                        safeJSON({
                            keyIndex,
                            scale: scaleName,
                            mode: null,
                            shape,
                            fretboard: fb,
                        })
                    );
                });
            }
        });
    });

    /* -------- COMPUTE USAGE -------- */
    const usage = computeUsage([...chords, ...arpeggios, ...scales]);

    /* -------- SAVE TO FILE -------- */
    const statsDir = path.join(process.cwd(), 'data', 'stats');

    if (!fs.existsSync(statsDir)) {
        fs.mkdirSync(statsDir, { recursive: true });
    }

    // Save general usage
    fs.writeFileSync(path.join(statsDir, 'usage.json'), JSON.stringify(usage, null, 2));

    // We can also save individual categories if needed by the frontend logic
    // Based on Stats.js: it checks for chords.json, arpeggios.json, scales.json for precomputedStats
    // But those seem to be expected as "stats for chords", "stats for arpeggios", etc.
    // The current logic in Stats.js:
    // const chordStats = precomputedStats?.chords || { ... computed ... }

    // So we should compute stats for each category and save them.

    const chordUsage = computeUsage(chords);
    const arpUsage = computeUsage(arpeggios);
    const scaleUsage = computeUsage(scales);

    fs.writeFileSync(path.join(statsDir, 'chords.json'), JSON.stringify(chordUsage, null, 2));
    fs.writeFileSync(path.join(statsDir, 'arpeggios.json'), JSON.stringify(arpUsage, null, 2));
    fs.writeFileSync(path.join(statsDir, 'scales.json'), JSON.stringify(scaleUsage, null, 2));

    console.log('Stats generated successfully in data/stats');
}

generateStats().catch(console.error);
