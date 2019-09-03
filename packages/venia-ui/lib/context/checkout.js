import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';

import actions from '../actions/checkout/actions';
import * as asyncActions from '../actions/checkout/asyncActions';
import { connect } from '../drivers';

export const CheckoutContext = createContext();

const CheckoutContextProvider = props => {
    const { actions, asyncActions, checkoutState, children } = props;

    const checkoutApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [checkoutState, checkoutApi], [
        checkoutApi,
        checkoutState
    ]);

    return (
        <CheckoutContext.Provider value={contextValue}>
            {children}
        </CheckoutContext.Provider>
    );
};

const mapStateToProps = ({ checkout }) => ({ checkoutState: checkout });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutContextProvider);
