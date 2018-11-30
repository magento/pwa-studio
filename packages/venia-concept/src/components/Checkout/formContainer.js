import { connect } from 'react-redux';
import { compose } from 'redux';
import classify from 'src/classify';
import Form from './form';
import defaultClasses from './form.css';

const mapStateToProps = ({
    checkout: { isAddressIncorrect, incorrectAddressMessage }
}) => ({ isAddressIncorrect, incorrectAddressMessage });

export default compose(
    classify(defaultClasses),
    connect(mapStateToProps)
)(Form);
