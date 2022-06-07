const canHandle = event => event.type === 'USER_ACCOUNT_UPDATE';

const handle = (sdk, event) => {
    const { payload } = event;

    const { email, firstName, lastName } = payload;

    const accountContext = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: email
    };

    sdk.context.setAccount(accountContext);
    sdk.publish.editAccount(accountContext);
};

export default {
    canHandle,
    handle
};
