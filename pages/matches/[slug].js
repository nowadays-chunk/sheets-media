import guitar from '../../config/guitar';
import QueryComponent from '../../components/Elements/Query/QueryComponent';
import { getAbsoluteNotes, checkMatch } from '../../core/music/musicTheory';

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

export const getStaticPaths = async () => {
    const paths = [];
    const keys = guitar.notes.sharps;
    const CAGED_SHAPES = ['c', 'a', 'g', 'e', 'd'];

    // For static export, we must pre-calculate ALL valid matches
    // This replicates the logic in References.js but at build time
    keys.forEach((chordKeyName) => {
        const chordKeyIndex = guitar.notes.sharps.indexOf(chordKeyName);
        const chordRootSlug = slugify(chordKeyName);

        Object.entries(guitar.arppegios).forEach(([chordKeyId, chordData]) => {
            const chordNotes = getAbsoluteNotes('chord', chordKeyId, chordKeyIndex);
            const chordSlug = slugify(chordData.name);

            // Check against ALL keys for EACH match type
            keys.forEach((targetKeyName) => {
                const targetKeyIndex = guitar.notes.sharps.indexOf(targetKeyName);
                const targetRootSlug = slugify(targetKeyName);

                // 1. Scales
                Object.entries(guitar.scales).forEach(([scaleKey, scaleData]) => {
                    if (scaleData.modes) {
                        scaleData.modes.forEach((mode, mIdx) => {
                            const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex, mIdx);
                            if (checkMatch(chordNotes, targetNotes)) {
                                CAGED_SHAPES.forEach((shape) => {
                                    paths.push({
                                        params: {
                                            slug: `scale_${slugify(mode.name)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${chordRootSlug}_key_and_${shape}_shape`
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex);
                        if (checkMatch(chordNotes, targetNotes)) {
                            CAGED_SHAPES.forEach((shape) => {
                                paths.push({
                                    params: {
                                        slug: `scale_${slugify(scaleKey)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${chordRootSlug}_key_and_${shape}_shape`
                                    }
                                });
                            });
                        }
                    }
                });

                // 2. Arpeggios
                Object.entries(guitar.arppegios).forEach(([arpKey, arpData]) => {
                    const targetNotes = getAbsoluteNotes('arppegio', arpKey, targetKeyIndex);
                    if (checkMatch(chordNotes, targetNotes)) {
                        CAGED_SHAPES.forEach((shape) => {
                            paths.push({
                                params: {
                                    slug: `arpeggio_${slugify(arpKey)}_in_${targetRootSlug}_key_matches_chord_${chordSlug}_in_${chordRootSlug}_key_and_${shape}_shape`
                                }
                            });
                        });
                    }
                });
            });
        });
    });

    console.log(`Generated ${paths.length} harmonic match paths for static export.`);
    return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
    const { slug } = params;

    // Format: [type]_[name]_in_[key1]_key_matches_chord_[name]_in_[key2]_key_and_[shape]_shape

    const matchesSplit = slug.split('_matches_chord_');
    if (matchesSplit.length !== 2) return { notFound: true };

    const matchPart = matchesSplit[0]; // e.g., 'scale_ionian_in_g_key'
    const chordPart = matchesSplit[1]; // e.g., 'major_in_c_key_and_e_shape'

    // Parse Match Part
    const matchType = matchPart.startsWith('scale_') ? 'scale' : 'arpeggio';
    const matchKeySplit = matchPart.replace(`${matchType}_`, '').split('_in_');
    if (matchKeySplit.length !== 2) return { notFound: true };

    const matchSlug = matchKeySplit[0];
    const matchRootSlug = matchKeySplit[1].replace('_key', '');
    const matchRootKey = matchRootSlug.replace('sharp', '#').toUpperCase();
    const matchKeyIndex = guitar.notes.sharps.indexOf(matchRootKey);

    // Parse Chord Part
    const chordKeySplit = chordPart.split('_in_');
    if (chordKeySplit.length !== 2) return { notFound: true };

    const chordSlug = chordKeySplit[0];
    const tailSection = chordKeySplit[1];

    const tailSplit = tailSection.split('_key_and_');
    if (tailSplit.length !== 2) return { notFound: true };

    const chordRootSlug = tailSplit[0];
    const shape = tailSplit[1].replace('_shape', '').toUpperCase();

    const chordRootKey = chordRootSlug.replace('sharp', '#').toUpperCase();
    const chordKeyIndex = guitar.notes.sharps.indexOf(chordRootKey);

    // Find the chord
    const chordEntry = Object.entries(guitar.arppegios).find(([_, data]) => slugify(data.name) === chordSlug);
    if (!chordEntry || chordKeyIndex === -1 || matchKeyIndex === -1) return { notFound: true };

    const [chordKeyId, chord] = chordEntry;

    // Find the match
    let matchSettings = null;
    let matchDisplayName = '';

    if (matchType === 'scale') {
        for (const [sKey, sData] of Object.entries(guitar.scales)) {
            if (sData.modes) {
                const mIdx = sData.modes.findIndex(m => slugify(m.name) === matchSlug);
                if (mIdx !== -1) {
                    matchDisplayName = sData.modes[mIdx].name;
                    matchSettings = {
                        display: 'scale',
                        scale: sKey,
                        modeIndex: mIdx,
                        keyIndex: matchKeyIndex,
                        shape,
                        label: matchDisplayName
                    };
                    break;
                }
            } else if (slugify(sData.name) === matchSlug) {
                matchDisplayName = sData.name;
                matchSettings = {
                    display: 'scale',
                    scale: sKey,
                    modeIndex: 0,
                    keyIndex: matchKeyIndex,
                    shape,
                    label: matchDisplayName
                };
                break;
            }
        }
    } else {
        const arpEntry = Object.entries(guitar.arppegios).find(([_, data]) => slugify(data.name) === matchSlug);
        if (arpEntry) {
            matchDisplayName = arpEntry[1].name;
            matchSettings = {
                display: 'arppegio',
                quality: arpEntry[0],
                keyIndex: matchKeyIndex,
                shape,
                label: matchDisplayName
            };
        }
    }

    if (!matchSettings) return { notFound: true };

    // Explicitly set titles and descriptions with types
    const matchTypeLabel = matchType.charAt(0).toUpperCase() + matchType.slice(1);
    const title = `Analyze: How the ${matchTypeLabel} ${matchDisplayName} in ${matchRootKey} matches the Chord ${chord.name} in ${chordRootKey} (${shape} Shape)`;
    const description = `Discover why the ${matchTypeLabel} ${matchDisplayName} in ${matchRootKey} is a harmonic fit for the Chord ${chord.name} in ${chordRootKey}. Exploration in the guitar CAGED ${shape} shape with interval analysis.`;
    const queryInfo = `Comparing the ${matchTypeLabel} ${matchDisplayName} (${matchRootKey}) with the Chord ${chord.name} (${chordRootKey}) on the guitar fretboard.`;

    const pair = {
        boardId: 'query-0',
        rootSettings: {
            display: 'chord', // Show as chord type
            quality: chordKeyId,
            keyIndex: chordKeyIndex,
            shape,
            label: `Chord ${chord.name} in ${chordRootKey}`
        },
        matchSettings: {
            ...matchSettings,
            label: `${matchTypeLabel} ${matchDisplayName} in ${matchRootKey}`
        },
        title: `Analyzing how the chord ${chord.name} in ${chordRootKey} matches the ${matchDisplayName} ${matchType} in ${matchRootKey}`
    };

    return {
        props: {
            pairings: [pair],
            title,
            description,
            queryInfo
        }
    };
};

export default QueryComponent;
