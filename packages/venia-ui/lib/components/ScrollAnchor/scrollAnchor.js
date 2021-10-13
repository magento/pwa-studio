import { shape, string } from 'prop-types';
import React, {
    Fragment,
    forwardRef,
    useImperativeHandle,
    useRef
} from 'react';

import classes from './scrollAnchor.module.css';

const ScrollAnchor = forwardRef((props, ref) => {
    const anchorRef = useRef();

    useImperativeHandle(ref, () => ({
        scrollIntoView() {
            anchorRef.current.scrollIntoView(...arguments);
        }
    }));

    return (
        <Fragment>
            <div ref={anchorRef} className={classes.anchor} />
            {props.children}
        </Fragment>
    );
});

export default ScrollAnchor;

ScrollAnchor.propTypes = {
    classes: shape({
        anchor: string
    })
};
