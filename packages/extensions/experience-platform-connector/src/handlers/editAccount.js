const canHandle = event => event.type === 'USER_ACCOUNT_UPDATE';

const handle = (sdk, event) => {
    const { payload } = event;

    const { email, firstName, lastName } = payload;

    const accountContext = {
        firstName,
        lastName,
        emailAddress: email
    };

    sdk.context.setAccount(accountContext);
    sdk.publish.editAccount({
        personalEmail: {
            address: email
        }
    });
};

export default {
    canHandle,
    handle
};
