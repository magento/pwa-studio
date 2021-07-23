import { useCallback } from 'react';
import { useAppContext } from '../context/app';

export const SHIMMER_TYPE_SUFFIX = '_SHIMMER';

export default (rootType) => {
    const [, { actions: { setNextRootComponent } }] = useAppContext();
    const type = `${rootType.toUpperCase()}${SHIMMER_TYPE_SUFFIX}`;

    const handleClick = useCallback(() => {
        setNextRootComponent(type);
    }, [setNextRootComponent, type]);

    return {
        handleClick
    };
};
