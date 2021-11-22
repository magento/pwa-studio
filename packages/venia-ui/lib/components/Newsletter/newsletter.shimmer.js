import React from 'react';

import { useStyle } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './newsletter.module.css';
import defaultShimmerClasses from './newsletter.shimmer.module.css';

const NewsletterShimmer = props => {
    const classes = useStyle(
        defaultClasses,
        defaultShimmerClasses,
        props.classes
    );

    return (
        <div className={classes.root}>
            <Shimmer
                key="title"
                classes={{
                    root_rectangle: classes.shimmerItem
                }}
            />
            <Shimmer
                key="text"
                classes={{
                    root_rectangle: classes.shimmerParagraphLine
                }}
            />
            <Shimmer
                key="text2"
                width="50%"
                classes={{
                    root_rectangle: classes.shimmerItem
                }}
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
