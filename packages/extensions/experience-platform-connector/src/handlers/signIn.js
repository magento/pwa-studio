const canHandle = event => event.type === 'USER_SIGN_IN';

const handle = (sdk, event) => {
    const { payload } = event;

    sdk.context.setShopper({
        shopperId: 'logged-in'
    });

    const { firstName, lastName, email } = payload;

    const accountContext = {
        firstName: firstName,
        lastName: lastName,
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
