import { connect } from '@magento/venia-drivers';
import { isCartEmpty } from '../../selectors/cart';
import { closeDrawer } from '../../actions/app';
import { updateItemInCart, removeItemFromCart } from '../../actions/cart';
import { cancelCheckout } from '../../actions/checkout';

import MiniCart from './miniCart';

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart,
        isCartEmpty: isCartEmpty(state)
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
