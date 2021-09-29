import React from 'react';
import Shimmer from '../Shimmer';
import { useStyle } from '../../classify';
import defaultClasses from './option.module.css';
import TileListShimmer from './tileList.shimmer';

const OptionShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <span>
                    <Shimmer width="100%" />
                </span>
            </h3>
            <TileListShimmer />
            <div className={classes.selection}>
                <Shimmer width="100%" />
            </div>
        </div>
    );
};

export default OptionShimmer;
