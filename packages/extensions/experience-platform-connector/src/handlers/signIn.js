const canHandle = event => event.type === 'USER_SIGN_IN';

const handle = (sdk, event) => {
    const { payload } = event;

    sdk.context.setShopper({
        shopperId: 'logged-in'
    });

    const { firstname, lastname, email } = payload;

    const accountContext = {
        firstName: firstname,
        lastName: lastname,
        emailAddress: email
    };

    sdk.context.setAccount(accountContext);
    sdk.publish.signIn({
        personalEmail: {
            address: email
        }
    });
};

export default {
    canHandle,
    handle
};
