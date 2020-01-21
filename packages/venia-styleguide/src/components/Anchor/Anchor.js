import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import Link from '../Link';

const Anchor = props => {
    const { fragment, ...restProps } = props;
    const { hash } = useLocation();
    const ref = useRef(null);

    useEffect(() => {
        const { current: element } = ref;

        if (element && hash === fragment) {
            element.scrollIntoView();
        }
    }, [fragment, hash]);

    return <Link ref={ref} to={fragment} {...restProps} />;
};

export default Anchor;

Anchor.defaultProps = {
    children: '#'
};
