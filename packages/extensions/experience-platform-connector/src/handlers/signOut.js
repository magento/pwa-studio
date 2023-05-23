const canHandle = event => event.type === 'USER_SIGN_OUT';

const handle = (sdk, event) => {
    const { payload } = event;

    sdk.context.setShopper({
        shopperId: 'guest'
    });

    // const { firstname, lastname, email } = payload;
    const accountContext = {
        firstName: '',
        lastName: '',
        emailAddress: ''
    };

    const cartContext = {
        id,
        prices: {},
        items: {},
        possibleOnepageCheckout: false,
        giftMessageSelected: false,
        giftWrappingSelected: false
    };

    sdk.context.setShoppingCart(cartContext);

    sdk.context.setAccount(accountContext);

    sdk.publish.signOut();
};

export default {
    canHandle,
    handle
};
