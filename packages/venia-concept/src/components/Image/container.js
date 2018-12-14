import { connect } from 'react-redux';
import Image from './image.js';

const mapStateToProps = ({ app }) => ({
    isOnline: app.isOnline,
    hasBeenOffline: app.hasBeenOffline
});

export default connect(
    mapStateToProps,
    null
)(Image);
