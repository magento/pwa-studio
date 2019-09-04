import { connect } from '@magento/venia-drivers';
import {
    isEmptyCartVisible,
    isMiniCartMaskOpen
} from '@magento/peregrine/lib/store/selectors/cart';
import { closeDrawer } from '@magento/peregrine/lib/store/actions/app';
import {
    beginEditItem,
    endEditItem,
    updateItemInCart,
    removeItemFromCart
} from '@magento/peregrine/lib/store/actions/cart';
import { cancelCheckout } from '@magento/peregrine/lib/store/actions/checkout';

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
