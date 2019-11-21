import React, { createContext, useContext } from 'react';

import { groups, pages } from './routes.yml';

const RoutesContext = createContext();
const { Provider } = RoutesContext;

const contextValue = {
    groups: new Map(groups),
    pages: new Map(pages)
};

const Routes = props => {
    const { children } = props;

    return <Provider value={contextValue}>{children}</Provider>;
};

export default Routes;

export const useRoutes = () => useContext(RoutesContext);
