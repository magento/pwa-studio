import Product from './Product';
import { addItemToCart, addConfigurableItemToCart } from 'src/actions/cart';
import { connect } from 'react-redux';

const mapDispatchToProps = {
    addItemToCart,
    addConfigurableItemToCart
};

export default connect(
    null,
    mapDispatchToProps
)(Product);
