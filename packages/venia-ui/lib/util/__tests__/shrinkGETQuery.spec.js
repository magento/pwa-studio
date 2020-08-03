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

test('it shrinks the category query significantly', () => {
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
    expect(result).toMatchInlineSnapshot(
        `"https://store.test/graphql?query=query+category%28%24id%3AInt%21%24pageSize%3AInt%21%24currentPage%3AInt%21%24filters%3AProductAttributeFilterInput%21%24sort%3AProductAttributeSortInput%29%7Bcategory%28id%3A%24id%29%7Bid+description+name+product_count+meta_description+__typename%7Dproducts%28pageSize%3A%24pageSize+currentPage%3A%24currentPage+filter%3A%24filters+sort%3A%24sort%29%7Bitems%7B__typename+description%7Bhtml+__typename%7Did+media_gallery_entries%7Bid+label+position+disabled+file+__typename%7Dmeta_description+name+price%7BregularPrice%7Bamount%7Bcurrency+value+__typename%7D__typename%7D__typename%7Dsku+small_image%7Burl+__typename%7Durl_key+...on+ConfigurableProduct%7Bconfigurable_options%7Battribute_code+attribute_id+id+label+values%7Bdefault_label+label+store_label+use_default_value+value_index+swatch_data%7B...on+ImageSwatchData%7Bthumbnail+__typename%7Dvalue+__typename%7D__typename%7D__typename%7Dvariants%7Battributes%7Bcode+value_index+__typename%7Dproduct%7Bid+media_gallery_entries%7Bid+disabled+file+label+position+__typename%7Dsku+stock_status+__typename%7D__typename%7D__typename%7D%7Dpage_info%7Btotal_pages+__typename%7Dtotal_count+__typename%7D%7D&variables=%7B%22currentPage%22%3A1%2C%22id%22%3A37%2C%22pageSize%22%3A6%2C%22filters%22%3A%7B%22category_id%22%3A%7B%22eq%22%3A%2237%22%7D%7D%2C%22sort%22%3A%7B%22relevance%22%3A%22DESC%22%7D%7D&operationName=category"`
    );
    expect(apolloClientGETURL.length).toMatchInlineSnapshot(`6223`);
    expect(result.length).toMatchInlineSnapshot(`1402`);
});
