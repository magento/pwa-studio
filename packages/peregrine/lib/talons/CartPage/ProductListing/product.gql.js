import { gql } from '@apollo/client';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            id
            configurable_thumbnail_source @client
        }
    }
`;

export default {
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
