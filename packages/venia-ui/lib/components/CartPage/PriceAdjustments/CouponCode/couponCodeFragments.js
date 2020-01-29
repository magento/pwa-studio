import gql from 'graphql-tag';

export const AppliedCouponsFragment = gql`
    fragment AppliedCouponsFragment on Cart {
        applied_coupons {
            code
        }
    }
`;
