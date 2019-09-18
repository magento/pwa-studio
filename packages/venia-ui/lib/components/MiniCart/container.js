import { connect } from '@magento/venia-drivers';
import { closeDrawer } from '@magento/peregrine/lib/store/actions/app';
import {
    updateItemInCart,
    removeItemFromCart
} from '@magento/peregrine/lib/store/actions/cart';
import { cancelCheckout } from '@magento/peregrine/lib/store/actions/checkout';

import MiniCart from './miniCart';

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart,
        isCartEmpty: cart.isEmpty
    };
};

const mapDispatchToProps = {
    cancelCheckout,
    closeDrawer,
    removeItemFromCart,
    updateItemInCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniCart);
