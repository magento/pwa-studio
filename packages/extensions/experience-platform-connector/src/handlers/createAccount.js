const canHandle = event => event.type === 'USER_CREATE_ACCOUNT';

const handle = (sdk, event) => {
    const { payload } = event;

    const { firstName, lastName, email } = payload;

    const accountContext = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: email
    };

    sdk.context.setAccount(accountContext);
    sdk.publish.createAccount(payload);
};

export default {
    canHandle,
    handle
};
