import { gql } from '@apollo/client';

export const GET_ROBOTS_CONFIG = gql`
    query GetRobotsConfig {
        robotsConfig {
            defaultRobots
            customInstructions
        }
    }
`;