import { gql } from '@apollo/client';

export const GET_ROBOTS_CONFIG = gql`
    query GetSearchEngineRobotsConfig {
        storeConfig {
            design_search_engine_robots_default_robots
        }
    }
`;
