import React from 'react';
import { shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './fieldIcons.module.css';

const FieldIcons = props => {
    const { after, before, children } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const style = {
        '--iconsBefore': before ? 1 : 0,
        '--iconsAfter': after ? 1 : 0
    };

    return (
        <span className={classes.root} style={style}>
            <span className={classes.input}>{children}</span>
            <span className={classes.before}>{before}</span>
            <span className={classes.after} aria-hidden="false">
                {after}
            </span>
        </span>
    );
};

FieldIcons.propTypes = {
    classes: shape({
        after: string,
        before: string,
        root: string
    })
};

export default FieldIcons;
