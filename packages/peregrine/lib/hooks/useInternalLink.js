import { useCallback } from 'react';
import { useAppContext } from '../context/app';

export const SHIMMER_TYPE_SUFFIX = '_SHIMMER';

export default rootType => {
    const [, appApi] = useAppContext();
    const { actions: appActions } = appApi;
    const { setNextRootComponent } = appActions;

    const type = `${rootType.toUpperCase()}${SHIMMER_TYPE_SUFFIX}`;

    const setShimmerType = useCallback(() => {
        globalThis.avoidDelayedTransition = true;
        setNextRootComponent(type);
    }, [setNextRootComponent, type]);

    return {
        setShimmerType
    };
};
