import { connect } from 'react-redux';
import ProductStickyFooter from './productStickyFooter';

const mapStateToProps = ({ cart }) => {
    const { addToCartError, isAddingToCart } = cart;

    return {
        addToCartError,
        isAddingToCart
    };
};

export default connect(mapStateToProps)(ProductStickyFooter);
