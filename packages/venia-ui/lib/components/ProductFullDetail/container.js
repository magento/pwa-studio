import { connect } from '@magento/venia-drivers';
import ProductFullDetail from './productFullDetail';

const mapStateToProps = ({ cart }) => {
    return {
        isAddingItem: cart.isAddingItem
    };
};

export default connect(mapStateToProps)(ProductFullDetail);
