import { connect } from 'react-redux';

import { executeSearch } from 'src/actions/app';
import SearchBar from './searchBar';

const mapDispatchToProps = { executeSearch };

export default connect(
    null,
    mapDispatchToProps
)(SearchBar);
