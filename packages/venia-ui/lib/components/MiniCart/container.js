import { connect } from '@magento/venia-drivers';
import { isEmptyCartVisible, isMiniCartMaskOpen } from '../../selectors/cart';
import { closeDrawer } from '../../actions/app';
import {
    beginEditItem,
    endEditItem,
    updateItemInCart,
    removeItemFromCart
} from '../../actions/cart';
import { cancelCheckout } from '../../actions/checkout';

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
