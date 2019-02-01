import { connect } from 'src/drivers';

import Search from './search';
import { executeSearch, toggleSearch } from 'src/actions/app';

const mapStateToProps = ({ app }) => {
    const { searchOpen } = app;

    return { searchOpen };
};

const mapDispatchToProps = { executeSearch, toggleSearch };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
