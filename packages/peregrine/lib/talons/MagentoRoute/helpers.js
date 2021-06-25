// 301 is permanent; 302 is temporary.
const REDIRECT_CODES = new Set().add(301).add(302);
export const isRedirect = code => REDIRECT_CODES.has(code);

// Webpack injects `fetchRootComponent` as a global during the build.
// Depending on the environment, it may be a CommonJS or ES module.
const warning = () => new Error('fetchRootComponent is not defined');
const { fetchRootComponent = warning } = globalThis;
export const getRootComponent =
    fetchRootComponent.default || fetchRootComponent;
