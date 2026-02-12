import React from 'react';
import AppShell from "@/ui/app/AppShell";
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../data/seo';

const ComposeAndShare = () => {
  return (
    <>
      <Head>
        <title>Compose And Share Music Using Guitar Sheets</title>
        <meta
          name="keywords"
          content={DEFAULT_KEYWORDS}
        />
        <meta
          name="description"
          content="Compose And Play Guitar Songs on all keys, chorsd, shapes, scales, modes, arpeggios."
        />
      </Head>
      <div style={{ marginTop: '65px' }}>
        <AppShell />
      </div>
    </>
  );
};

export default ComposeAndShare;
