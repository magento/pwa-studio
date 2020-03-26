import React from 'react';

import classes from './Branding.css';

const Branding = () => {
    return (
        <div className={classes.root}>
            <div className={classes.logo} />
            <div className={classes.search} />
        </div>
    );
};

export default Branding;
