import { connect } from 'react-redux';

import { executeSearch } from 'src/actions/app';
import SearchBar from './searchBar';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { executeSearch };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchBar);
