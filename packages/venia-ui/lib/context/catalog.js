import React, { createContext, useMemo } from 'react';

import catalogActions from '../actions/catalog';
import { connect } from '../drivers';

export const CatalogContext = createContext();

const CatalogContextProvider = props => {
    const { catalog: catalogState, children, updateCategories } = props;

    const catalogApi = useMemo(
        () => ({
            updateCategories
        }),
        [updateCategories]
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

const mapStateToProps = ({ catalog }) => ({ catalog });

const mapDispatchToProps = {
    updateCategories: catalogActions.updateCategories
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CatalogContextProvider);
