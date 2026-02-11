import React from 'react';
import MusicApp from '../../components/Containers/MusicApp';

import AppShell from "@/ui/app/AppShell";

import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../data/seo';

const ComposeAndShare = () => {
  return (
    <div style={{ marginTop: '65px' }}>
      <Head>
        <title>Compose And Share Music</title>
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
        <meta
          name="description"
          content="Compose And Play Guitar Songs ON ALL KEYS, CHORDS, SHAPES, SCALES, MODES, ARPPEGIONS DERIVED FROM A COMPLETE MUSICAL LIBRARY."
        />
      </Head>
      <AppShell />
    </div>
  );
};

export default ComposeAndShare;
