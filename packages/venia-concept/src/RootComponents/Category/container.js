import { connect } from 'src/drivers';

import Category from './category';
import { setCurrentPage, setPrevPageTotal } from 'src/actions/catalog';

const mapStateToProps = ({ catalog }) => {
    return {
        currentPage: catalog.currentPage,
        pageSize: catalog.pageSize,
        prevPageTotal: catalog.prevPageTotal
    };
};
const mapDispatchToProps = { setCurrentPage, setPrevPageTotal };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);
