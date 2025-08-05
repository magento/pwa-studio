const CREATE_EMPTY_CART = `
  mutation createEmptyCart($input: createEmptyCartInput) {
    createEmptyCart(input: $input)
  }
`;

const ADD_TO_CART = `
  mutation addProductsToCart(
    $cartId: String!
    $cartItems: [CartItemInput!]!
  ) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
          cart {
            items {
              product {
                name
                sku
              }
              quantity
            }
          }
          user_errors {
            code
            message
          }
      }
  }
`;

const ADD_TO_WISHLIST = `
  mutation addProductsToWishlist(
    $wishlistId: ID!
    $wishlistItems: [WishlistItemInput!]!
  ) {
      addProductsToWishlist(
        wishlistId: $wishlistId
        wishlistItems: $wishlistItems
      ) {
        wishlist {
          id
          name
          items_count
          items_v2 {
            items {
              id
              product {
                uid
                name
                sku
              }
            }
          }
        }
      }
  }
`;

const REMOVE_FROM_WISHLIST = `
  mutation removeProductsFromWishlist (
    $wishlistId: ID!
    $wishlistItemsIds: [ID!]!
  ) {
    removeProductsFromWishlist(
      wishlistId: $wishlistId
      wishlistItemsIds: $wishlistItemsIds
    ) {
        wishlist {
          id
          name
          items_count
          items_v2 {
            items {
              id
              product {
                uid
                name
                sku
              }
            }
          }
        }
      }
  }
`;

export {
    CREATE_EMPTY_CART,
    ADD_TO_CART,
    ADD_TO_WISHLIST,
    REMOVE_FROM_WISHLIST
};
