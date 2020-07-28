import gql from 'graphql-tag';

// TODO: Once https://github.com/magento/magento2/issues/28584 is released we
// can start using this fragment in category.gql.js
export const GalleryItemFragment = gql`
    fragment GalleryItemFragment on ProductInterface {
        id
        name
        price {
            regularPrice {
                amount {
                    currency
                    value
                }
            }
        }
        small_image {
            url
        }
        url_key
    }
`;
