import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';

import Button from 'src/components/Button';

class SubmitButton extends Component {
    static propTypes = {
        submitOrder: func
    };

    render() {
        const { submitOrder } = this.props;

        return <Button onClick={submitOrder}>Place Order</Button>;
    }
}

const mapDispatchToProps = dispatch => ({
    submitOrder: () => dispatch({ type: 'SUBMIT_ORDER', payload: null })
});

export default connect(
    null,
    mapDispatchToProps
)(SubmitButton);
