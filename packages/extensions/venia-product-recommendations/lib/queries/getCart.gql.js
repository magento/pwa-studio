import { gql } from '@apollo/client';

export const ProductRecommendationsFragment = gql`
  fragment ProductRecommendationsFragment on Cart {
    total_quantity
    prices {
      subtotal_excluding_tax {
        value
      }
      subtotal_including_tax {
        value
      }
    }
    id
    items {
      id
      uid
      ... on ConfigurableCartItem {
        configured_variant {
          uid
          sku
        }
      }
      product {
        id
        name
        url_key
        url_suffix
        sku
        image {
          url
        }
        thumbnail {
          url
          label
        }
      }
      prices {
        price {
          currency
          value
        }
      }
      quantity
    }
  }
`;

const GET_CART_QUERY = gql`
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) @connection(key: "Cart") {
      id
      ...ProductRecommendationsFragment
    }
  }
  ${ProductRecommendationsFragment}
`;

export default GET_CART_QUERY;
