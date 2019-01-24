import { connect } from 'react-redux';
import ProductStickyFooter from './productStickyFooter';

const mapStateToProps = ({ cart }) => {
    const { addToCartError, isAddingToCart } = cart;

    return {
        // TODO: Currently this is a boolean, but we probably want to have
        // this contain the error message or identifier for display.
        addToCartError,
        isAddingToCart
    };
};

export default connect(mapStateToProps)(ProductStickyFooter);
