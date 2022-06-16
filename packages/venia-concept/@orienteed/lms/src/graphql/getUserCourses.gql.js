import { gql } from '@apollo/client';

export const GET_MOODLE_TOKEN_AND_ID = gql`
    query GetMoodleToken {
        customer {
            moodle_token
            moodle_id
        }
    }
`;

export default {
    getMoodleTokenAndIdQuery: GET_MOODLE_TOKEN_AND_ID
};
