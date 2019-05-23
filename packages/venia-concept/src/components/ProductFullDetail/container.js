import { connect } from 'src/drivers';
import ProductFullDetail from './ProductFullDetail';

const mapStateToProps = ({ cart }) => {
    return {
        isAddingItem: cart.isAddingItem
    };
};

export default connect(mapStateToProps)(ProductFullDetail);
