import { connect } from 'react-redux';
import ProductStickyFooter from './productStickyFooter';

const mapStateToProps = ({ cart }) => {
    const { recentAddItemHadError, addToCartActiveRequest } = cart;

    return {
        addToCartError: recentAddItemHadError,
        addToCartActiveRequest
    };
};

export default connect(mapStateToProps)(ProductStickyFooter);
