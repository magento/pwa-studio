import React, { createContext, useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '@magento/peregrine/lib/store/actions/catalog/actions';
import * as asyncActions from '@magento/peregrine/lib/store/actions/catalog/asyncActions';

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
