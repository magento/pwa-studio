import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';

import Button from 'src/components/Button';
import timeout from 'src/util/timeout';

const submitOrderAction = () =>
    Object.assign(
        async dispatch => {
            await timeout(2000); // TODO: replace with api call
            dispatch({ type: 'ACCEPT_ORDER' });
        },
        { type: 'SUBMIT_ORDER' }
    );

class SubmitButton extends Component {
    static propTypes = {
        submitOrder: func
    };

    render() {
        const { submitOrder } = this.props;

        return <Button onClick={submitOrder}>Place Order</Button>;
    }
}

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = dispatch => ({
    submitOrder: () => dispatch(submitOrderAction())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmitButton);
