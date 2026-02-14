import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Container,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import guitar from '../../config/guitar.js';
import { getAbsoluteNotes, checkMatch } from '../../core/music/musicTheory';

// -----------------------------------------
// CONSTANTS
// -----------------------------------------

const keysSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const normalizedKeys = keysSharps.map(k => k.replace("#", "sharp"));

const degreesDynamic = Object.keys(guitar.arppegios);
const scaleTypes = Object.keys(guitar.scales);

// -----------------------------------------
// HELPERS
// -----------------------------------------

const normalizeKey = (str) => str?.replace("sharp", "#");
const normalizeDegree = (str) => str?.replace(/sharp/g, "#").replace(/#/g, "sharp");

const normalizeModeName = (str) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_/g, "-")
        .replace(/--+/g, "-")
        .replace(/#/g, "sharp")
        .trim();
};

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

// -----------------------------------------
// STYLES
// -----------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
    margin: '16px auto',
    width: '100%',
    padding: '20px',
    [theme.breakpoints.up('md')]: { maxWidth: '85%' },
}));

const OptionButton = styled(Button)(({ selected }) => ({
    borderRadius: "20px",
    margin: "4px",
    background: selected ? "#1976d2" : "transparent",
    color: selected ? "#fff" : "#1976d2",
    border: "1px solid #1976d2",
    "&:hover": {
        background: selected ? "#11529b" : "rgba(25,118,210,0.1)"
    }
}));

// -----------------------------------------
// COMPONENT
// -----------------------------------------

const PlayWizard = ({ onSelect, elements = [] }) => {
    // Filters
    const [searchType, setSearchType] = useState("scale");
    const [searchKey, setSearchKey] = useState("C");
    const [searchScaleType, setSearchScaleType] = useState("major");
    const [searchMode, setSearchMode] = useState("Ionian");
    const [searchDegree, setSearchDegree] = useState("M");

    // Matches State
    const [searchChord, setSearchChord] = useState("M");
    const [searchMatchType, setSearchMatchType] = useState("scale");
    const [searchShape, setSearchShape] = useState("E");
    const [searchCrossKey, setSearchCrossKey] = useState(false);

    const filteredElements = useMemo(() => {
        if (searchType === "matches") {
            if (!searchKey || !searchChord || !searchMatchType || !searchShape) return [];

            const keyIndex = guitar.notes.sharps.indexOf(searchKey);
            if (keyIndex === -1) return [];

            const chordNotes = getAbsoluteNotes('chord', searchChord, keyIndex);
            let results = [];
            const keysToSearch = searchCrossKey ? guitar.notes.sharps : [searchKey];

            keysToSearch.forEach((targetKey) => {
                const targetKeyIndex = guitar.notes.sharps.indexOf(targetKey);

                if (searchMatchType === 'scale') {
                    Object.entries(guitar.scales).forEach(([scaleKey, scaleData]) => {
                        if (scaleData.modes) {
                            scaleData.modes.forEach((mode, mIdx) => {
                                const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex, mIdx);
                                if (checkMatch(chordNotes, targetNotes)) {
                                    results.push({
                                        label: `Scale ${mode.name} in ${targetKey}`,
                                        type: 'scale',
                                        key: targetKeyIndex,
                                        value: scaleKey,
                                        mode: mIdx,
                                        shape: searchShape,
                                        href: `/spreading/scales/${targetKey.replace('#', 'sharp')}/${scaleKey}/modal/${normalizeModeName(mode.name)}`
                                    });
                                }
                            });
                        } else {
                            const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex);
                            if (checkMatch(chordNotes, targetNotes)) {
                                results.push({
                                    label: `Scale ${scaleData.name} in ${targetKey}`,
                                    type: 'scale',
                                    key: targetKeyIndex,
                                    value: scaleKey,
                                    shape: searchShape,
                                    href: `/spreading/scales/${targetKey.replace('#', 'sharp')}/${scaleKey}/single`
                                });
                            }
                        }
                    });
                } else {
                    Object.entries(guitar.arppegios).forEach(([arpKey, arpData]) => {
                        const targetNotes = getAbsoluteNotes('arppegio', arpKey, targetKeyIndex);
                        if (checkMatch(chordNotes, targetNotes)) {
                            results.push({
                                label: `Arpeggio ${arpData.name} in ${targetKey}`,
                                type: 'arppegio',
                                key: targetKeyIndex,
                                value: arpKey,
                                shape: searchShape,
                                href: `/spreading/arppegios/${targetKey.replace('#', 'sharp')}/${arpKey.replace('#', 'sharp')}`
                            });
                        }
                    });
                }
            });
            return results;
        }

        return elements.filter(el => {
            const parts = el.href.split("/");
            const elementType = parts[2];
            const elementKeyRaw = parts[3];
            const elementScaleType = parts[4];
            const elementModeRaw = parts[parts.length - 1];
            const elementMode = normalizeModeName(elementModeRaw);
            const elementDegree = normalizeDegree(parts[4]);
            const elementKey = normalizeKey(elementKeyRaw);

            if (searchType === "scale" && elementType !== "scales") return false;
            if (searchType === "chord" && elementType !== "chords") return false;
            if (searchType === "arp" && elementType !== "arppegios") return false;
            if (searchKey && elementKey !== searchKey) return false;

            if (searchScaleType && elementType === "scales") {
                if (elementScaleType !== searchScaleType) return false;
            }
            if (searchMode && elementType === "scales") {
                if (normalizeModeName(searchMode) !== elementMode) return false;
            }
            if (searchDegree && elementType !== "scales") {
                if (normalizeDegree(searchDegree) !== elementDegree) return false;
            }

            return true;
        }).map(el => {
            // Convert href to app state
            const parts = el.href.split("/");
            const typeMap = { 'scales': 'scale', 'chords': 'chord', 'arppegios': 'arppegio' };
            const type = typeMap[parts[2]];
            const keyIdx = guitar.notes.sharps.indexOf(normalizeKey(parts[3]));
            const selection = { label: el.label, type, key: keyIdx, href: el.href };
            if (type === 'scale') {
                selection.value = parts[4];
                if (parts[5] === 'modal') {
                    const scale = guitar.scales[parts[4]];
                    const mIdx = scale.modes.findIndex(m => normalizeModeName(m.name) === normalizeModeName(parts[6]));
                    selection.mode = mIdx;
                }
            } else {
                selection.value = normalizeDegree(parts[4]);
            }
            return selection;
        });
    }, [elements, searchType, searchKey, searchScaleType, searchMode, searchDegree, searchChord, searchMatchType, searchShape, searchCrossKey]);

    return (
        <Container sx={{ py: 4 }}>
            <StyledCard>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Play Wizard</Typography>

                    {/* STEP 1 – CATEGORY */}
                    <Box mb={3}>
                        <Typography variant="h6" color="textSecondary">Step 1: Category</Typography>
                        <OptionButton selected={searchType === "scale"} onClick={() => setSearchType("scale")}>Scales</OptionButton>
                        <OptionButton selected={searchType === "chord"} onClick={() => setSearchType("chord")}>Chords</OptionButton>
                        <OptionButton selected={searchType === "arp"} onClick={() => setSearchType("arp")}>Arpeggios</OptionButton>
                        <OptionButton selected={searchType === "matches"} onClick={() => setSearchType("matches")}>Matches</OptionButton>
                    </Box>

                    {/* STEP 2 – KEY */}
                    <Box mb={3}>
                        <Typography variant="h6" color="textSecondary">Step 2: Key</Typography>
                        <Grid container spacing={0.5}>
                            {keysSharps.map((k, idx) => (
                                <Grid item key={k}>
                                    <OptionButton
                                        selected={searchKey === k}
                                        onClick={() => setSearchKey(k)}
                                    >
                                        {k}
                                    </OptionButton>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* DYNAMIC STEPS based on Category */}
                    {searchType === 'matches' ? (
                        <>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 3: Depth</Typography>
                                <OptionButton selected={!searchCrossKey} onClick={() => setSearchCrossKey(false)}>Same Key ({searchKey})</OptionButton>
                                <OptionButton selected={searchCrossKey} onClick={() => setSearchCrossKey(true)}>Cross-Key</OptionButton>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 4: Root Chord</Typography>
                                {Object.entries(guitar.arppegios)
                                    .filter(([_, data]) => data.matchingScales?.length > 0 || data.matchingArpeggios?.length > 0)
                                    .map(([ck, cd]) => (
                                        <OptionButton key={ck} selected={searchChord === ck} onClick={() => setSearchChord(ck)}>{cd.name}</OptionButton>
                                    ))}
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 5: Match Type</Typography>
                                <OptionButton selected={searchMatchType === 'scale'} onClick={() => setSearchMatchType('scale')}>Scale</OptionButton>
                                <OptionButton selected={searchMatchType === 'arpeggio'} onClick={() => setSearchMatchType('arpeggio')}>Arpeggio</OptionButton>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 6: Shape</Typography>
                                {['C', 'A', 'G', 'E', 'D'].map(s => (
                                    <OptionButton key={s} selected={searchShape === s} onClick={() => setSearchShape(s)}>{s} Shape</OptionButton>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <>
                            {searchType === "scale" ? (
                                <>
                                    <Box mb={3}>
                                        <Typography variant="h6" color="textSecondary">Step 3: Scale Type</Typography>
                                        {scaleTypes.map(s => (
                                            <OptionButton key={s} selected={searchScaleType === s} onClick={() => setSearchScaleType(s)}>{s}</OptionButton>
                                        ))}
                                    </Box>
                                    {searchScaleType && guitar.scales[searchScaleType].modes?.length > 0 && (
                                        <Box mb={3}>
                                            <Typography variant="h6" color="textSecondary">Step 4: Modes</Typography>
                                            {guitar.scales[searchScaleType].modes.map(m => (
                                                <OptionButton key={m.name} selected={searchMode === m.name} onClick={() => setSearchMode(m.name)}>{m.name}</OptionButton>
                                            ))}
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Box mb={3}>
                                    <Typography variant="h6" color="textSecondary">Step 3: Degree</Typography>
                                    {degreesDynamic.map(d => (
                                        <OptionButton key={d} selected={searchDegree === d} onClick={() => setSearchDegree(d)}>{d}</OptionButton>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </StyledCard>

            {/* RESULTS */}
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Select to Visualize ({filteredElements.length})</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                        {filteredElements.map((el, idx) => (
                            <Box component="li" key={idx} sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography>{el.label}</Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onSelect(el)}
                                    sx={{ borderRadius: '20px' }}
                                >
                                    Visualize
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default PlayWizard;
