import { shrinkGETQuery } from '../shrinkGETQuery';

test('Does not modify a URL without a "query" querystring', () => {
    const url = 'https://www.store.test/graphql';
    expect(shrinkGETQuery(url)).toBe(url);
});

test('Removes unnecessary spaces from a simple query, and encodes necessary spaces as +', () => {
    const url =
        'https://www.store.test/graphql?query=query%20test%20{%20field%20}';
    const expectedURL =
        'https://www.store.test/graphql?query=query+test%7Bfield%7D';
    expect(shrinkGETQuery(url)).toBe(expectedURL);
});

test('Does not remove "operationName" or "variables"', () => {
    const variables = JSON.stringify({ hello: 'world' });
    const operationName = 'test';
    const url = `https://www.store.test/graphql?query=query%20test%20{%20field%20}&operationName=${operationName}&variables=${encodeURIComponent(
        variables
    )}`;

    const result = new URL(shrinkGETQuery(url));
    expect(result.searchParams.get('operationName')).toBe(operationName);
    expect(result.searchParams.get('variables')).toBe(variables);
});

test('Does not remove unrelated querystrings', () => {
    const url =
        'https://www.store.test/graphql?query=query%20test%20{%20field%20}&foo=bar';
    const result = new URL(shrinkGETQuery(url));
    expect(result.searchParams.get('foo')).toBe('bar');
});

test('Shrunken category query URL is smaller than the original', () => {
    const queryCopiedFromProdStore = `
    query category($id: Int!, $pageSize: Int!, $currentPage: Int!, $filters: ProductAttributeFilterInput!, $sort: ProductAttributeSortInput) {
        category(id: $id) {
          id
          description
          name
          product_count
          meta_description
          __typename
        }
        products(pageSize: $pageSize, currentPage: $currentPage, filter: $filters, sort: $sort) {
          items {
            __typename
            description {
              html
              __typename
            }
            id
            media_gallery_entries {
              id
              label
              position
              disabled
              file
              __typename
            }
            meta_description
            name
            price {
              regularPrice {
                amount {
                  currency
                  value
                  __typename
                }
                __typename
              }
              __typename
            }
            sku
            small_image {
              url
              __typename
            }
            url_key
            ... on ConfigurableProduct {
              configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                  default_label
                  label
                  store_label
                  use_default_value
                  value_index
                  swatch_data {
                    ... on ImageSwatchData {
                      thumbnail
                      __typename
                    }
                    value
                    __typename
                  }
                  __typename
                }
                __typename
              }
              variants {
                attributes {
                  code
                  value_index
                  __typename
                }
                product {
                  id
                  media_gallery_entries {
                    id
                    disabled
                    file
                    label
                    position
                    __typename
                  }
                  sku
                  stock_status
                  __typename
                }
                __typename
              }
              __typename
            }
          }
          page_info {
            total_pages
            __typename
          }
          total_count
          __typename
        }
      }

    `;
    const variables = {
        currentPage: 1,
        id: 37,
        pageSize: 6,
        filters: {
            category_id: { eq: '37' }
        },
        sort: { relevance: 'DESC' }
    };

    // Note: When upgraded to apollo-client@3, we can import this function instead of duplicating it in
    // this test.
    // https://github.com/apollographql/apollo-client/blob/8209d4f91f0893973dc4a738ce16f67851169124/src/link/http/rewriteURIForGET.ts
    const queryParam = `query=${encodeURIComponent(queryCopiedFromProdStore)}`;
    const variablesParam = `variables=${encodeURIComponent(
        JSON.stringify(variables)
    )}`;
    const operationNameParam = 'operationName=category';
    const apolloClientGETURL = `https://store.test/graphql?${queryParam}&${variablesParam}&${operationNameParam}`;

    const result = shrinkGETQuery(apolloClientGETURL);
    expect(result.length).toBeLessThan(apolloClientGETURL.length);
});
