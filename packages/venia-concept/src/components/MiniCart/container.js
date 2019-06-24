import { connect } from 'src/drivers';
import { isEmptyCartVisible, isMiniCartMaskOpen } from 'src/selectors/cart';
import { closeDrawer } from 'src/actions/app';
import {
    beginEditItem,
    endEditItem,
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
    closeDrawer,
    endEditItem,
    removeItemFromCart,
    updateItemInCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniCart);
