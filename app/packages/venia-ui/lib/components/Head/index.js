import React, { useMemo } from 'react';

import { Helmet } from 'react-helmet-async';
import { useStoreConfigContext } from '../../../../peregrine/lib/context/storeConfigProvider';

export { default as HeadProvider } from './headProvider';

Helmet.defaultProps.defer = false;

export const Link = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <link {...tagProps}>{children}</link>
        </Helmet>
    );
};

export const Meta = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <meta {...tagProps}>{children}</meta>
        </Helmet>
    );
};

export const Style = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <style {...tagProps}>{children}</style>
        </Helmet>
    );
};

export const Title = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <title {...tagProps}>{children}</title>
        </Helmet>
    );
};

export const StoreTitle = props => {
    const { children, ...tagProps } = props;

    const storeConfigData = useStoreConfigContext();

    const storeName = useMemo(() => {
        return storeConfigData ? storeConfigData.storeConfig.store_name : STORE_NAME;
    }, [storeConfigData]);

    let titleText;
    if (children) {
        titleText = `${children} - ${storeName}`;
    } else {
        titleText = storeName;
    }

    return (
        <Helmet>
            <title {...tagProps}>{titleText}</title>
        </Helmet>
    );
};
