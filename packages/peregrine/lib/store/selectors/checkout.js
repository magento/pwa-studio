export const getAccountInformation = ({
    receipt: {
        order: {
            billing_address: {
                email,
                firstname: firstName,
                lastname: lastName
            } = {}
        }
    }
}) => ({ email, firstName, lastName });
