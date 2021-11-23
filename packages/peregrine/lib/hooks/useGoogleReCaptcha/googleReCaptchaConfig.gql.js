import { gql } from '@apollo/client';

export const GET_RECAPTCHAV3_CONFIG = gql`
    query GetReCaptchaV3Config {
        recaptchaV3Config {
            website_key
            minimum_score
            badge_position
            language_code
            failure_message
            forms
        }
    }
`;

export default {
    getReCaptchaV3ConfigQuery: GET_RECAPTCHAV3_CONFIG
};
