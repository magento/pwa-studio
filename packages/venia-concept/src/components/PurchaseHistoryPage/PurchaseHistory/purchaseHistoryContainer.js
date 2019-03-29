import { connect } from 'src/drivers';
import { transformItems } from 'src/selectors/purchaseHistory';
import PurchaseHistory from './purchaseHistory';
import actions, { getPurchaseHistory } from 'src/actions/purchaseHistory';

const mapStateToProps = ({ purchaseHistory: { isFetching, items} }) => {
    return {
        isFetching,
        items: transformItems(items)
    };
};

const mapDispatchToProps = {
    getPurchaseHistory,
    resetPurchaseHistory: actions.reset
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PurchaseHistory);
