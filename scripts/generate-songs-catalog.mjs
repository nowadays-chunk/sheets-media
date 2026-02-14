import fs from 'fs';
import path from 'path';

async function generateSongsCatalog() {
    console.log('Generating songs catalog for client-side fetching...');

    const outputDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        const firstPath = path.join(process.cwd(), "output_songs", "first-songs.json");
        const secondPath = path.join(process.cwd(), "output_songs", "second-songs.json");

        if (!fs.existsSync(firstPath) || !fs.existsSync(secondPath)) {
            console.error("Source song files not found in output_songs/");
            return;
        }

        const songsFirst = JSON.parse(fs.readFileSync(firstPath, 'utf8'));
        const songsSecond = JSON.parse(fs.readFileSync(secondPath, 'utf8'));

        const mapSong = (s) => ({
            song_name: s.song_name,
            artist_name: s.artist_name,
            tab_url: s.tab_url,
            song_id: s.song_id || s.id,
            source: s.source || 'chorider',
            key: s.key || null,
            difficulty: s.difficulty || null,
        });

        const allSongs = [
            ...songsFirst.map(mapSong),
            ...songsSecond.map(mapSong)
        ];

        fs.writeFileSync(
            path.join(outputDir, 'songs-catalog.json'),
            JSON.stringify(allSongs)
        );

        console.log(`Songs catalog generated successfully: ${allSongs.length} songs.`);
    } catch (error) {
        console.error("Error generating songs catalog:", error);
    }
}

generateSongsCatalog();
