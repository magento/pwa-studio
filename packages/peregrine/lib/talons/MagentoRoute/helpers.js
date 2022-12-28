import loadable from '@loadable/component';

// 301 is permanent; 302 is temporary.
const REDIRECT_CODES = new Set().add(301).add(302);
export const isRedirect = code => REDIRECT_CODES.has(code);

// Webpack injects `fetchLoadableRootComponent` as a global during the build.
// Depending on the environment, it may be a CommonJS or ES module.
const warning = () => new Error('fetchLoadableRootComponent is not defined');
const {
    fetchLoadableRootComponent = warning('fetchLoadableRootComponent')
} = globalThis;
export const getRootComponent = (type, variant) => {
    return loadable(
        (fetchLoadableRootComponent.default || fetchLoadableRootComponent)(
            type,
            variant
        )
    );
};
