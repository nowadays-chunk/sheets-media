import React from 'react';
import Head from 'next/head';
import MusicianNewsMasonry from '../../components/Pages/News/MusicianNewsMasonry';
import { DEFAULT_KEYWORDS } from '../../data/seo';

const LearnSongs = (props) => {

  return (
    <div style={{ marginTop: '100px' }}>
      <Head>
        <title>Musician News</title>
        <meta
          name="description"
          content="Read our musician news that are coming from pre-configured XSS feeds known worldwide and learn guitar as you do it."
        />
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
      </Head>
      <MusicianNewsMasonry leftDrawerOpen={props.leftDrawerOpen} leftDrawerWidth={props.leftDrawerWidth}></MusicianNewsMasonry>
    </div>
  );
};

export default LearnSongs;
