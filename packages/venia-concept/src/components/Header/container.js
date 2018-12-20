import { connect } from 'react-redux';

import Header from './header';
import { toggleSearch } from 'src/actions/app';

const mapStateToProps = ({ app }) => {
    const { searchOpen, autocompleteOpen } = app;
    return {
        searchOpen,
        autocompleteOpen
    };
};

const mapDispatchToProps = { toggleSearch };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
