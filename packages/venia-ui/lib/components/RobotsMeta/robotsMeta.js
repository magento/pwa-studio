import React from 'react';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet';
import { GET_ROBOTS_CONFIG } from './robotsMeta.gql';

const RobotsMeta = () => {
    const { data, loading, error } = useQuery(GET_ROBOTS_CONFIG);

    if (loading || error) {
        return null;
    }

    const robots =
        data?.storeConfig?.design_search_engine_robots_default_robots;

    if (!robots) {
        return null;
    }

    return (
        <Helmet>
            <meta name="robots" content={robots} />
        </Helmet>
    );
};

export default RobotsMeta;

