import { gql } from '@apollo/client';

export const AppliedCouponsFragment = gql`
    fragment AppliedCouponsFragment on Cart {
        id
        applied_coupons {
            code
        }
    }
`;
