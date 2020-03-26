import React, { Children, Fragment, useMemo } from 'react';

import classes from './AppBar.css';

const AppBar = props => {
    const { children } = props;

    const columns = useMemo(() => {
        const [primary, logo, secondary] = Children.toArray(children);

        return (
            <Fragment>
                <div key="primary" className={classes.primary}>
                    {primary}
                </div>
                <div key="logo" className={classes.logo}>
                    {logo}
                </div>
                <div key="secondary" className={classes.secondary}>
                    {secondary}
                </div>
            </Fragment>
        );
    }, [children]);

    return <header className={classes.root}>{columns}</header>;
};

export default AppBar;
