import MiniCart from './miniCart';
import { getCartDetails } from 'src/actions/cart';
import { connect } from 'react-redux';

const mapStateToProps = ({ cart }) => {
    const details = cart && cart.details;
    const cartId = details && details.id;
    const cartCurrencyCode =
        details && details.currency && details.currency.quote_currency_code;

    return {
        cart,
        cartId,
        cartCurrencyCode
    };
};

const mapDispatchToProps = { getCartDetails };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MiniCart);
