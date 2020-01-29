import gql from 'graphql-tag';

// TODO: Solve the EE feature problem.
const IS_EE = true;

export const GiftCardFragment = IS_EE
    ? gql`
          fragment GiftCardFragment on Cart {
              applied_gift_cards {
                  applied_balance {
                      currency
                      value
                  }
                  code
                  current_balance {
                      currency
                      value
                  }
                  expiration_date
              }
          }
      `
    : gql`
          fragment GiftCardFragment on Cart {
              __typename
          }
      `;
