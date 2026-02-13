import guitar from '../../config/guitar';
import QueryComponent from '../../components/Elements/Query/QueryComponent';

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

export const getStaticPaths = async () => {
    const paths = [];
    const keys = guitar.notes.sharps;
    const CAGED_SHAPES = ['c', 'a', 'g', 'e', 'd'];

    // For each key
    keys.forEach((key) => {
        const rootSlug = slugify(key);

        // For each arpeggio that has matches
        Object.entries(guitar.arppegios).forEach(([chordKey, chordData]) => {
            const chordSlug = slugify(chordData.name);

            // Matches are only Scale or Arpeggio
            (chordData.matchingScales || []).forEach((scaleName) => {
                const matchSlug = slugify(scaleName);
                CAGED_SHAPES.forEach((shape) => {
                    paths.push({
                        params: {
                            slug: `scale_${matchSlug}_matches_chord_${chordSlug}_in_${rootSlug}_key_and_${shape}_shape`
                        }
                    });
                });
            });

            (chordData.matchingArpeggios || []).forEach((arpName) => {
                const matchSlug = slugify(arpName);
                CAGED_SHAPES.forEach((shape) => {
                    paths.push({
                        params: {
                            slug: `arpeggio_${matchSlug}_matches_chord_${chordSlug}_in_${rootSlug}_key_and_${shape}_shape`
                        }
                    });
                });
            });
        });
    });

    return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
    const { slug } = params;

    // Format: [type1]_[name1]_matches_chord_[name2]_in_[root]_key_and_[shape]_shape

    // Split by '_matches_chord_'
    const matchesSplit = slug.split('_matches_chord_');
    if (matchesSplit.length !== 2) return { notFound: true };

    const firstPart = matchesSplit[0]; // e.g., 'scale_mixolydian' or 'arpeggio_minor_7th'
    const secondPart = matchesSplit[1]; // e.g., 'dominant_7th_in_c_key_and_e_shape'

    // Parse Match
    const matchType = firstPart.startsWith('scale_') ? 'scale' : 'arpeggio';
    const matchSlug = firstPart.replace(`${matchType}_`, '');

    // Parse Chord and Root
    const keySplit = secondPart.split('_in_');
    if (keySplit.length !== 2) return { notFound: true };

    const chordSlug = keySplit[0];
    const tailSection = keySplit[1]; // e.g., 'c_key_and_e_shape' or 'csharp_key_and_e_shape'

    const tailSplit = tailSection.split('_key_and_');
    if (tailSplit.length !== 2) return { notFound: true };

    const rootSlug = tailSplit[0];
    const shape = tailSplit[1].replace('_shape', '').toUpperCase();

    const rootKey = rootSlug.replace('sharp', '#').toUpperCase();
    const keyIndex = guitar.notes.sharps.indexOf(rootKey);

    // Find the chord
    const chordEntry = Object.entries(guitar.arppegios).find(([_, data]) => slugify(data.name) === chordSlug);
    if (!chordEntry || keyIndex === -1) return { notFound: true };

    const [chordKey, chord] = chordEntry;

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
                        keyIndex,
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
                    keyIndex,
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
                keyIndex,
                shape,
                label: matchDisplayName
            };
        }
    }

    if (!matchSettings) return { notFound: true };

    // Explicitly set titles and descriptions with types
    const matchTypeLabel = matchType.charAt(0).toUpperCase() + matchType.slice(1);
    const title = `Analyze: How the ${matchTypeLabel} ${matchDisplayName} matches the Chord ${chord.name} (${rootKey} / ${shape} Shape)`;
    const description = `Discover why the ${matchTypeLabel} ${matchDisplayName} is a perfect harmonic fit for the Chord ${chord.name} in ${rootKey}. Exploration in the guitar CAGED ${shape} shape with interval analysis and stats.`;
    const queryInfo = `Comparing the ${matchTypeLabel} ${matchDisplayName} with the Chord ${chord.name} on the guitar fretboard.`;

    const pair = {
        boardId: 'query-0',
        rootSettings: {
            display: 'chord', // Show as chord type
            quality: chordKey,
            keyIndex,
            shape,
            label: `Chord ${chord.name} (Root)`
        },
        matchSettings: {
            ...matchSettings,
            label: `${matchTypeLabel} ${matchDisplayName}`
        },
        title: `${matchTypeLabel} ${matchDisplayName} vs Chord ${chord.name}`
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
