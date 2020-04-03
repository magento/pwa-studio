import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// See: https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top

// Note: using { behavior: 'smooth' } in scrollTo() options often won't have an
// effect because the re-render happens before smooth scrolling starts. Some
// browsers try to do this internally but it's not universal.

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            behavior: 'smooth',
            left: 0,
            top: 0,
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
