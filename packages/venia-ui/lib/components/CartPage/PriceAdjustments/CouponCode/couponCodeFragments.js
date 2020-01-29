import gql from 'graphql-tag';

export const AppliedCouponsFragment = gql`
    fragment AppliedCouponsFragment on Cart {
        id
        applied_coupons {
            code
        }
    }
`;
