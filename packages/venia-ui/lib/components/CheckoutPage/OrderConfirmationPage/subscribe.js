import React from 'react';

import classes from './orderConfirmationPage.css';

const Subscribe = () => {
    return (
        <div className={classes.subscribe_container}>
            <h2 className={classes.heading}>{'Be the first to know'}</h2>
            <div className={classes.subscribe_text}>
                {
                    'Sign up for emails that tell you when your favorite items are on sale and when we preview new collections.'
                }
            </div>
            <div className={classes.subscribe_text}>
                {'Email and Subscribe button go here.'}
            </div>
        </div>
    );
};

export default Subscribe;
