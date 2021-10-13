import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import Shimmer from '../Shimmer';

import { useStyle } from '../../classify';
import defaultClasses from './tileList.module.css';

const TileListShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const tiles = useMemo(() => {
        return Array.from({ length: 3 })
            .fill(null)
            .map((value, index) => {
                return <Shimmer width={3} height={3} key={`tile-${index}`} />;
            });
    }, []);

    return <div className={classes.root}>{tiles}</div>;
};

TileListShimmer.defaultProps = {
    classes: {}
};

TileListShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default TileListShimmer;
