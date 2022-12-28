import { gql } from '@apollo/client';

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForModal {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS
};
