import React, {
    Fragment,
    forwardRef,
    useImperativeHandle,
    useRef
} from 'react';

import classes from './scrollAnchor.css';

const ScrollAnchor = forwardRef((props, ref) => {
    const anchorRef = useRef();

    useImperativeHandle(ref, () => ({
        scrollIntoView() {
            anchorRef.current.scrollIntoView();
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
