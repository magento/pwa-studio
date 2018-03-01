import webpackInterop from './webpackInterop';

/**
 * @description Uses the webpack runtime to async load a chunk, and then returns
 * the default export for the module specified with moduleID
 * @param {number} chunkID
 * @param {number} moduleID
 */
export default function fetchRootComponent(chunkID, moduleID) {
    return webpackInterop.loadChunk(chunkID).then(() => {
        const modNamespace = webpackInterop.require(moduleID);
        if (!modNamespace) {
            throw new Error(
                `Expected chunkID ${chunkID} to have module ${
                    moduleID
                }. Cannot render this route without a matching RootComponent`
            );
        }

        if (typeof modNamespace.default !== 'function') {
            throw new Error(
                `moduleID ${moduleID} in chunk ${
                    chunkID
                } was missing a default export for a RootComponent`
            );
        }

        return modNamespace.default;
    });
}
