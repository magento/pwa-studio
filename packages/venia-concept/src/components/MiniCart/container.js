import { connect } from 'src/drivers';
import { isEmptyCartVisible, isMiniCartMaskOpen } from 'src/selectors/cart';
import {
    beginEditItem,
    endEditItem,
    getCartDetails,
    updateItemInCart,
    removeItemFromCart
} from 'src/actions/cart';
import { cancelCheckout } from 'src/actions/checkout';

import MiniCart from './miniCart';

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart,
        isCartEmpty: isEmptyCartVisible(state),
        isMiniCartMaskOpen: isMiniCartMaskOpen(state)
    };
};

const mapDispatchToProps = {
    beginEditItem,
    cancelCheckout,
    endEditItem,
    getCartDetails,
    removeItemFromCart,
    updateItemInCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniCart);
