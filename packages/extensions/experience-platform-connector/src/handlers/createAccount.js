const canHandle = event => event.type === 'USER_CREATE_ACCOUNT';

const handle = (sdk, event) => {
    const { payload } = event;

    const { firstName, lastName, email } = payload;

    const accountContext = {
        firstName,
        lastName,
        emailAddress: email
    };

    sdk.context.setAccount(accountContext);
    sdk.publish.createAccount({
        personalEmail: {
            address: email
        }
    });
};

export default {
    canHandle,
    handle
};
