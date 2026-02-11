import React from 'react';
import Head from 'next/head';
import TournamentDetails from '../../../components/Pages/TournamentDetails';
import tournamentsData from '../../../data/tournaments.json';
import { DEFAULT_KEYWORDS } from '../../../data/seo';

export async function getStaticPaths() {
    const paths = tournamentsData.map((tournament) => ({
        params: { id: tournament.id },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const tournament = tournamentsData.find((t) => t.id === params.id);

    if (!tournament) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            tournament,
        },
    };
}

const TournamentPage = ({ tournament }) => {
    return (
        <div style={{ marginTop: '100px' }}>
            <Head>
                <title>{`${tournament.name} - Guitar Sheets Competition`}</title>
                <meta
                    name="description"
                    content={tournament.description}
                />
                <meta
                    name="keywords"
                    content={DEFAULT_KEYWORDS}
                />
            </Head>
            <TournamentDetails tournament={tournament} />
        </div>
    );
};

export default TournamentPage;
