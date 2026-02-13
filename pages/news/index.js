import React from 'react';
import MusicianNewsMasonry from '../../components/Pages/News/MusicianNewsMasonry';
import Head from 'next/head';

export default function NewsPage(props) {
    return (
        <>
            <Head>
                <title>Musician News | Guitar Sheets</title>
                <meta name="description" content="Stay updated with the latest news in the music world." />
            </Head>
            <MusicianNewsMasonry {...props} />
        </>
    );
}
