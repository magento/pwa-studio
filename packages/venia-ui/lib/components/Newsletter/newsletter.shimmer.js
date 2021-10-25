import React from 'react';

import { useStyle } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './newsletter.module.css';

const NewsletterShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Shimmer
                key="title"
                style={{ display: 'block', marginBottom: '1rem' }}
            />
            <Shimmer
                key="text"
                style={{ display: 'block', marginBottom: '0.5rem' }}
            />
            <Shimmer
                key="text2"
                width="50%"
                style={{ display: 'block', marginBottom: '1rem' }}
            />
            <div className={classes.form}>
                <Shimmer type="textInput" />
                <div className={classes.buttonsContainer}>
                    <Shimmer type="button" />
                </div>
            </div>
        </div>
    );
};

export default NewsletterShimmer;
