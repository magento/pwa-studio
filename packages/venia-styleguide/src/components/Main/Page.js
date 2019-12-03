import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';

const Page = () => {
    const { slug } = useParams();

    const Component = lazy(() =>
        import(/* webpackMode: "lazy-once" */
        /* webpackPrefetch: true */
        `../../pages/${slug}`)
    );

    return (
        <Suspense fallback={'loading...'}>
            <Component />
        </Suspense>
    );
};

export default Page;
