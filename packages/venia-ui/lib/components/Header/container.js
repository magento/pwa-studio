import { connect } from '@magento/venia-drivers';

import { toggleSearch } from '@magento/peregrine/lib/store/actions/app';
import {
    getCartDetails,
    toggleCart
} from '@magento/peregrine/lib/store/actions/cart';

import Header from './header';

const mapStateToProps = ({ app, cart }) => {
    const { searchOpen } = app;

    return {
        cart,
        searchOpen
    };
};

const mapDispatchToProps = { getCartDetails, toggleCart, toggleSearch };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
