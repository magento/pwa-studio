import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './filterSidebar.css';

const FilterSidebar = (props) => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <aside className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width="95%" height="70vh" style={{ marginBottom: 25 }} />
        </aside>
    )
};

FilterSidebar.defaultProps = {
    classes: {}
};

FilterSidebar.propTypes = {
    classes: shape({
        root: string
    })
};

export default FilterSidebar;

