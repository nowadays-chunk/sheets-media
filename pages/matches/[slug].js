import guitar from '../../config/guitar';
import QueryComponent from '../../components/Elements/Query/QueryComponent';
import { getAbsoluteNotes, checkMatch } from '../../core/music/musicTheory';

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

export const getStaticPaths = async () => {
    // Return empty array and use fallback: 'blocking' to optimize build time.
    // Pages will be generated on-demand and cached.
    return { paths: [], fallback: 'blocking' };
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

    // User requested format: "Find out how [match_name] matches [chord_name] in [key] in [shape] shape"
    const title = `Find out how the ${matchDisplayName} matches ${chord.name} in ${matchRootKey} in ${shape} shape`;

    const description = `Analyze how the ${matchDisplayName} ${matchType} matches ${chord.name} in ${matchRootKey} with the ${shape} shape. Perfect for mastering soloing, chord changes, and modal playing on the guitar fretboard.`;

    const keywords = `soloing, chord, changes, modal, playing, theory, fretboard visualization, scale diagrams, musical patterns, guitar harmony, CAGED system, ${matchDisplayName}, ${chord.name}, ${matchRootKey} key, ${shape} shape, music analysis`;

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
            queryInfo,
            keywords
        },
        revalidate: 60
    };
};

export default QueryComponent;
