import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';

import actions from '../actions/catalog/actions';
import * as asyncActions from '../actions/catalog/asyncActions';
import { connect } from '../drivers';

export const CatalogContext = createContext();

const CatalogContextProvider = props => {
    const { actions, asyncActions, catalogState, children } = props;

    const catalogApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => [catalogState, catalogApi], [
        catalogApi,
        catalogState
    ]);

    return (
        <CatalogContext.Provider value={contextValue}>
            {children}
        </CatalogContext.Provider>
    );
};

const mapStateToProps = ({ catalog }) => ({ catalogState: catalog });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CatalogContextProvider);
