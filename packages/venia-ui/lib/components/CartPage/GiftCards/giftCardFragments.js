import gql from 'graphql-tag';

// TODO: Solve the EE feature problem.
const IS_EE = true;

export const GiftCardFragment = IS_EE
    ? gql`
          fragment GiftCardFragment on Cart {
              applied_gift_cards {
                  code
              }
          }
      `
    : gql`
          fragment GiftCardFragment on Cart {
              __typename
          }
      `;
