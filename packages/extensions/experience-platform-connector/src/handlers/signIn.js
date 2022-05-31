const canHandle = event => event.type === 'USER_SIGN_IN';

const handle = (sdk, event) => {
    sdk.context.setShopper({
        shopperId: 'logged-in'
    });

    sdk.publish.signIn(event.payload);
};

export default {
    canHandle,
    handle
};
