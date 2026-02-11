import React from 'react';
import Meta from '../../../components/Partials/Head';
import TournamentDetails from '../../../components/Pages/TournamentDetails';
import tournamentsData from '../../../data/tournaments.json';

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
        <>
            <Meta
                title={`${tournament.name} - Guitar Sheets Competition`}
                description={tournament.description}
            />
            <TournamentDetails tournament={tournament} />
        </>
    );
};

export default TournamentPage;
