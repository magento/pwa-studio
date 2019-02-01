import { connect } from 'src/drivers';

import { executeSearch } from 'src/actions/app';
import SearchBar from './searchBar';

const mapStateToProps = ({ app }) => ({ app });
const mapDispatchToProps = { executeSearch };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchBar);
