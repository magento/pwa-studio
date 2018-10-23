import Product from './Product';
import { addItemToCart } from 'src/actions/cart';
import { connect } from 'react-redux';

const mapDispatchToProps = {
    addItemToCart
};

export default connect(
    null,
    mapDispatchToProps
)(Product);
