import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

class CheckoutButton extends Component {
    static propTypes = {
        requestOrder: PropTypes.func
    };

    render() {
        const { requestOrder } = this.props;
        const iconDimensions = { height: 16, width: 16 };

        return (
            <Button onClick={requestOrder}>
                <Icon name="lock" attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    requestOrder: () => dispatch({ type: 'REQUEST_ORDER', payload: null })
});

export default connect(
    null,
    mapDispatchToProps
)(CheckoutButton);
