const canHandle = event => event.type === 'USER_SIGN_OUT';

const handle = (sdk, event) => {
    // Since the sign-out event precedes a hard refresh, we need make sure
    // the logic happens before the window content unloads
    window.addEventListener('beforeunload', e => {
        // Cancel the event
        e.preventDefault();

        sdk.context.setShopper({
            shopperId: 'guest'
        });

        sdk.publish.signOut(event.payload);

        // Return nothing so we don't get the prompt
        return;
    });
};

export default {
    canHandle,
    handle
};
