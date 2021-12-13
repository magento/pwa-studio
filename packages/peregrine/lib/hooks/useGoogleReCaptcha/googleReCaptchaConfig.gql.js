import { gql } from '@apollo/client';

export const GET_RECAPTCHAV3_CONFIG = gql`
    query GetReCaptchaV3Config {
        recaptchaV3Config {
            website_key
            badge_position
            language_code
            forms
        }
    }
`;

export default {
    getReCaptchaV3ConfigQuery: GET_RECAPTCHAV3_CONFIG
};
