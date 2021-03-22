import { gql } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * Custom type policies necessary for the currency query.
 */
export const CUSTOM_TYPES = {
    Currency: {
        fields: {
            /**
             * @client field policies must be defined if queried along server
             * props or the entire query will return null.
             */
            current_currency_code: {
                read(_, { readField }) {
                    return (
                        storage.getItem('store_view_currency') ||
                        readField('default_display_currency_code')
                    );
                }
            }
        }
    }
};

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const GET_CURRENCY = gql`
    query getCurrencyData {
        currency {
            current_currency_code @client
            default_display_currency_code
            available_currency_codes
        }
    }
`;
/* eslint-enable graphql/template-strings */

export default {
    getCurrencyQuery: GET_CURRENCY
};
